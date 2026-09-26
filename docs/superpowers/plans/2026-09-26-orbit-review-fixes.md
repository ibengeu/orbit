# Orbit Review Fix Plan

## Objective

Keep the demo usable with an auth-off database. Prevent account cache leakage. Persist call termination during navigation. Keep rapid message delete and undo in server order.

## Scope

Fix the four reviewed behaviors at the public API and browser boundaries. Keep the local demo model. Keep production sign-in and database activation deferred as requested. Do not change unrelated platform authentication helpers or PWA behavior.

## Assumptions

- An auth-off durable database is a public demo. All visitors share its demo records. The production deployment will enable verified per-user authentication.
- A page close can cancel ordinary fetches. A small keepalive request and a next-load retry can complete call termination.
- Server data is authoritative. Browser storage may keep only caller-scoped local view state and drafts.

## TDD Plan

For each behavior:

1. Review the existing API and browser test.
2. Update that test if it already covers the behavior.
3. Write one failing public behavior test.
4. Run the test and confirm the expected failure.
5. Implement the minimum change.
6. Run the focused test, then refactor if needed.
7. Run the relevant suite and repeat for the next behavior.

Cover the auth-off database boundary, account switching, pagehide call termination, and rapid delete then undo in separate cycles.

## Security Review

- **A01 Broken Access Control:** Cached records can cross accounts. Scope browser storage to the verified user and replace server data from the current account snapshot. Test a second account against a first account cache.
- **A02 Security Misconfiguration:** Auth-off database mode can reject every request. Give it one explicit public demo owner. Test the HTTP response. Keep production per-user mode fail closed when authentication is enabled.
- **A04 Insecure Design:** Browser shutdown and concurrent mutations can lose state. Use a bounded keepalive request with next-load retry. Serialize message delete and undo. Test server postconditions after reload.
- **A06 Authentication Failures:** Never derive the owner from a client-supplied ID in authenticated mode. Test the verified account boundary.
- **A08 Security Logging and Monitoring:** Do not log message text, draft text, tokens, or call details in error paths.
- **A03 Supply Chain:** Reuse locked dependencies. No new package is needed.
- **A05 Cryptographic Failures:** N/A. The fixes add no cryptography or credential handling.
- **A07 Injection:** N/A for new inputs. The fixes add no query, command, or template input.
- **A09 SSRF:** N/A. The fixes add no server outbound request to a user-selected destination.
- **A10 Outdated Components:** N/A to this change. No dependency or runtime version changes.

NIST SSDF alignment: model the trust boundaries before code (PW.1), use verified identity and safe defaults (PW.4 and PW.5), and test public security behavior and race outcomes (PW.7 and PW.8).

## Implementation Notes

- One literal public demo owner is permitted for auth-off database mode. Do not use a client-provided owner ID.
- Remove the unscoped `orbit:v1` cache from account hydration. Keep user-local view state under a verified-user key.
- Keep `PATCH /calls/{callId}` as the resource operation for call termination.
- Queue delete and undo for each message ID while leaving other messages independent.
- Existing media-device UI branches exceed the complexity limit in `Lobby`, `ActiveCall`, `enablePreview`, `joinDemoCall`, and `retryDevice`. This review changes pagehide handling only. Refactoring device permission and rendering flows without dedicated media-device cases would add unrelated regression risk; those functions remain documented exceptions for a focused follow-up.

## Validation

- Run focused API and browser tests after each cycle.
- Run the full Orbit API and browser suites.
- Run typecheck, build, lint for touched files, complexity analysis for new functions, OpenAPI validation, and `git diff --check`.
- Report unrelated repository-wide failures separately.

## Completion Criteria

- An auth-off database demo can load through the API.
- One account cannot see another account's cached messages, workspaces, or drafts.
- A call leaves the active server state after navigation or next-load recovery.
- Rapid delete and undo leave the message restored on the server after reload.
- Relevant tests pass and any external limitation is stated.
