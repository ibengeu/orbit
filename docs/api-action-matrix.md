# Orbit UI action to API operation map

Authenticated mode scopes every resource to the verified user. Auth-off mode uses one shared public demo owner, including when a durable database is configured. The status column reports the behavior verified for the current demo and contract tests.

| UI action | API operation | Status | Notes |
|---|---|---|---|
| List workspaces | `GET /api/v1/workspaces` | Verified API and browser | User scoped. The demo provisions Orbit and Lumen with `POST` on first entry. |
| Create workspace | `POST /api/v1/workspaces` | Verified API and browser | Creates `#general`; duplicate names return 409. |
| Open workspace | `GET /api/v1/workspaces/{workspaceId}` | Verified API | UI navigation uses the hydrated collection. Cross-user access returns 404. |
| List channels and DMs | `GET /api/v1/workspaces/{workspaceId}/conversations` | Verified API and browser | User scoped. |
| Create channel or DM | `POST /api/v1/workspaces/{workspaceId}/conversations` | Verified API and browser | Stable server IDs. Validates names, participant count, and duplicate channels. |
| Send message or thread reply | `POST /api/v1/conversations/{conversationId}/messages` | Verified API and browser | JSON text or multipart with one file. Body limit 4,000 characters. Failed sends restore the draft. Parent message is checked. |
| Load conversation messages | `GET /api/v1/conversations/{conversationId}/messages` | Verified API and browser | `limit` 1–100, offset `cursor`, and optional soft-delete markers. |
| Edit own message | `PATCH /api/v1/messages/{messageId}` | Verified API and browser | Author-only. Optional `If-Match` ETag guard. |
| Delete own message | `DELETE /api/v1/messages/{messageId}` | Verified API and browser | Author-only soft delete. |
| Undo message delete | `PATCH /api/v1/messages/{messageId}` with `{ "deleted": false }` | Verified API and browser | Clears the soft-delete marker and uses the message version guard when supplied. |
| Add reaction | `PUT /api/v1/messages/{messageId}/reactions/{emoji}` | Verified API and browser | Idempotent per user and emoji. |
| Remove reaction | `DELETE /api/v1/messages/{messageId}/reactions/{emoji}` | Verified API and browser | Removes only the caller's reaction. |
| Save for later | `PUT /api/v1/messages/{messageId}/saved` | Verified API and browser | Idempotent. |
| Remove saved message | `DELETE /api/v1/messages/{messageId}/saved` | Verified API and browser | 204 on success. |
| View saved messages | `GET /api/v1/me/saved-messages` | Verified API and browser | Ordered by save time. |
| Mark a conversation read | `GET/PUT /api/v1/conversations/{conversationId}/read-state` | Verified API and browser | Stores and restores the caller's cursor. |
| Set presence or status | `GET/PATCH /api/v1/me/profile` | Verified API and browser | User scoped. |
| Change “always show time” | `GET/PATCH /api/v1/me/preferences` | Verified API and browser | User scoped. |
| Start voice or video call | `POST /api/v1/conversations/{conversationId}/calls` | Verified API and browser | Persists lifecycle only; current UI uses simulated participants. |
| Read, change, or end call | `GET/PATCH /api/v1/calls/{callId}` | Verified API and browser | `lobby`, `active`, and `ended`; terminal states cannot reopen. No media signaling. |
| View completed call history | `GET /api/v1/me/calls` | Verified API and browser | Ended calls use `limit` and `cursor` pagination. The browser loads all pages after local data is cleared. |
| Attach a file to a draft | Local draft state | Verified browser session only | Selecting and removing a draft file use browser state. |
| Send an attached file | `POST /api/v1/conversations/{conversationId}/messages` with multipart form | Verified API and browser | Stores one image, PDF, or plain text file up to 10 MB with its message. SVG is rejected. |
| Download an attached file | `GET /api/v1/messages/{messageId}/attachments/{attachmentId}` | Verified API and browser | Owner scoped. File downloads after a fresh page load. |
| Search conversations and messages | Local derived search | Local only | Search reads the already loaded transcript. A server search endpoint is not needed for the current UI. |
| Reset local view | Local state reset | Verified browser | Resets layout and clears unsent drafts. Server messages remain. Destructive account reset is not exposed without an explicit product requirement. |
| Mark activity read | Local activity state | Local only | The current activity view does not promise cross-device read state. |
| Sign in and sign out | Platform authentication boundary | Deferred by product decision | Local use stays a demo. Production requires platform auth and a durable database. The API requires the verified session and owner-scoped queries when auth is enabled. Production sign-in and deployment have not been verified. |

All API errors with bodies use RFC 9457 Problem Details with `Content-Type: application/problem+json`. Auth-off mode uses one shared public demo owner, even with a durable database. Do not enter private information in that mode. The local PGLite database survives requests and reloads while its process runs; a process restart clears it. Authenticated mode uses verified user IDs and owner-scoped queries. Production persistence and identity depend on the deferred platform setup.
