#!/usr/bin/env node
/**
 * One-shot compose job: make sure Orbit has OptiStorage credentials and a bucket.
 *
 * Runs in the OptiStorage container's network namespace, so it reaches the admin
 * listener on loopback. The admin listener is never exposed to another container
 * or the host. Bucket creation goes through the Caddy HTTPS endpoint, the same
 * path Orbit uses. Safe to re-run: stored credentials are reused.
 */
import { readFile, rename, writeFile } from "node:fs/promises";
import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";

const ADMIN_URL = "http://127.0.0.1:9001/admin/applications";
const CREDENTIALS_FILE = "/run/orbit-storage/optistorage.env";
const { OPTISTORAGE_ENDPOINT: endpoint, OPTISTORAGE_BUCKET: bucket, OPTISTORAGE_ADMIN_TOKEN_FILE: tokenFile } = process.env;
const quotaBytes = Number(process.env.OPTISTORAGE_QUOTA_BYTES ?? 1073741824);

if (!endpoint || !bucket || !tokenFile) {
  console.error("[provision] OPTISTORAGE_ENDPOINT, OPTISTORAGE_BUCKET, and OPTISTORAGE_ADMIN_TOKEN_FILE are required.");
  process.exit(1);
}

async function main() {
  const credentials = (await readStoredCredentials()) ?? (await createApplication());
  await ensureBucket(credentials);
  console.log("[provision] OptiStorage is ready for Orbit.");
}

async function readStoredCredentials() {
  let text;
  try {
    text = await readFile(CREDENTIALS_FILE, "utf8");
  } catch {
    return null;
  }
  const values = Object.fromEntries(
    text.split("\n").filter(Boolean).map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index), line.slice(index + 1)];
    }),
  );
  if (!values.OPTISTORAGE_ACCESS_KEY_ID || !values.OPTISTORAGE_SECRET_ACCESS_KEY) return null;
  console.log("[provision] reusing stored application credentials.");
  return { accessKeyId: values.OPTISTORAGE_ACCESS_KEY_ID, secretAccessKey: values.OPTISTORAGE_SECRET_ACCESS_KEY };
}

async function createApplication() {
  const token = (await readFile(tokenFile, "utf8")).trim();
  const response = await retry("admin API", () =>
    fetch(ADMIN_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ name: "orbit", quotaBytes }),
    }),
  );
  // OWASP A08:2025 Security Logging and Monitoring Failures. Log only the status, never the response body that holds the secret.
  if (!response.ok) throw new Error(`admin API returned ${response.status}`);
  const { accessKeyId, secretAccessKey } = await response.json();
  const body = [
    `OPTISTORAGE_ENDPOINT=${endpoint}`,
    `OPTISTORAGE_BUCKET=${bucket}`,
    `OPTISTORAGE_ACCESS_KEY_ID=${accessKeyId}`,
    `OPTISTORAGE_SECRET_ACCESS_KEY=${secretAccessKey}`,
    "",
  ].join("\n");
  // OWASP A02:2025 Security Misconfiguration. Write the secret owner-only and atomically so a partial file is never read.
  await writeFile(`${CREDENTIALS_FILE}.tmp`, body, { mode: 0o600 });
  await rename(`${CREDENTIALS_FILE}.tmp`, CREDENTIALS_FILE);
  console.log("[provision] created the orbit application.");
  return { accessKeyId, secretAccessKey };
}

async function ensureBucket(credentials) {
  const client = new S3Client({
    endpoint,
    region: "us-east-1",
    forcePathStyle: true,
    credentials,
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  // OptiStorage rejects SDK-only metadata. Orbit's client removes the same fields.
  client.middlewareStack.addRelativeTo(
    (next) => async (args) => {
      delete args.request.headers["x-amz-user-agent"];
      if (args.request.query) delete args.request.query["x-id"];
      return next(args);
    },
    { relation: "after", toMiddleware: "getUserAgentMiddleware", name: "removeOptiStorageUnsupportedMetadata" },
  );
  try {
    await retry("S3 endpoint", () => client.send(new CreateBucketCommand({ Bucket: bucket })), isNetworkError);
    console.log(`[provision] created bucket ${bucket}.`);
  } catch (error) {
    if (error?.name !== "BucketAlreadyOwnedByYou") throw error;
    console.log(`[provision] bucket ${bucket} already exists.`);
  }
}

function isNetworkError(error) {
  return !error?.$metadata?.httpStatusCode;
}

async function retry(label, action, shouldRetry = () => true, attempts = 30) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      if (attempt >= attempts || !shouldRetry(error)) throw error;
      console.log(`[provision] waiting for ${label} (${attempt}/${attempts})`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

main().catch((error) => {
  console.error(`[provision] failed: ${error?.name ?? "Error"}: ${error?.message ?? "unknown error"}`);
  process.exit(1);
});
