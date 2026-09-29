# OptiStorage attachments

OptiChat sends new attachment bytes to OptiStorage. PostgreSQL keeps the message relationship and attachment metadata. OptiChat streams downloads through its API so object keys and storage credentials stay server-side.

## Server configuration

Set all four values in the server's secret configuration:

```text
OPTISTORAGE_ENDPOINT=https://storage.example.com
OPTISTORAGE_BUCKET=optichat-files
OPTISTORAGE_ACCESS_KEY_ID=<OptiStorage application access key>
OPTISTORAGE_SECRET_ACCESS_KEY=<OptiStorage application secret>
```

Do not use a `VITE_` prefix. Do not commit the values. The app requires HTTPS except for `http://localhost` and `http://127.0.0.1` during local development. The server runtime must be able to reach the endpoint.

Create the OptiStorage application and bucket before enabling the settings. Keep the OptiStorage admin listener private. The app uses only its application access key and secret.

## Data behavior

- New uploads use OptiStorage when all four settings are present.
- The API keeps the current 10 MiB upload limit. OptiStorage's default object limit is 25 MiB.
- If all four settings are absent, uploads use the existing Postgres storage path. A partial or invalid configuration fails attachment requests with a safe `503` response.
- Existing attachments remain in Postgres and continue to download. This change does not backfill old files.
- The app does not create buckets or return public object URLs.

The database migration adds an object key for new attachments and allows old attachment bytes to remain during this transition.
