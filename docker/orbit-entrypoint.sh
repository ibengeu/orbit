#!/bin/sh
# Build server-only settings from secret files at start so no secret is baked
# into the image or written into the compose file.
set -eu

if [ -n "${POSTGRES_PASSWORD_FILE:-}" ]; then
  password=$(cat "$POSTGRES_PASSWORD_FILE")
  export DATABASE_URL="postgres://${POSTGRES_USER}:${password}@${POSTGRES_HOST}:5432/${POSTGRES_DB}"
  unset POSTGRES_PASSWORD_FILE password
fi

credentials=/run/orbit-storage/optistorage.env
if [ -r "$credentials" ]; then
  set -a
  . "$credentials"
  set +a
else
  echo "orbit: OptiStorage credentials are missing; attachments will use Postgres." >&2
fi

exec "$@"
