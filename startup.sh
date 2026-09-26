#!/bin/sh
set -eu
cd /workspace
# :8081 belongs to the built-output QA preview, not the dev server.
node scripts/preview.mjs stop || true

# Keep an existing dev server. The private dev-only route identifies Vite.
port=8080
while [ "$port" -le 8199 ]; do
  if [ "$port" -eq 8081 ]; then
    port=8082
    continue
  fi

  if curl -sf -o /dev/null --connect-timeout 0.2 --max-time 0.5 "http://127.0.0.1:$port/__app-env"; then
    exit 0
  fi

  # Check the same wildcard bind that Vite uses. Skip busy ports and keep
  # strictPort enabled so the app cannot silently take the QA preview port.
  if node -e 'const net = require("node:net"); const server = net.createServer(); server.once("error", () => process.exitCode = 1); server.listen({ host: "0.0.0.0", port: Number(process.argv[1]) }, () => server.close(() => process.exit(0)));' "$port" >/dev/null 2>&1; then
    APP_PORT="$port" npm run dev >>/tmp/app-startup.log 2>&1 &
    exit 0
  fi

  port=$((port + 1))
done

echo "No available dev port found between 8080 and 8199 (8081 is reserved)." >&2
exit 1
