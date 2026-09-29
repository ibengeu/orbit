#!/bin/sh
# End-to-end check for the compose stack: an attachment uploaded through Orbit
# is stored in OptiStorage (not Postgres) and downloads byte-for-byte.
set -eu
cd "$(dirname "$0")/.."

base=${ORBIT_URL:-http://127.0.0.1:3000}
api="$base/api/v1"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

json() { node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s)[process.argv[1]]))' "$1"; }
fail() { echo "FAIL: $*" >&2; exit 1; }

workspace=$(curl -sf -H "Origin: $base" -H "Content-Type: application/json" -d '{"name":"Compose smoke"}' "$api/workspaces" | json id)
conversation=$(curl -sf "$api/workspaces/$workspace/conversations" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).data[0].id))')

# Random base64 text: an allowed type (text/plain) with unique, non-active content.
head -c 49152 /dev/urandom | base64 > "$work/upload.txt"
message=$(curl -sf -H "Origin: $base" -F "body=compose smoke" -F "file=@$work/upload.txt;type=text/plain" \
  "$api/conversations/$conversation/messages") || fail "upload rejected"
message_id=$(echo "$message" | json id)
attachment_id=$(echo "$message" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).attachments[0].id))')

curl -sf -o "$work/download.txt" "$api/messages/$message_id/attachments/$attachment_id" || fail "download failed"
cmp -s "$work/upload.txt" "$work/download.txt" || fail "downloaded bytes differ"
echo "ok   download matches upload"

location=$(docker compose exec -T postgres psql -U orbit -d orbit -tAc \
  "select (object_key is not null)::text || ',' || (content is null)::text from orbit_message_attachments where id = '$attachment_id'")
[ "$location" = "true,true" ] || fail "attachment bytes are not in OptiStorage (got '$location')"
echo "ok   Postgres holds only the object key"

# The storage listener must refuse plain HTTP, and the admin listener must be unreachable from Orbit.
docker compose exec -T orbit node -e '
  fetch("http://optistorage:9000/orbit-attachments/x").then(r => process.exit(r.status === 403 ? 0 : 1), () => process.exit(1));
' || fail "plain HTTP to OptiStorage was not rejected"
echo "ok   plain HTTP to OptiStorage is rejected"
docker compose exec -T orbit node -e '
  fetch("http://optistorage:9001/admin/applications", { signal: AbortSignal.timeout(3000) }).then(() => process.exit(1), () => process.exit(0));
' || fail "OptiStorage admin API is reachable from Orbit"
echo "ok   admin API is not reachable from Orbit"

echo "PASS"
