# Docker Compose

The compose stack runs Orbit's production build with Postgres and OptiStorage. Attachments go to OptiStorage over HTTPS through a Caddy proxy.

## Requirements

- Docker Desktop or Docker Engine with Compose v2.
- The OptiStorage source at `../optiStorage`. Compose builds it from that directory.
- `openssl` on the host, for secret generation.

## Start the stack

1. Generate the local secrets. The script keeps existing values.

   ```sh
   ./docker/init-secrets.sh
   ```

2. Start the stack. Compose builds an image only when it does not exist yet. Later starts reuse the local images.

   ```sh
   docker compose up -d
   ```

3. Open <http://127.0.0.1:3000>.

4. Optional: run the end-to-end check.

   ```sh
   ./docker/smoke.sh
   ```

   The check creates a workspace named "Compose smoke".

## Services

| Service | Role | Network access |
| --- | --- | --- |
| `orbit` | Built Node server (`.output/server/index.mjs`). | Host `127.0.0.1:3000` only. |
| `postgres` | Orbit data. | Internal `backend` network. |
| `migrate` | One-shot job. Applies `migrations/*.sql`. | Internal `backend` network. |
| `seed` | One-shot job. Writes the Orbit and Lumen demo data (`db/seed/orbit-demo.ts`) for the `public-demo` owner. Existing rows are kept. | Internal `backend` network. |
| `optistorage` | Object storage. S3 API on `:9000`. Admin API on container loopback `:9001`. | Internal `storage` network. |
| `caddy` | HTTPS for `storage.orbit.internal`, with Caddy's internal CA. | Internal `storage` network, fixed IP `172.30.10.2`. |
| `provision` | One-shot job. Creates the `orbit` OptiStorage application and the `orbit-attachments` bucket. | OptiStorage's network namespace. |

Startup order: `postgres` becomes healthy, then `migrate` runs. After that, `seed` and `provision` run, and then `orbit` starts. Orbit starts only when all three jobs succeed.

## Security design

- **HTTPS inside the stack:** OptiStorage refuses plain HTTP on a non-loopback listener. Caddy terminates TLS. OptiStorage trusts forwarded HTTPS only from Caddy's fixed address (`OPTISTORAGE_TRUSTED_PROXIES`). Orbit trusts only Caddy's internal root CA (`NODE_EXTRA_CA_CERTS`). Caddy copies only the public `root.crt` to the `caddy-ca` volume. The CA private keys stay in `caddy-data`, which no other service mounts.
- **Admin API is private:** The admin API listens on OptiStorage's loopback. Only the `provision` job reaches it, because that job shares the OptiStorage network namespace. No port publishes it.
- **Secrets stay out of images and the compose file:**
  - Secrets come from `docker/secrets/`, which is git-ignored, and are mounted as Docker secrets.
  - The OptiStorage application credentials are stored in the `orbit-storage-credentials` volume, with owner-only mode `0600`. Orbit mounts that volume read-only.
- **Only Orbit is published, and only on host loopback.** The `backend` and `storage` networks are internal, so those services have no internet access.

## Operations

| Task | Command |
| --- | --- |
| Show job logs | `docker compose logs migrate seed provision` |
| Run the demo seed again | `docker compose run --rm seed` |
| Stop the stack and keep the data | `docker compose down` |
| Delete all data (irreversible) | `docker compose down -v` |
| Rebuild Orbit after code changes | `docker compose build orbit migrate && docker compose up -d` |
| Rebuild OptiStorage after code changes | `docker compose build optistorage && docker compose up -d` |

After `docker compose down -v`, the next start creates a new OptiStorage application and bucket. Do not delete the `docker/secrets/` files while the volumes exist:

- The OptiStorage data depends on `optistorage_app_encryption_key`.
- The Postgres volume keeps the password it was created with.

## Limits

- **Auth is off:** The `orbit` service sets `VITE_AUTH_ENABLED: "false"`, which matches `.grok/app-env.json`. The server reads this value at runtime. All data belongs to the public demo owner.
- **Internal certificates only:** Caddy uses internal certificates. This stack is for local and staging use. For production, put OptiStorage behind a proxy with a public certificate, as the OptiStorage README describes.

## Local images

Compose tags the built images locally and reuses them. `docker compose up -d` does not rebuild an image that already exists.

| Image | Built from | Used by |
| --- | --- | --- |
| `orbit:local` | `docker/Dockerfile`, target `runtime` | `orbit` |
| `orbit-tools:local` | `docker/Dockerfile`, target `tools` | `migrate`, `seed`, `provision` |
| `optistorage:local` | `../optiStorage/Dockerfile` | `optistorage` |

Docker downloads the base images once and keeps them: `node:24-bookworm-slim`, `mcr.microsoft.com/dotnet/sdk:10.0`, `mcr.microsoft.com/dotnet/aspnet:10.0`, `postgres:17-alpine`, and `caddy:2.10-alpine`. A build downloads a base image again only when you pass `--pull`.

Package downloads are also cached between builds:

- `npm ci` uses a BuildKit cache for `/root/.npm`.
- `dotnet restore` uses a BuildKit cache for `/root/.nuget/packages`.

A change to the lockfile or a project file therefore downloads only new packages. `docker builder prune` deletes these caches.

## Demo data

The app contains no demo data in code. The demo content lives in `db/seed/orbit-demo.ts`, and `seedOrbitDemo` writes it to the database.

| Environment | How the seed runs |
| --- | --- |
| Docker Compose | The `seed` job, after `migrate`. |
| Local dev (`npm run dev`, PGlite) | The Vite dev bootstrap seeds the in-memory database on every start. |
| Any Postgres with `DATABASE_URL` | `npm run db:seed`. Set `ORBIT_SEED_OWNER` for an owner other than `public-demo`. |
| Vercel deploy | Never. Deployed databases get no demo data. |

The seed keeps existing rows, so it is safe to run again. It stops with an error when a demo conversation id already belongs to another workspace of the same owner. This prevents demo messages from attaching to that workspace.
