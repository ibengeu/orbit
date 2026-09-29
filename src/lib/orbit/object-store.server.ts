import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { ServiceInputTypes, ServiceOutputTypes } from "@aws-sdk/client-s3";
import type { BuildMiddleware, HttpRequest } from "@smithy/types";

export type OrbitAttachmentStorage = {
  putObject(key: string, content: Uint8Array, contentType: string): Promise<void>;
  getObject(key: string): Promise<Uint8Array>;
  deleteObject(key: string): Promise<void>;
};

type OptiStorageConfig = {
  endpoint: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
};

let cachedConfig: OptiStorageConfig | undefined;
let cachedStorage: OrbitAttachmentStorage | null = null;

export function getConfiguredOptiStorage(): OrbitAttachmentStorage | null {
  const config = readConfig();
  if (!config) return null;
  if (cachedStorage && sameConfig(cachedConfig, config)) return cachedStorage;

  const endpoint = new URL(config.endpoint);
  const localHttp = endpoint.protocol === "http:" && ["localhost", "127.0.0.1"].includes(endpoint.hostname);
  // OWASP A02:2025 Security Misconfiguration. Require HTTPS off loopback to protect SigV4 credentials in transit.
  if ((endpoint.protocol !== "https:" && !localHttp) || endpoint.username || endpoint.password || endpoint.search || endpoint.hash) {
    throw new Error("OptiStorage endpoint configuration is invalid.");
  }

  // OWASP A05:2025 Cryptographic Failures. Use the maintained SigV4 SDK with server-only credentials instead of custom signing or browser credentials.
  const client = new S3Client({
    endpoint: endpoint.toString().replace(/\/$/, ""),
    region: "us-east-1",
    forcePathStyle: true,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
    maxAttempts: 2,
  });
  const removeUnsupportedSdkMetadata: BuildMiddleware<ServiceInputTypes, ServiceOutputTypes> =
    (next) => async (args) => {
      // OptiStorage rejects SDK-only headers and query options. Remove them before SigV4 signs the request.
      const request = args.request as HttpRequest;
      delete request.headers["x-amz-user-agent"];
      if (request.query) delete request.query["x-id"];
      return next(args);
    };
  client.middlewareStack.addRelativeTo(removeUnsupportedSdkMetadata, {
    relation: "after",
    toMiddleware: "getUserAgentMiddleware",
    name: "removeOptiStorageUnsupportedUserAgent",
  });
  cachedConfig = config;
  cachedStorage = {
    async putObject(key, content, contentType) {
      await client.send(new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: content,
        ContentLength: content.byteLength,
        ContentType: contentType,
      }), { abortSignal: AbortSignal.timeout(15_000) });
    },
    async getObject(key) {
      const response = await client.send(new GetObjectCommand({ Bucket: config.bucket, Key: key }), {
        abortSignal: AbortSignal.timeout(15_000),
      });
      if (!response.Body) throw new Error("OptiStorage returned an empty response body.");
      return new Uint8Array(await response.Body.transformToByteArray());
    },
    async deleteObject(key) {
      await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }), {
        abortSignal: AbortSignal.timeout(15_000),
      });
    },
  };
  return cachedStorage;
}

function readConfig(): OptiStorageConfig | null {
  const values = {
    endpoint: process.env.OPTISTORAGE_ENDPOINT?.trim() ?? "",
    bucket: process.env.OPTISTORAGE_BUCKET?.trim() ?? "",
    accessKeyId: process.env.OPTISTORAGE_ACCESS_KEY_ID?.trim() ?? "",
    secretAccessKey: process.env.OPTISTORAGE_SECRET_ACCESS_KEY?.trim() ?? "",
  };
  const configuredCount = Object.values(values).filter(Boolean).length;
  if (configuredCount === 0) return null;
  if (configuredCount !== Object.keys(values).length) throw new Error("OptiStorage configuration is incomplete.");

  let parsedEndpoint: URL;
  try {
    parsedEndpoint = new URL(values.endpoint);
  } catch {
    throw new Error("OptiStorage endpoint configuration is invalid.");
  }
  // OWASP A09:2025 Server-Side Request Forgery. Read a fixed endpoint from server configuration; never accept a request-supplied storage URL.
  if (!parsedEndpoint.hostname || !values.bucket || !values.accessKeyId || !values.secretAccessKey) {
    throw new Error("OptiStorage configuration is invalid.");
  }
  return values;
}

function sameConfig(left: OptiStorageConfig | undefined, right: OptiStorageConfig) {
  return left?.endpoint === right.endpoint &&
    left.bucket === right.bucket &&
    left.accessKeyId === right.accessKeyId &&
    left.secretAccessKey === right.secretAccessKey;
}
