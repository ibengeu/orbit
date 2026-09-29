#!/bin/sh
# Generate local secrets for docker compose. Existing values are kept so data
# encrypted with them stays readable. Never commit docker/secrets/.
set -eu
dir="$(cd "$(dirname "$0")" && pwd)/secrets"
umask 077
mkdir -p "$dir"
chmod 0700 "$dir"

create() {
  [ -s "$dir/$1" ] && { echo "keep    $1"; return; }
  printf '%s' "$2" > "$dir/$1"
  echo "created $1"
}

create postgres_password "$(openssl rand -hex 24)"
create optistorage_admin_token "$(openssl rand -hex 32)"
create optistorage_app_encryption_key "$(openssl rand -base64 32)"
create optistorage_continuation_token_key "$(openssl rand -base64 32)"
