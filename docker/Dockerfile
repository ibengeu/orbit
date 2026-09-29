ARG NODE_IMAGE=node:24-bookworm-slim

FROM ${NODE_IMAGE} AS build
WORKDIR /app
COPY package.json package-lock.json ./
# Install exactly the reviewed lockfile graph.
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --prefer-offline --no-audit --no-fund
COPY . .
# Build a standalone Node server instead of Vercel output. No DATABASE_URL is
# present here, so the build's migrate step skips; the migrate job applies it.
RUN NITRO_PRESET=node-server npm run build

# One-shot jobs: Postgres migrations, the demo seed, and OptiStorage provisioning.
FROM ${NODE_IMAGE} AS tools
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --omit=dev --prefer-offline --no-audit --no-fund
COPY scripts/migrate.mjs scripts/migration-plan.mjs scripts/seed.mjs scripts/
COPY db/ db/
COPY migrations/ migrations/
COPY docker/provision-optistorage.mjs docker/
RUN install -d -o node -g node -m 0700 /run/orbit-storage
USER node

FROM ${NODE_IMAGE} AS runtime
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
COPY --from=build /app/.output ./.output
COPY docker/orbit-entrypoint.sh /usr/local/bin/orbit-entrypoint
RUN chmod 0755 /usr/local/bin/orbit-entrypoint \
 && install -d -o node -g node -m 0700 /run/orbit-storage
USER node
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/orbit-entrypoint"]
CMD ["node", ".output/server/index.mjs"]
