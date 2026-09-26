# Runtime Performance Fixes Implementation Plan

> **For agentic workers:** Use inline execution. Complete each task in order. Each test step must precede its implementation step.

**Goal:** Remove avoidable repeated message scans and per-message database round trips while preserving current search, message, reaction, deletion, and pagination behavior.

**Architecture:** Build conversation, reply, unread, and activity lookups once per input snapshot. Batch message, reaction, and attachment reads per page. Add keyset paging as an additive API option while preserving numeric offset cursors. Keep the current full-history client behavior so workspace-wide local search remains unchanged.

**Tech Stack:** React 19, Zustand, TanStack Start, TypeScript, PostgreSQL/PGlite, Node test runner, Playwright journey tests.

---

## Objective

Reduce reply rendering from `O(KN)` to `O(N + K)`, sidebar badge derivation from repeated `O(CN)` scans to one pass, and message-page database queries from `O(N)` per-message queries to a fixed number per page. Use keyset pagination for new clients so complete history reads do not repeatedly skip prior rows.

## Scope

Include behavior-preserving derived-data indexes, batched message reads, additive keyset cursors for messages and ended calls, API documentation, and regression tests.

Keep full-history loading and current client-side search semantics. Do not move attachment bytes, purge soft-deleted data, impose storage quotas, or change local draft persistence. Those changes need separate product and data-retention decisions.

## Assumptions

- Existing numeric `cursor` clients keep offset pagination and the current `nextCursor` response.
- New clients send both a numeric `cursor` for compatibility and an opaque `after` token for keyset pagination. Responses add optional `nextPageToken`.
- Message ordering is newest first, with message ID as a stable tie-breaker.
- Authorization remains scoped by the verified `context.userId` for every batch query.
- Keep current search result matching and ranking behavior.
- No benchmark suite or baseline timings exist. Report complexity and query-count estimates. Do not claim measured latency gains.

## TDD Plan

### Task 1: Preserve visible message and sidebar counts with indexed derivation

**Files:** `src/lib/orbit/derive.ts`, `src/components/orbit/messages.tsx`, `src/components/orbit/chrome.tsx`, `src/components/orbit/lists.tsx`, `scripts/orbit-journey.test.mjs`.

- [x] Review the existing thread, unread, activity, and saved-message journey tests.
- [x] Add a browser behavior test. It checks a thread reply count and confirms that the activity badge clears after “Mark all read.” Update stale test selectors to match the current public button text.
- [x] Add linear-time indexes for reply counts, unread counts, and activity badges. Combine unread counting with the activity scan. Pass the derived reply-count map to each message row. Use saved-ID maps with `O(S)` auxiliary space, where `S` is the number of saved messages.
- [x] Run the focused journey checks. Badge, scoped-search, and saved-message checks pass. The full journey file still has unrelated baseline failures. See Validation.

### Task 2: Keep search results stable while removing repeated conversation scans

**Files:** `src/components/orbit/search-dialog.tsx`, `scripts/orbit-journey.test.mjs`.

- [x] Review the existing scoped-search and search-navigation tests.
- [x] Use the scoped-search journey test to verify that results stay in the selected workspace. Build one conversation map per snapshot and score each matching message once per query.
- [x] Run the focused scoped-search and saved-message journeys. Both pass. Search matching and result ranking remain unchanged by inspection and behavior checks.

### Task 3: Batch message detail data and add stable keyset pagination

**Files:** `src/lib/orbit/api.ts`, `src/lib/orbit/api-client.ts`, `src/components/orbit/orbit-app.tsx`, `migrations/0003_orbit_page_indexes.sql`, `docs/api/openapi.yaml`, `src/lib/orbit/api.contract.test.ts`.

- [x] Review existing message ordering, reaction grouping, attachment metadata, soft-delete, owner-scope, and pagination contract tests.
- [x] Add keyset contract tests for equal timestamps, message details, deleted rows, malformed tokens, and owner isolation. The first keyset run failed because the response lacked `nextPageToken`; a precision test then caught timestamp truncation. Both regressions now pass.
- [x] Add optional `after` parsing and `nextPageToken` for messages and ended calls. Keep numeric offset cursors.
- [x] Select message rows once per page. Fetch reactions and attachment metadata in two batched, owner-scoped queries. Keep attachment bytes out of list responses.
- [x] Add message and ended-call indexes with stable ID tie-breaks.
- [x] Update client loaders and OpenAPI documentation.
- [x] Run the full API contract suite. All 21 API and compose tests pass.

### Task 4: Preserve the seeded workspace contents with batched inserts

**Files:** `src/lib/orbit/api.ts`, `src/lib/orbit/api.contract.test.ts`.

- [x] Review and extend the template provisioning contract test to compare every Orbit message and its details with the public API.
- [x] Batch conversation, message, and reaction inserts into at most one parameterized query per table. Keep `ON CONFLICT DO NOTHING` and parent-before-child order.
- [x] The exact reaction-order assertion exposed a real ordering change after batching. Add a stable microsecond sequence to reaction timestamps. The focused test and full API contract suite now pass.

## Security Review

- **A01:2025 applies.** Batch queries include `owner_id = context.userId`. A behavior test places another owner's message, reaction, and attachment under the same resource IDs. The first owner receives only their own data.
- **A04:2025 applies.** Keep the 100-row page cap and existing request-size limits. Keyset tokens must be validated before use. Add behavior tests for malformed tokens and oversized page limits.
- **A05:2025 applies.** Keep attachment bytes out of list queries. Return only current attachment metadata. A contract assertion confirms that list responses omit attachment content.
- **A08:2025 applies.** Do not add message bodies, attachment bytes, or tokens to performance logs. This change adds no logging.
- **A02:2025 is not applicable.** This change does not alter deployment or security configuration.
- **A03:2025 is not applicable.** This change does not add or update dependencies.
- **A06:2025 is not applicable.** This change does not alter authentication or session behavior.
- **A07:2025 applies.** Bulk insert SQL creates placeholder syntax from row counts. All fixture values remain bound parameters. Table and column names remain source-code constants. This prevents message text from becoming SQL.
- **A09:2025 is not applicable.** This change adds no server-side outbound request.
- **A10:2025 is not applicable.** This change does not update dependencies or runtimes.
- **NIST SSDF:** Review the SQL and cursor parsing under PW.7. Run executable behavior and security tests under PW.8 before release.

## Implementation Notes

- Keep the current full-history client state. The goal is to remove repeated work, not to change local search coverage.
- Treat cursor timestamp and ID as untrusted input. Validate the decoded timestamp and constrain the ID length before querying.
- Keep per-page result assembly at `O(L + R_page + A_page)` space. Target a small fixed number of SQL statements per page.
- Use the project’s existing API error and contract-test patterns. Do not add dependencies.
- The complexity check confirms that new API and derivation helpers stay at or below 10. Five existing UI render functions still exceed 10: `Section` (12), `ConversationButton` (18), the saved-row JSX callback in `LaterView` (14), `MessageRow` (43), and `SearchDialog` (15). A baseline check on `HEAD` reports the same values. This task adds no branching to those render paths. A broader UI decomposition would add unrelated interaction risk.

## Validation

- Run focused API contract and browser journey tests. Confirm the expected failure and pass for keyset pagination and reaction ordering.
- Run `npm run typecheck`; it passes.
- Run `npm test`. It fails on unrelated baseline Grok PWA and migration assertions. The default sandbox also blocks the journey server from binding. Some journey selectors still expect the old “Continue to demo” label. The three focused journeys updated for this work pass when run with local bind permission.
- Run `npm run lint`. It remains blocked by an existing empty catch block in `src/lib/app-data/client.server.ts:281`. The edited files add no lint errors.
- Confirm `git diff --check` passes and that list responses omit attachment bytes and batch queries remain owner-scoped.

## Completion Criteria

- Message and call keyset paging returns complete, stable pages without duplicates while numeric offset clients still work.
- Message list API uses a fixed number of data queries per page, independent of page row count.
- Reply counts, sidebar badges, saved-message resolution, and search retain current visible results.
- Seeded workspaces expose the same conversations, messages, authors, and reactions as before.
- Focused API tests, focused browser journeys, typecheck, and diff checks pass. Full project test and lint commands still report the unrelated baseline failures listed above. No storage-provider or retention-policy change is included.
