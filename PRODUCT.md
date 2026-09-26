# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Small teams that coordinate work across shared workspaces. They use Orbit to share updates and discuss work in channels, threads, and direct messages.

## Product Purpose

Orbit is a team communication workspace for small teams. Product success means an increase in daily active users. The baseline, target, measurement window, and active-user definition are undecided.

## Positioning

No distinct product differentiator has been decided. Keep positioning open. Do not claim unique functionality.

## Operating Context

People use Orbit in a browser. They move between workspaces, channels, direct messages, and threads. They can share messages and files, react, save messages for later, search loaded conversations, review activity, set presence and status, and start demo voice or video calls.

## Capabilities and Constraints

- The current implementation is a browser demo. It supports workspaces, channels, direct messages, threads, messages, attachments, reactions, saved messages, local search, presence, status, activity, preferences, and call history.
- Development data uses process-scoped storage. A process restart clears that data.
- Production sign-in and durable data are deferred and have not been verified. These are current implementation limits, not permanent product constraints.
- Calls persist lifecycle and history only. Participants are simulated. The app has no real-time media transport or workspace invitation flow.
- Auth-off API mode uses one shared public demo owner. Users must not enter private information in that mode.
- Future production authentication, durable storage, real-time calls, and invitations remain open product decisions.

## Brand Commitments

The product name is Orbit. No other binding brand or voice rules were provided.

## Evidence on Hand

- Seeded demo conversations and participants are in `src/lib/orbit/seed.ts`. Treat this content as fictional demonstration data.
- No verified customer evidence or daily-active-user measurements are present. Do not invent customer proof or report a DAU increase as achieved.

## Product Principles

- Help small teams coordinate work through shared conversations.
- Track product success through daily active users. Define a baseline and target before reporting progress.
- Separate current demo behavior from future production capability.
- Keep differentiation open until the product team decides what makes Orbit distinct.
