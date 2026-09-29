# Orbit

Orbit is a team communication workspace for small teams. People share updates in channels, discuss work in threads, and send direct messages. It runs in the browser.

> **Status: browser demo.** Auth is off by default, and all data belongs to one shared public demo owner. Do not enter private information. Production sign-in and deployment have not been verified.

## Features

- Workspaces, channels, direct messages, and threads.
- Messages with reactions, editing, soft delete and restore, and saved-for-later.
- File attachments: images, PDF, and plain text, up to 10 MiB.
- Search across loaded conversations, an activity view, presence, status, and preferences.
- Demo voice and video calls. Calls record only their lifecycle and history. Participants are simulated, and there is no media transport.

## Stack

| Layer | Technology |
| --- | --- |
| App | React 19, TanStack Start and Router, TypeScript |
| Styling | Tailwind CSS v4, Radix UI |
| State | zustand |
| API | REST under `/api/v1`, with RFC 9457 Problem Details errors |
| Database | Postgres (Neon or any Postgres) through `pg`. PGlite when `DATABASE_URL` is not set. |
| Attachments | [OptiStorage](../optiStorage) (S3 subset, SigV4) when configured. Postgres otherwise. |
| Deploy targets | Vercel (default), or a Node server in Docker |

## Quick start

### Requirements

- Node 24 with npm 11. The lockfile needs npm 11.
- Docker Desktop, only for the Compose stack.

### Local development

```sh
npm install
npm run dev
```

`npm run dev` picks the first free port from 8080 to 8199, except 8081. Read the port from the `[dev] using port` line. The local database is an in-memory PGlite instance. It is seeded with the demo data on every start and cleared on restart.

### Docker Compose

The Compose stack runs the production build with Postgres, OptiStorage, and a Caddy HTTPS proxy. It needs the OptiStorage source at `../optiStorage`.

```sh
./docker/init-secrets.sh   # first run only; keeps existing secrets
docker compose up -d
```

Open <http://127.0.0.1:3000>. To check attachments end to end, run `./docker/smoke.sh`.

See [docs/docker-compose.md](docs/docker-compose.md) for services, security design, and operations.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the dev server. |
| `npm run build` | Build for Vercel, then apply migrations when `DATABASE_URL` is set. |
| `npm run preview:restart` | Serve the production build on `127.0.0.1:8081`. |
| `npm run typecheck` | Run `tsc --noEmit`. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run the script tests and the API contract tests. |
| `npm run db:migrate` | Apply `migrations/*.sql` to `DATABASE_URL`. |
| `npm run db:seed` | Write the demo data to `DATABASE_URL`. |

To run the API contract tests alone:

```sh
node --experimental-strip-types --test src/lib/orbit/api.contract.test.ts
```

## Configuration

All of these values are server-only. Never give them a `VITE_` prefix, and never commit them.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. Without it, the app uses in-memory PGlite. |
| `VITE_AUTH_ENABLED` | `false` for the shared public demo owner. Any other value requires a verified session for every API call. |
| `OPTISTORAGE_ENDPOINT` | OptiStorage URL. It must be HTTPS, except `http://localhost` and `http://127.0.0.1`. |
| `OPTISTORAGE_BUCKET` | Bucket for attachments. |
| `OPTISTORAGE_ACCESS_KEY_ID` | OptiStorage application access key. |
| `OPTISTORAGE_SECRET_ACCESS_KEY` | OptiStorage application secret. |
| `NITRO_PRESET` | Build preset. Default: `vercel`. The Docker image uses `node-server`. |

Set all four `OPTISTORAGE_*` values or none. With none, attachments stay in Postgres. A partial or invalid set makes attachment requests fail with a safe `503`. See [docs/optistorage.md](docs/optistorage.md).

## Project layout

```text
src/
  components/orbit/     UI: sidebar, conversation, composer, threads, search, calls
  lib/orbit/            API handler (api.ts), API client, zustand store, types
  lib/orbit/object-store.server.ts   OptiStorage client
  routes/               TanStack routes, including /api/v1/*
db/seed/orbit-demo.ts   Demo data and the seed function
migrations/             SQL migrations, applied in name order
scripts/                Dev, build, migrate, seed, and test scripts
docker/                 Dockerfile, Caddy config, secret and smoke scripts
docker-compose.yml      Orbit, Postgres, OptiStorage, Caddy, and setup jobs
docs/                   API action matrix, Compose guide, OptiStorage guide
```

## Data and demo content

The app contains no demo data in code. `db/seed/orbit-demo.ts` holds the demo workspaces, conversations, and messages. `seedOrbitDemo` writes them to the database for the `public-demo` owner and keeps existing rows, so it is safe to run again.

| Environment | How the seed runs |
| --- | --- |
| Local dev (PGlite) | Automatically, on every dev-server start. |
| Docker Compose | The `seed` job. |
| Any Postgres | `npm run db:seed`. |
| Vercel deploy | Never. |

With auth on, a signed-in user starts with an empty workspace.

## API

The API lives under `/api/v1`. It covers workspaces, conversations, messages, reactions, attachments, saved messages, read state, profile, preferences, and calls. Lists use keyset pagination. Message edits and deletes support an `If-Match` ETag. Errors use `application/problem+json`. See [docs/api-action-matrix.md](docs/api-action-matrix.md) for every action and its verified status.

## Security notes

- **Owner scoping:** Every query filters by the owner. With auth on, the owner is the verified user. Auth-off mode uses the fixed `public-demo` owner. A client value never chooses the owner.
- **Attachments:** Downloads force `Content-Disposition: attachment` and `nosniff`. Active content is rejected on upload. The server generates object keys. A file name cannot choose a storage path.
- **Storage credentials:** They stay on the server. The API streams downloads, so object keys and credentials never reach the browser.
- **Compose stack:** OptiStorage's admin API is unreachable from Orbit, and only Orbit publishes a port, on host loopback.

## Known limits

- Local and auth-off data is shared and not private.
- Production sign-in and durable deployment are not verified.
- Search covers loaded conversations only.
- Old attachments stay in Postgres. Nothing moves them to OptiStorage.
- `npm test` includes two files that fail: `scripts/migration-plan.test.mjs` and `scripts/grok-pwa-plugin.test.mjs`. Both failed before the OptiStorage and seed changes.

## More documentation

- [Product notes](PRODUCT.md) and [design system](DESIGN.md)
- [API action matrix](docs/api-action-matrix.md)
- [Docker Compose guide](docs/docker-compose.md)
- [OptiStorage attachments](docs/optistorage.md)
