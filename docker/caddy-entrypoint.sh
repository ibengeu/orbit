#!/bin/sh
# Run Caddy and publish only the public root certificate of its internal CA.
# Clients mount the caddy-ca volume, never caddy-data, which holds the CA keys.
set -eu

root=/data/caddy/pki/authorities/local/root.crt
published=/ca/root.crt

caddy run --config /etc/caddy/Caddyfile --adapter caddyfile &
pid=$!
trap 'kill -TERM "$pid" 2>/dev/null' TERM INT

until [ -s "$root" ]; do
  kill -0 "$pid" 2>/dev/null || exit 1
  sleep 0.2
done
install -m 0644 "$root" "$published.tmp"
mv "$published.tmp" "$published"

wait "$pid"
