# Orbit REST API Implementation Plan

> **For agentic workers:** Execute this plan inline in the current task. Work in small behavior-focused TDD cycles.

**Goal:** Replace browser-only persistence for Orbit's shared product actions with authenticated, documented REST resources that the frontend consumes.

**Architecture:** Add versioned TanStack Start REST routes under `/api/v1`, backed by the existing SQL adapter and owner-keyed Postgres tables. Keep view state and unsent drafts in the browser. Use the verified Better Auth user ID when auth is enabled. Use one fixed public demo owner when auth is off. Publish the contract in `docs/api/openapi.yaml`.

**Tech Stack:** TanStack Start server routes, Better Auth, `@/lib/db`, PostgreSQL/PGLite, Zod, OpenAPI 3.1, Node test runner.

---

## Objective

Persist the chat actions that need server behavior. Return stable REST representations and RFC 9457 errors. Keep each user's Orbit data isolated.

## Scope

Include workspace and conversation collections, messages and threads, edits, soft deletes and restore, reactions, saved messages, read state, profile and preferences, call lifecycle records, authentication boundary wiring, frontend API consumption, API tests, and OpenAPI.

Keep temporary drafts, navigation, formatting controls, local search, reset, device permissions, microphone and camera toggles, and demo participant media in the browser. Include durable message attachment bytes with a 10 MB cap. This interface does not include workspace invitations or real-time media transport.

## Assumptions

- Orbit stores personal message text. The user selected a local demo now and authenticated per-user records when production setup begins.
- The local database is process scoped. Production needs platform authentication and a durable database. Production activation is deferred by the user.
- The current seeded workspace and messages remain as a private demo workspace for each account.
- The existing call interface labels calls as demos. The API will persist call lifecycle and history only.
- The file control accepts one image, PDF, or plain text file per message. Store the bytes with the owner-scoped message and serve them through an authorized resource.
- Existing uncommitted changes in `src/components/orbit/welcome.tsx` and `package-lock.json` belong to the user and must remain intact.

## TDD Plan

1. Review the existing Orbit, auth, database, and journey tests. Record current failures before adding API tests.
2. Add one API contract test for each observable behavior: authenticated collection reads, resource creation, validation, not found, cross-user isolation, authorization, persistence, and concurrency.
3. Run each new test before implementation. Confirm that it fails for the expected response or missing behavior.
4. Add the schema and the minimum route/service code for that behavior.
5. Run the focused API test. Refactor only after it passes.
6. Repeat for message, reaction, saved-message, read-state, profile, conversation, and call behaviors.
7. Add frontend contract checks for the public API response shapes. Wire the UI to the REST client after the API tests pass.
8. Run the focused API suite, existing test suite, typecheck, build, and browser checks where the current environment permits them.

## Security Review

### Applicable OWASP Top 10:2025 categories

- **A01 Broken Access Control:** Requests must use the verified session identity. Every row query must include that identity. Message edit and delete require author ownership. Cross-user reads must return no resource.
- **A02 Security Misconfiguration:** Production errors must not expose stack traces. API errors use a stable RFC 9457 representation. PWA wiring remains enabled, and a configured database fails closed when auth is disabled.
- **A03 Software Supply Chain Failures:** Use installed, locked dependencies. Do not add packages for this API.
- **A04 Insecure Design:** Bound JSON request bodies, file uploads, and page size. Accept one allowlisted file up to 10 MB. Stop reading as soon as a bound is crossed. Reject duplicate channel names and conflicting updates.
- **A05 Cryptographic Failures:** Keep Better Auth's managed session and cookie configuration. Do not store credentials in Orbit tables.
- **A06 Identification and Authentication Failures:** Require the verified Better Auth session when the deployment enables auth. Auth-off demo mode uses one explicit public owner and must not store private data.
- **A07 Injection:** Validate all input with Zod. Use parameterized SQL. Do not construct executable SQL from request values.
- **A08 Security Logging and Monitoring Failures:** Do not log message bodies, credentials, or tokens. Log only safe error summaries and use the RFC 9457 instance path for correlation.
- **A09 Server-Side Request Forgery:** Not applicable. The API does not fetch user-supplied URLs.
- **A10 Vulnerable and Outdated Components:** Reuse installed dependencies and existing lockfile versions.

### Planned behavior-focused security tests

- A missing session returns 401 with `application/problem+json`.
- A different account cannot read or mutate a workspace, message, or call.
- A user cannot edit or delete another author's message.
- Invalid or oversized inputs return safe 4xx responses.
- SQL-like text remains ordinary message text and cannot change query results.
- A stale `If-Match` value returns 412 and leaves persisted data unchanged.
- A stored attachment survives a fresh request, and another user cannot download it.
- A disallowed or oversized upload returns a safe 4xx Problem Details response.

### NIST SSDF alignment

Use threat-driven design and input limits before implementation (PW.1, PW.2). Protect identity and data boundaries (PW.4, PW.5). Run tests, typecheck, and build checks before completion (PW.7, PW.8). Keep dependencies unchanged and report any validation gate that the environment blocks (PS.2, RV.1).

### Categories that do not apply

- **A09:2025 is not applicable.** The API does not make outbound requests from user-provided URLs.
- **A05:2025 has no new application cryptography.** The work reuses Better Auth sessions and does not add encryption or key handling.

## Implementation Notes

- Keep Better Auth's schema outside app migrations because the product did not request accounts. Add `migrations/0002_orbit_api.sql` for user-scoped records.
- Use the REST API route, not server-function endpoints, so HTTP methods and statuses stay visible to clients.
- Keep IDs stable and scoped by verified user ID. Never accept the acting user ID in a request body.
- Use `ETag` and `If-Match` for message changes. Use a unique channel constraint for duplicate-name conflicts.
- Use `application/problem+json` with stable problem type URIs and a documented `errors` extension containing JSON Pointers.
- Do not add fake remote call signaling. The existing UI says other call participants are simulated.

## Validation

- Run the focused API test file with Node's built-in test runner.
- Run `npm test`, `npm run typecheck`, and `npm run build`.
- Verify the OpenAPI document parses and matches the route method/path set.
- Verify the frontend loads messages and uses API mutation responses.
- Run browser smoke checks if a usable app server and browser are available. Do not stop a server owned by the user.

## Completion Criteria

- Each server-backed UI action has a documented operation and implementation status.
- Any incomplete UI action is marked incomplete in the action matrix with its dependency.
- Each operation enforces the authenticated user boundary and validates its input.
- Persisted writes survive a fresh API request in the contract tests.
- Errors use RFC 9457 media type and stable problem types.
- The frontend consumes API responses for persisted state.
- Focused tests, typecheck, build, and available browser checks pass, or an environment blocker is listed with evidence.
