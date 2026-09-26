import { randomUUID } from "node:crypto";
import { z } from "zod";
import { SEED_CONVERSATIONS, SEED_MESSAGES, SEED_WORKSPACES, YOU } from "./seed.ts";

export type OrbitSql = {
  query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
};

export type OrbitApiContext = { sql: OrbitSql; userId: string };
export type OrbitIdentityContext = { sql: OrbitSql; authenticationRequired: boolean; verifiedUserId: string | null };

const PUBLIC_DEMO_OWNER_ID = "public-demo";

type JsonObject = Record<string, unknown>;

const PROBLEM_BASE = "https://optichat.dev/problems";
const MAX_JSON_BYTES = 1_000_000;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_MULTIPART_BYTES = MAX_FILE_BYTES + 65_536;
const MAX_PAGE_SIZE = 100;
const FILE_TYPES = new Set(["application/pdf", "text/plain", "image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"]);

class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly title: string;

  constructor(status: number, code: string, title: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.title = title;
  }
}

const workspaceSchema = z.object({
  name: z.string().trim().min(1).max(80),
  templateId: z.enum(["orbit", "lumen"]).optional(),
}).strict();
const conversationSchema = z.object({
  kind: z.enum(["channel", "dm"]),
  name: z.string().trim().min(1).max(80).optional(),
  description: z.string().trim().max(240).optional(),
  participantIds: z.array(z.string().min(1).max(120)).max(50).optional(),
  title: z.string().trim().max(120).optional(),
}).strict();
const messageSchema = z.object({
  body: z.string().trim().min(1).max(4_000),
  parentId: z.string().min(1).max(120).nullable().optional(),
}).strict();
const multipartMessageSchema = messageSchema.extend({ body: z.string().trim().max(4_000), file: z.instanceof(File) });
const messagePatchSchema = z
  .object({ body: z.string().trim().min(1).max(4_000).optional(), deleted: z.literal(false).optional() }).strict()
  .refine((value) => value.body !== undefined || value.deleted === false, "Provide a body or deleted=false.");
const profileSchema = z.object({
  presence: z.enum(["online", "away", "offline"]).optional(),
  status: z.string().trim().max(120).optional(),
}).strict();
const preferencesSchema = z.object({ alwaysShowTime: z.boolean() }).strict();
const callSchema = z.object({ kind: z.enum(["voice", "video"]) }).strict();

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export function problem(
  status: number,
  code: string,
  title: string,
  detail: string,
  request: Request,
  extra: JsonObject = {},
) {
  const body = {
    type: `${PROBLEM_BASE}/${code}`,
    title,
    status,
    detail,
    instance: new URL(request.url).pathname,
    ...extra,
  };
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/problem+json",
      "Cache-Control": "no-store",
    },
  });
}

function validationProblem(error: z.ZodError, request: Request) {
  return problem(400, "validation-error", "Request validation failed", "One or more request fields are invalid.", request, {
    errors: error.issues.flatMap((issue) => {
      const paths = issue.code === "unrecognized_keys" ? issue.keys.map((key) => [...issue.path, key]) : [issue.path];
      return paths.map((path) => ({
        pointer: path.length ? `/${path.map((part) => String(part).replace(/~/g, "~0").replace(/\//g, "~1")).join("/")}` : "",
        detail: issue.message,
      }));
    }),
  });
}

async function readJson(request: Request): Promise<unknown> {
  if (request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new ApiRequestError(415, "unsupported-media-type", "Unsupported media type", "Send a JSON request with Content-Type: application/json.");
  }
  const reader = request.body?.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let raw = "";
  if (reader) {
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      // OWASP A04:2025 Insecure Design. Stop reading after the cap to limit memory use from oversized requests.
      if (bytes > MAX_JSON_BYTES) {
        await reader.cancel();
        throw new ApiRequestError(413, "request-too-large", "Request is too large", "JSON requests must be 1 MB or smaller.");
      }
      raw += decoder.decode(chunk.value, { stream: true });
    }
  }
  raw += decoder.decode();
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw new ApiRequestError(400, "invalid-json", "Invalid JSON", "The request body is not valid JSON.");
  }
}

async function readMultipartMessage(request: Request) {
  const contentType = request.headers.get("Content-Type") ?? "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data;")) {
    throw new ApiRequestError(415, "unsupported-media-type", "Unsupported media type", "Send a multipart form with a file.");
  }
  const body = await readBoundedUpload(request);
  const form = await parseMultipartForm(request.url, contentType, body);
  return validateMultipartForm(form);
}

async function readBoundedUpload(request: Request) {
  const reader = request.body?.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  if (!reader) return Buffer.alloc(0);
  for (;;) {
    const chunk = await reader.read();
    if (chunk.done) break;
    size += chunk.value.byteLength;
    // OWASP A04:2025 Insecure Design. Cap streamed upload bytes before parsing to prevent memory exhaustion.
    if (size > MAX_MULTIPART_BYTES) {
      await reader.cancel();
      throw new ApiRequestError(413, "request-too-large", "Request is too large", "An attachment must be 10 MB or smaller.");
    }
    chunks.push(chunk.value);
  }
  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)));
}

async function parseMultipartForm(url: string, contentType: string, body: Buffer) {
  try {
    return await new Request(url, { method: "POST", headers: { "Content-Type": contentType }, body: Uint8Array.from(body).buffer }).formData();
  } catch {
    throw new ApiRequestError(400, "validation-error", "Request validation failed", "The multipart form is invalid.");
  }
}

function validateMultipartForm(form: FormData) {
  if ([...form.keys()].some((key) => !["body", "parentId", "file"].includes(key))) {
    throw new ApiRequestError(400, "validation-error", "Request validation failed", "The multipart form has an unsupported field.");
  }
  if (["body", "parentId", "file"].some((key) => form.getAll(key).length > 1)) {
    throw new ApiRequestError(400, "validation-error", "Request validation failed", "The multipart form repeats a field.");
  }
  const file = validateUploadFile(form.get("file"));
  const { body, parentId } = validateMessageFields(form);
  return { body, parentId, file };
}

function validateUploadFile(value: FormDataEntryValue | null) {
  const file = value;
  if (!(file instanceof File) || !file.size || !allowedFileType(file.type)) {
    throw new ApiRequestError(400, "validation-error", "Request validation failed", "Choose an image, PDF, or plain text file up to 10 MB.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new ApiRequestError(413, "request-too-large", "Request is too large", "An attachment must be 10 MB or smaller.");
  }
  if (!file.name || file.name.length > 255 || unsafeFileName(file.name)) {
    throw new ApiRequestError(400, "validation-error", "Request validation failed", "The file name is invalid.");
  }
  return file;
}

function validateMessageFields(form: FormData) {
  const bodyText = form.get("body");
  const parentId = form.get("parentId");
  if (typeof bodyText !== "string" || bodyText.trim().length > 4_000 || (parentId !== null && typeof parentId !== "string")) {
    throw new ApiRequestError(400, "validation-error", "Request validation failed", "The message fields are invalid.");
  }
  return { body: bodyText.trim(), parentId: parentId || null };
}

function unsafeFileName(name: string) {
  return [...name].some((character) => character === "/" || character === "\\" || character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127);
}

function allowedFileType(type: string) {
  return FILE_TYPES.has(type);
}

function initialsFor(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "OR";
}

function idFor(prefix: string) {
  return `${prefix}-${randomUUID()}`;
}

function etag(version: number) {
  return `"${version}"`;
}

function toDate(value: unknown) {
  return value instanceof Date ? value.toISOString() : String(value);
}

async function seedDemoWorkspace(context: OrbitApiContext, templateId: "orbit" | "lumen") {
  const conversations = SEED_CONVERSATIONS.filter((entry) => entry.workspaceId === templateId);
  const conversationRows = conversations.map((item) => [
    context.userId,
    item.id,
    item.workspaceId,
    item.kind,
    item.kind === "channel" ? item.name : null,
    item.kind === "channel" ? item.description : null,
    JSON.stringify((item.kind === "channel" ? item.memberIds : item.participantIds).map((id) => id === YOU ? context.userId : id)),
    item.kind === "dm" ? item.title ?? null : null,
  ]);
  if (conversationRows.length) {
    await context.sql.query(
      "insert into orbit_conversations (owner_id, id, workspace_id, kind, name, description, participant_ids, title) values " +
        sqlValues(conversationRows, new Set([6])) + " on conflict do nothing",
      conversationRows.flat(),
    );
  }

  const conversationIds = new Set(conversations.map((item) => item.id));
  const messages = SEED_MESSAGES.filter((entry) => conversationIds.has(entry.conversationId));
  const messageRows = messages.map((item) => [
    context.userId,
    item.id,
    item.conversationId,
    item.authorId === YOU ? context.userId : item.authorId,
    item.body,
    item.parentId ?? null,
    item.createdAt,
  ]);
  if (messageRows.length) {
    await context.sql.query(
      "insert into orbit_messages (owner_id, id, conversation_id, author_id, body, parent_id, created_at) values " +
        sqlValues(messageRows) + " on conflict do nothing",
      messageRows.flat(),
    );
  }

  const reactionRows = messages.flatMap((item) => item.reactions.flatMap((reaction) =>
    reaction.userIds.map((userId) => [context.userId, item.id, userId === YOU ? context.userId : userId, reaction.emoji]),
  ));
  if (reactionRows.length) {
    await context.sql.query(
      "insert into orbit_reactions (owner_id, message_id, user_id, emoji, created_at) values " +
        reactionValues(reactionRows) + " on conflict do nothing",
      reactionRows.flat(),
    );
  }
}

function sqlValues(rows: unknown[][], jsonColumns = new Set<number>()) {
  // OWASP A07:2025 Injection. Bind fixture values so message text cannot become executable SQL.
  let parameter = 1;
  return rows.map((row) => "(" + row.map((_, index) => "$" + parameter++ + (jsonColumns.has(index) ? "::jsonb" : "")).join(", ") + ")").join(", ");
}

function reactionValues(rows: unknown[][]) {
  // OWASP A07:2025 Injection. Bind fixture fields; only the numeric row index shapes the timestamp SQL.
  let parameter = 1;
  return rows.map((row, index) => {
    const values = row.map(() => "$" + parameter++).join(", ");
    return "(" + values + ", CURRENT_TIMESTAMP + (" + index + " * interval '1 microsecond'))";
  }).join(", ");
}

async function workspace(context: OrbitApiContext, id: string) {
  const rows = await context.sql.query<JsonObject>(
    "select id, name, initials, created_at, updated_at from orbit_workspaces where owner_id = $1 and id = $2",
    [context.userId, id],
  );
  const row = rows[0];
  return row
    ? { id: String(row.id), name: String(row.name), initials: String(row.initials), createdAt: toDate(row.created_at), updatedAt: toDate(row.updated_at) }
    : null;
}

async function conversation(context: OrbitApiContext, id: string) {
  const rows = await context.sql.query<JsonObject>(
    `select id, workspace_id, kind, name, description, participant_ids, title, created_at
       from orbit_conversations where owner_id = $1 and id = $2`,
    [context.userId, id],
  );
  const row = rows[0];
  if (!row) return null;
  return {
    id: String(row.id),
    workspaceId: String(row.workspace_id),
    kind: String(row.kind),
    ...(row.name == null ? {} : { name: String(row.name) }),
    ...(row.description == null ? {} : { description: String(row.description) }),
    participantIds: (row.participant_ids as string[]) ?? [],
    ...(row.title == null ? {} : { title: String(row.title) }),
    createdAt: toDate(row.created_at),
  };
}

async function message(context: OrbitApiContext, id: string) {
  const rows = await context.sql.query<JsonObject>(
    `select id, conversation_id, author_id, body, parent_id, created_at, edited_at, deleted_at, version
       from orbit_messages where owner_id = $1 and id = $2`,
    [context.userId, id],
  );
  const row = rows[0];
  if (!row) return null;
  const reactions = await context.sql.query<{ emoji: string; user_id: string }>(
    "select emoji, user_id from orbit_reactions where owner_id = $1 and message_id = $2 order by created_at asc",
    [context.userId, id],
  );
  const grouped = new Map<string, string[]>();
  for (const reaction of reactions) grouped.set(reaction.emoji, [...(grouped.get(reaction.emoji) ?? []), reaction.user_id]);
  const attachments = await context.sql.query<{ id: string; name: string; size_bytes: number }>(
    "select id, name, size_bytes from orbit_message_attachments where owner_id = $1 and message_id = $2 order by id",
    [context.userId, id],
  );
  return {
    id: String(row.id),
    conversationId: String(row.conversation_id),
    authorId: String(row.author_id),
    body: String(row.body),
    ...(row.parent_id == null ? {} : { parentId: String(row.parent_id) }),
    createdAt: toDate(row.created_at),
    ...(row.edited_at == null ? {} : { editedAt: toDate(row.edited_at) }),
    ...(row.deleted_at == null ? {} : { deletedAt: toDate(row.deleted_at) }),
    reactions: [...grouped].map(([emoji, userIds]) => ({ emoji, userIds })),
    ...(attachments.length ? { attachments: attachments.map((item) => ({ id: item.id, name: item.name, size: Number(item.size_bytes) })) } : {}),
    version: Number(row.version),
  };
}

type PageAnchor = { createdAt: string; id: string };
type PageParams = { limit: number; cursor: number; after: PageAnchor | null; includeDeleted: boolean };

function encodePageToken(createdAt: unknown, id: string) {
  const timestamp = createdAt instanceof Date ? createdAt.toISOString() : String(createdAt);
  return Buffer.from(JSON.stringify({ createdAt: timestamp, id }), "utf8").toString("base64url");
}

function decodePageToken(value: string): PageAnchor | null {
  if (value.length > 512 || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<PageAnchor> | null;
    return isPageAnchor(parsed) ? { createdAt: parsed.createdAt, id: parsed.id } : null;
  } catch {
    return null;
  }
}

function isPageAnchor(value: unknown): value is PageAnchor {
  if (!value || typeof value !== "object") return false;
  const anchor = value as Partial<PageAnchor>;
  return typeof anchor.createdAt === "string" &&
    isPageTimestamp(anchor.createdAt) &&
    typeof anchor.id === "string" &&
    anchor.id.length > 0 &&
    anchor.id.length <= 120;
}

function isPageTimestamp(value: string) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?Z$/.test(value) &&
    Number.isFinite(Date.parse(value));
}

function pageParams(request: Request): PageParams | Response {
  const url = new URL(request.url);
  const limitText = url.searchParams.get("limit");
  const cursorText = url.searchParams.get("cursor");
  const afterText = url.searchParams.get("after");
  const deletedText = url.searchParams.get("includeDeleted");
  const limit = limitText === null ? 50 : Number(limitText);
  const cursor = cursorText === null ? 0 : Number(cursorText);
  if (invalidPageNumber(limitText, 1, MAX_PAGE_SIZE)) {
    return problem(400, "validation-error", "Request validation failed", "The limit query parameter is invalid.", request, {
      errors: [{ pointer: "/limit", detail: "Expected a whole number from 1 to 100." }],
    });
  }
  if (invalidPageNumber(cursorText, 0, Number.MAX_SAFE_INTEGER)) {
    return problem(400, "validation-error", "Request validation failed", "The cursor query parameter is invalid.", request, {
      errors: [{ pointer: "/cursor", detail: "Expected a non-negative whole number." }],
    });
  }
  // OWASP A04:2025 Insecure Design. Reject malformed page tokens before their values reach SQL.
  const after = afterText === null ? null : decodePageToken(afterText);
  if (afterText !== null && !after) {
    return problem(400, "validation-error", "Request validation failed", "The after query parameter is invalid.", request, {
      errors: [{ pointer: "/after", detail: "Expected a valid page token returned by the previous response." }],
    });
  }
  if (deletedText !== null && !["true", "false"].includes(deletedText)) {
    return problem(400, "validation-error", "Request validation failed", "The includeDeleted query parameter is invalid.", request, {
      errors: [{ pointer: "/includeDeleted", detail: "Expected true or false." }],
    });
  }
  return { limit, cursor, after, includeDeleted: deletedText === "true" };
}

function invalidPageNumber(text: string | null, min: number, max: number) {
  if (text === null) return false;
  const value = Number(text);
  return !/^\d+$/.test(text) || !Number.isSafeInteger(value) || value < min || value > max;
}

function methodNotAllowed(request: Request) {
  return problem(405, "method-not-allowed", "Method not allowed", "The method is not supported for this resource.", request);
}

function resourceNotFound(request: Request) {
  return problem(404, "not-found", "Resource not found", "The requested API resource does not exist.", request);
}

async function listWorkspaceResources(context: OrbitApiContext) {
  const rows = await context.sql.query<JsonObject>(
    "select id, name, initials, created_at, updated_at from orbit_workspaces where owner_id = $1 order by created_at asc",
    [context.userId],
  );
  return json({ data: rows.map((row) => ({ id: String(row.id), name: String(row.name), initials: String(row.initials), createdAt: toDate(row.created_at), updatedAt: toDate(row.updated_at) })) });
}

async function createWorkspaceResource(request: Request, context: OrbitApiContext) {
  const parsed = workspaceSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationProblem(parsed.error, request);
  const template = parsed.data.templateId ? SEED_WORKSPACES.find((item) => item.id === parsed.data.templateId) : null;
  if (template && parsed.data.name !== template.name) {
    return problem(400, "validation-error", "Request validation failed", "The template and workspace name do not match.", request, {
      errors: [{ pointer: "/name", detail: `Expected ${template.name} for this template.` }],
    });
  }
  const duplicate = await context.sql.query("select id from orbit_workspaces where owner_id = $1 and lower(name) = lower($2) limit 1", [context.userId, parsed.data.name]);
  if (duplicate[0]) return problem(409, "conflict", "Workspace already exists", "A workspace with this name already exists.", request);
  const existing = await context.sql.query("select id from orbit_workspaces where owner_id = $1 limit 1", [context.userId]);
  // OWASP A01:2025: only allow fixed demo IDs from the server allowlist.
  // This prevents a request from choosing another resource identifier.
  const id = template ? template.id : idFor("ws");
  const created = await context.sql.query<JsonObject>(
    "insert into orbit_workspaces (owner_id, id, name, initials) values ($1, $2, $3, $4) on conflict do nothing returning id, name, initials, created_at, updated_at",
    [context.userId, id, parsed.data.name, initialsFor(parsed.data.name)],
  );
  if (!created[0]) return problem(409, "conflict", "Workspace already exists", "A workspace with this name already exists.", request);
  if (template) await seedDemoWorkspace(context, template.id as "orbit" | "lumen");
  else await createGeneralChannel(context, id, parsed.data.name, Boolean(existing[0]));
  const row = created[0];
  return json({ id: String(row.id), name: String(row.name), initials: String(row.initials), createdAt: toDate(row.created_at), updatedAt: toDate(row.updated_at) }, 201);
}

async function createGeneralChannel(context: OrbitApiContext, id: string, name: string, hasWorkspaces: boolean) {
  await context.sql.query(
    `insert into orbit_conversations
      (owner_id, id, workspace_id, kind, name, description, participant_ids)
     values ($1, $2, $3, 'channel', 'general', $4, $5::jsonb)`,
    [context.userId, hasWorkspaces ? `${id}-general` : "general", id, `Home for ${name}.`, JSON.stringify([context.userId])],
  );
}

async function listWorkspaceConversations(context: OrbitApiContext, workspaceId: string) {
  const rows = await context.sql.query<JsonObject>(
    `select id, workspace_id, kind, name, description, participant_ids, title, created_at
     from orbit_conversations where owner_id = $1 and workspace_id = $2 order by created_at asc`,
    [context.userId, workspaceId],
  );
  return json({ data: rows.map((row) => ({ id: String(row.id), workspaceId: String(row.workspace_id), kind: String(row.kind), ...(row.name == null ? {} : { name: String(row.name) }), ...(row.description == null ? {} : { description: String(row.description) }), participantIds: (row.participant_ids as string[]) ?? [], ...(row.title == null ? {} : { title: String(row.title) }), createdAt: toDate(row.created_at) })) });
}

async function createConversationResource(request: Request, context: OrbitApiContext, workspaceId: string) {
  const parsed = conversationSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationProblem(parsed.error, request);
  if (parsed.data.kind === "channel" && !parsed.data.name) return problem(400, "validation-error", "Request validation failed", "Channel name is required.", request, { errors: [{ pointer: "/name", detail: "Required" }] });
  const id = idFor("conv");
  const { name, participantIds, description, title } = conversationFields(parsed.data, context.userId);
  if (name && await channelNameExists(context, workspaceId, name)) return problem(409, "conflict", "Conversation already exists", "A channel with this name already exists in the workspace.", request);
  const created = await context.sql.query<JsonObject>(
    `insert into orbit_conversations
      (owner_id, id, workspace_id, kind, name, description, participant_ids, title)
     values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8)
     on conflict do nothing returning id`,
    [context.userId, id, workspaceId, parsed.data.kind, name, description, JSON.stringify(participantIds), title],
  );
  if (!created[0]) return problem(409, "conflict", "Conversation already exists", "A channel with this name already exists in the workspace.", request);
  return json(await conversation(context, String(created[0].id)), 201);
}

function conversationFields(input: z.infer<typeof conversationSchema>, userId: string) {
  // OWASP A01:2025: bind membership to the authenticated caller.
  // This prevents a client from creating a conversation on another user's behalf.
  const participantIds = [...new Set([userId, ...(input.participantIds ?? []).filter((id) => id !== YOU)])];
  const name = input.kind === "channel" ? input.name!.toLowerCase().replace(/[^a-z0-9-]+/g, "-") : null;
  return { name, participantIds, description: input.description ?? (name ? "New channel" : null), title: input.title ?? null };
}

async function channelNameExists(context: OrbitApiContext, workspaceId: string, name: string) {
  const duplicate = await context.sql.query("select id from orbit_conversations where owner_id = $1 and workspace_id = $2 and kind = 'channel' and lower(name) = lower($3) limit 1", [context.userId, workspaceId, name]);
  return Boolean(duplicate[0]);
}

async function handleWorkspaceCollection(request: Request, context: OrbitApiContext) {
  if (request.method === "GET") return listWorkspaceResources(context);
  if (request.method === "POST") return createWorkspaceResource(request, context);
  return methodNotAllowed(request);
}

async function handleWorkspaceConversationCollection(request: Request, context: OrbitApiContext, workspaceId: string) {
  if (request.method === "GET") return listWorkspaceConversations(context, workspaceId);
  if (request.method === "POST") return createConversationResource(request, context, workspaceId);
  return methodNotAllowed(request);
}

async function handleWorkspaces(request: Request, context: OrbitApiContext, parts: string[]) {
  if (parts.length === 1) return handleWorkspaceCollection(request, context);
  const workspaceId = parts[1];
  const found = await workspace(context, workspaceId);
  if (!found) return problem(404, "not-found", "Workspace not found", "The requested workspace does not exist.", request);
  if (parts.length === 2) return request.method === "GET" ? json(found) : methodNotAllowed(request);
  if (parts.length === 3) return parts[2] === "conversations" ? handleWorkspaceConversationCollection(request, context, workspaceId) : resourceNotFound(request);
  return resourceNotFound(request);
}

async function listConversationMessages(request: Request, context: OrbitApiContext, conversationId: string) {
  const pagination = pageParams(request);
  if (pagination instanceof Response) return pagination;
  const { limit, cursor } = pagination;
  const rows = await selectMessagePage(context, conversationId, pagination);
  const ids = rows.map((row) => String(row.id));
  const { reactions, attachments } = await fetchMessageDetails(context, ids);
  const reactionsByMessage = reactionsByMessageId(reactions);
  const attachmentsByMessage = attachmentsByMessageId(attachments);
  const data = rows.map((row) => serializeMessageRow(row, reactionsByMessage, attachmentsByMessage));
  const last = rows.at(-1);
  return json({
    data,
    nextCursor: data.length === limit ? String(cursor + data.length) : null,
    nextPageToken: data.length === limit && last ? encodePageToken(last.page_created_at, String(last.id)) : null,
    hasMore: data.length === limit,
  });
}

async function selectMessagePage(context: OrbitApiContext, conversationId: string, pagination: PageParams) {
  const { limit, cursor, after, includeDeleted } = pagination;
  const columns = `select id, conversation_id, author_id, body, parent_id, created_at, edited_at, deleted_at, version,
    to_char(created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') as page_created_at
    from orbit_messages where owner_id = $1 and conversation_id = $2
    and ($3::boolean or deleted_at is null)`;
  if (after) {
    return context.sql.query<JsonObject>(
      `${columns} and (created_at, id) < ($4::timestamptz, $5::text) order by created_at desc, id desc limit $6`,
      [context.userId, conversationId, includeDeleted, after.createdAt, after.id, limit],
    );
  }
  return context.sql.query<JsonObject>(
    `${columns} order by created_at desc, id desc offset $4 limit $5`,
    [context.userId, conversationId, includeDeleted, cursor, limit],
  );
}

async function fetchMessageDetails(context: OrbitApiContext, ids: string[]): Promise<{
  reactions: Array<{ message_id: string; emoji: string; user_id: string }>;
  attachments: Array<{ message_id: string; id: string; name: string; size_bytes: number }>;
}> {
  if (ids.length === 0) return { reactions: [], attachments: [] };
  const [reactions, attachments] = await Promise.all([
    context.sql.query<{ message_id: string; emoji: string; user_id: string }>(
      "select message_id, emoji, user_id from orbit_reactions where owner_id = $1 and message_id = any($2::text[]) order by created_at asc",
      [context.userId, ids],
    ),
    context.sql.query<{ message_id: string; id: string; name: string; size_bytes: number }>(
      "select message_id, id, name, size_bytes from orbit_message_attachments where owner_id = $1 and message_id = any($2::text[]) order by message_id, id",
      [context.userId, ids],
    ),
  ]);
  return { reactions, attachments };
}

function reactionsByMessageId(reactions: Array<{ message_id: string; emoji: string; user_id: string }>) {
  const groupedByMessage = new Map<string, Map<string, string[]>>();
  for (const reaction of reactions) {
    let grouped = groupedByMessage.get(reaction.message_id);
    if (!grouped) {
      grouped = new Map();
      groupedByMessage.set(reaction.message_id, grouped);
    }
    const users = grouped.get(reaction.emoji) ?? [];
    users.push(reaction.user_id);
    grouped.set(reaction.emoji, users);
  }
  return groupedByMessage;
}

function attachmentsByMessageId(attachments: Array<{ message_id: string; id: string; name: string; size_bytes: number }>) {
  const grouped = new Map<string, Array<{ id: string; name: string; size: number }>>();
  for (const attachment of attachments) {
    const items = grouped.get(attachment.message_id) ?? [];
    items.push({ id: attachment.id, name: attachment.name, size: Number(attachment.size_bytes) });
    grouped.set(attachment.message_id, items);
  }
  return grouped;
}

function serializeMessageRow(
  row: JsonObject,
  reactionsByMessage: Map<string, Map<string, string[]>>,
  attachmentsByMessage: Map<string, Array<{ id: string; name: string; size: number }>>,
) {
  const grouped = reactionsByMessage.get(String(row.id));
  const files = attachmentsByMessage.get(String(row.id));
  return {
    id: String(row.id),
    conversationId: String(row.conversation_id),
    authorId: String(row.author_id),
    body: String(row.body),
    ...(row.parent_id == null ? {} : { parentId: String(row.parent_id) }),
    createdAt: toDate(row.created_at),
    ...(row.edited_at == null ? {} : { editedAt: toDate(row.edited_at) }),
    ...(row.deleted_at == null ? {} : { deletedAt: toDate(row.deleted_at) }),
    reactions: grouped ? [...grouped].map(([emoji, userIds]) => ({ emoji, userIds })) : [],
    ...(files?.length ? { attachments: files } : {}),
    version: Number(row.version),
  };
}

async function createConversationMessage(request: Request, context: OrbitApiContext, conversationId: string) {
  const multipart = request.headers.get("Content-Type")?.toLowerCase().startsWith("multipart/form-data;");
  const input = multipart ? await readMultipartMessage(request) : await readJson(request);
  const parsed = (multipart ? multipartMessageSchema : messageSchema).safeParse(input);
  if (!parsed.success) return validationProblem(parsed.error, request);
  if (parsed.data.parentId) {
    const parent = await context.sql.query("select id from orbit_messages where owner_id = $1 and id = $2 and conversation_id = $3 and deleted_at is null", [context.userId, parsed.data.parentId, conversationId]);
    if (!parent[0]) return problem(404, "not-found", "Parent message not found", "The thread parent is not in this conversation.", request);
  }
  const id = idFor("msg");
  if (multipart) await insertMessageWithFile(context, id, conversationId, input as Awaited<ReturnType<typeof readMultipartMessage>>);
  else await context.sql.query(
    "insert into orbit_messages (owner_id, id, conversation_id, author_id, body, parent_id) values ($1, $2, $3, $4, $5, $6)",
    [context.userId, id, conversationId, context.userId, parsed.data.body, parsed.data.parentId ?? null],
  );
  return json(await message(context, id), 201, { Location: `/api/v1/messages/${id}`, ETag: etag(1) });
}

async function insertMessageWithFile(context: OrbitApiContext, id: string, conversationId: string, input: Awaited<ReturnType<typeof readMultipartMessage>>) {
  const bytes = Buffer.from(await input.file.arrayBuffer());
  const attachmentId = idFor("att");
  await context.sql.query(
    `with created as (
      insert into orbit_messages (owner_id, id, conversation_id, author_id, body, parent_id)
      values ($1, $2, $3, $1, $4, $5) returning owner_id, id
    )
    insert into orbit_message_attachments (owner_id, id, message_id, name, media_type, size_bytes, content)
    select owner_id, $6, id, $7, $8, $9, $10 from created`,
    [context.userId, id, conversationId, input.body, input.parentId, attachmentId,
      input.file.name, input.file.type, input.file.size, bytes],
  );
}

async function getConversationReadState(context: OrbitApiContext, conversationId: string) {
  const rows = await context.sql.query<{ last_read_at: unknown }>(
    "select last_read_at from orbit_read_states where owner_id = $1 and conversation_id = $2",
    [context.userId, conversationId],
  );
  return json({ conversationId, lastReadAt: rows[0] ? toDate(rows[0].last_read_at) : null });
}

async function replaceConversationReadState(request: Request, context: OrbitApiContext, conversationId: string) {
  const parsed = z.object({ lastReadAt: z.string().datetime() }).strict().safeParse(await readJson(request));
  if (!parsed.success) return validationProblem(parsed.error, request);
  await context.sql.query(
    `insert into orbit_read_states (owner_id, conversation_id, last_read_at) values ($1, $2, $3)
     on conflict (owner_id, conversation_id) do update set last_read_at = excluded.last_read_at`,
    [context.userId, conversationId, parsed.data.lastReadAt],
  );
  return json({ conversationId, lastReadAt: parsed.data.lastReadAt });
}

async function createConversationCall(request: Request, context: OrbitApiContext, conversationId: string) {
  const parsed = callSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationProblem(parsed.error, request);
  const id = idFor("call");
  const created = await context.sql.query<JsonObject>(
    "insert into orbit_calls (owner_id, id, conversation_id, kind, status) values ($1, $2, $3, $4, 'lobby') returning id, conversation_id, kind, status, started_at, ended_at, duration_sec",
    [context.userId, id, conversationId, parsed.data.kind],
  );
  return json(serializeCall(created[0]), 201, { Location: `/api/v1/calls/${id}` });
}

async function handleConversationMessages(request: Request, context: OrbitApiContext, id: string) {
  if (request.method === "GET") return listConversationMessages(request, context, id);
  if (request.method === "POST") return createConversationMessage(request, context, id);
  return methodNotAllowed(request);
}

async function handleConversationReadState(request: Request, context: OrbitApiContext, id: string) {
  if (request.method === "GET") return getConversationReadState(context, id);
  if (request.method === "PUT") return replaceConversationReadState(request, context, id);
  return methodNotAllowed(request);
}

async function handleConversations(request: Request, context: OrbitApiContext, parts: string[]) {
  const id = parts[1];
  const found = await conversation(context, id);
  if (!found) return problem(404, "not-found", "Conversation not found", "The requested conversation does not exist.", request);
  if (parts.length !== 3) return resourceNotFound(request);
  if (parts[2] === "messages") return handleConversationMessages(request, context, id);
  if (parts[2] === "read-state") return handleConversationReadState(request, context, id);
  if (parts[2] === "calls") return request.method === "POST" ? createConversationCall(request, context, id) : methodNotAllowed(request);
  return resourceNotFound(request);
}

function serializeCall(row: JsonObject) {
  return { id: String(row.id), conversationId: String(row.conversation_id), kind: String(row.kind), status: String(row.status), ...(row.started_at == null ? {} : { startedAt: toDate(row.started_at) }), ...(row.ended_at == null ? {} : { endedAt: toDate(row.ended_at) }), ...(row.duration_sec == null ? {} : { durationSec: Number(row.duration_sec) }) };
}

type StoredMessage = NonNullable<Awaited<ReturnType<typeof message>>>;

async function handleReaction(request: Request, context: OrbitApiContext, id: string, encodedEmoji: string) {
  let emoji: string;
  try {
    emoji = decodeURIComponent(encodedEmoji).trim();
  } catch {
    return problem(400, "validation-error", "Request validation failed", "The reaction identifier is invalid.", request);
  }
  if (!z.string().min(1).max(16).safeParse(emoji).success) {
    return problem(400, "validation-error", "Request validation failed", "The reaction identifier is invalid.", request);
  }
  if (request.method === "PUT") {
    await context.sql.query("insert into orbit_reactions (owner_id, message_id, user_id, emoji) values ($1, $2, $3, $4) on conflict do nothing", [context.userId, id, context.userId, emoji]);
    return json(await message(context, id));
  }
  if (request.method === "DELETE") {
    await context.sql.query("delete from orbit_reactions where owner_id = $1 and message_id = $2 and user_id = $3 and emoji = $4", [context.userId, id, context.userId, emoji]);
    return json(await message(context, id));
  }
  return methodNotAllowed(request);
}

async function handleSavedMessage(request: Request, context: OrbitApiContext, id: string) {
  if (request.method === "PUT") {
    await context.sql.query("insert into orbit_saved_messages (owner_id, message_id) values ($1, $2) on conflict do nothing", [context.userId, id]);
    return json({ messageId: id, saved: true });
  }
  if (request.method === "DELETE") {
    await context.sql.query("delete from orbit_saved_messages where owner_id = $1 and message_id = $2", [context.userId, id]);
    return new Response(null, { status: 204 });
  }
  return methodNotAllowed(request);
}

function staleMessageProblem(request: Request) {
  return problem(412, "precondition-failed", "Message version is stale", "Fetch the current message and retry with its ETag.", request);
}

async function updateOwnedMessage(request: Request, context: OrbitApiContext, current: StoredMessage) {
  if (current.authorId !== context.userId) return problem(403, "forbidden", "Message update is not allowed", "Only the message author can edit this message.", request);
  const ifMatch = request.headers.get("If-Match");
  if (ifMatch && ifMatch !== etag(current.version)) return staleMessageProblem(request);
  const parsed = messagePatchSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationProblem(parsed.error, request);
  const changed = await writeMessagePatch(context, current.id, parsed.data, ifMatch ? current.version : null);
  if (!changed[0]) return staleMessageProblem(request);
  const updated = await message(context, current.id);
  return json(updated, 200, { ETag: etag(updated!.version) });
}

async function writeMessagePatch(context: OrbitApiContext, id: string, patch: z.infer<typeof messagePatchSchema>, version: number | null) {
  // OWASP A04:2025 Insecure Design. Compare the version in the write query to prevent concurrent lost updates.
  if (patch.deleted === false) {
    return context.sql.query<{ id: string }>("update orbit_messages set body = coalesce($1, body), edited_at = now(), deleted_at = null, version = version + 1 where owner_id = $2 and id = $3 and ($4::integer is null or version = $4) returning id", [patch.body ?? null, context.userId, id, version]);
  }
  return context.sql.query<{ id: string }>("update orbit_messages set body = $1, edited_at = now(), version = version + 1 where owner_id = $2 and id = $3 and ($4::integer is null or version = $4) returning id", [patch.body, context.userId, id, version]);
}

async function deleteOwnedMessage(request: Request, context: OrbitApiContext, current: StoredMessage) {
  if (current.authorId !== context.userId) return problem(403, "forbidden", "Message deletion is not allowed", "Only the message author can delete this message.", request);
  const ifMatch = request.headers.get("If-Match");
  if (ifMatch && ifMatch !== etag(current.version)) return staleMessageProblem(request);
  // OWASP A04:2025 Insecure Design. Compare the version in the write query to prevent a stale deletion.
  const changed = await context.sql.query<{ id: string }>("update orbit_messages set deleted_at = now(), version = version + 1 where owner_id = $1 and id = $2 and ($3::integer is null or version = $3) returning id", [context.userId, current.id, ifMatch ? current.version : null]);
  if (!changed[0]) return staleMessageProblem(request);
  return new Response(null, { status: 204 });
}

async function handleMessageResource(request: Request, context: OrbitApiContext, current: StoredMessage) {
  if (request.method === "GET") return json(current, 200, { ETag: etag(current.version) });
  if (request.method === "PATCH") return updateOwnedMessage(request, context, current);
  if (request.method === "DELETE") return deleteOwnedMessage(request, context, current);
  return methodNotAllowed(request);
}

async function handleMessage(request: Request, context: OrbitApiContext, parts: string[]) {
  const id = parts[1];
  const current = await message(context, id);
  if (!current) return problem(404, "not-found", "Message not found", "The requested message does not exist.", request);
  if (parts.length === 2) return handleMessageResource(request, context, current);
  if (parts.length === 4 && parts[2] === "attachments") return getMessageAttachment(request, context, id, parts[3]);
  if (parts.length === 4 && parts[2] === "reactions") return handleReaction(request, context, id, parts[3]);
  if (parts.length !== 3) return resourceNotFound(request);
  if (parts[2] === "saved") return handleSavedMessage(request, context, id);
  return resourceNotFound(request);
}

async function getMessageAttachment(request: Request, context: OrbitApiContext, messageId: string, attachmentId: string) {
  if (request.method !== "GET") return methodNotAllowed(request);
  const rows = await context.sql.query<{ name: string; media_type: string; content: Uint8Array }>(
    "select name, media_type, content from orbit_message_attachments where owner_id = $1 and message_id = $2 and id = $3",
    [context.userId, messageId, attachmentId],
  );
  const file = rows[0];
  if (!file) return problem(404, "not-found", "Attachment not found", "The requested attachment does not exist.", request);
  // OWASP A07:2025 Injection. Force download with nosniff so uploaded bytes cannot execute in the app origin.
  return new Response(Buffer.from(file.content), {
    status: 200,
    headers: {
      "Content-Type": file.media_type,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}

async function readProfile(context: OrbitApiContext) {
  const rows = await context.sql.query<JsonObject>("select presence, status from orbit_profiles where owner_id = $1", [context.userId]);
  const row = rows[0] ?? { presence: "online", status: "" };
  return json({ userId: context.userId, presence: String(row.presence), status: String(row.status ?? "") });
}

async function patchProfile(request: Request, context: OrbitApiContext) {
  const parsed = profileSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationProblem(parsed.error, request);
  await context.sql.query(
    `insert into orbit_profiles (owner_id, presence, status) values ($1, coalesce($2, 'online'), coalesce($3, ''))
     on conflict (owner_id) do update set presence = coalesce($2, orbit_profiles.presence), status = coalesce($3, orbit_profiles.status), updated_at = now()`,
    [context.userId, parsed.data.presence ?? null, parsed.data.status ?? null],
  );
  return readProfile(context);
}

async function handleProfile(request: Request, context: OrbitApiContext) {
  if (request.method === "GET") return readProfile(context);
  if (request.method === "PATCH") return patchProfile(request, context);
  return methodNotAllowed(request);
}

async function readPreferences(context: OrbitApiContext) {
  const rows = await context.sql.query<JsonObject>("select always_show_time from orbit_preferences where owner_id = $1", [context.userId]);
  return json({ alwaysShowTime: Boolean(rows[0]?.always_show_time ?? false) });
}

async function patchPreferences(request: Request, context: OrbitApiContext) {
  const parsed = preferencesSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationProblem(parsed.error, request);
  await context.sql.query("insert into orbit_preferences (owner_id, always_show_time) values ($1, $2) on conflict (owner_id) do update set always_show_time = excluded.always_show_time", [context.userId, parsed.data.alwaysShowTime]);
  return json(parsed.data);
}

async function handlePreferences(request: Request, context: OrbitApiContext) {
  if (request.method === "GET") return readPreferences(context);
  if (request.method === "PATCH") return patchPreferences(request, context);
  return methodNotAllowed(request);
}

async function listSavedMessages(context: OrbitApiContext) {
  const rows = await context.sql.query<{ message_id: string; saved_at: unknown }>("select message_id, saved_at from orbit_saved_messages where owner_id = $1 order by saved_at desc", [context.userId]);
  return json({ data: rows.map((row) => ({ messageId: row.message_id, savedAt: toDate(row.saved_at) })) });
}

async function listEndedCalls(request: Request, context: OrbitApiContext) {
  const pagination = pageParams(request);
  if (pagination instanceof Response) return pagination;
  const { limit, cursor, after } = pagination;
  const columns = `select id, conversation_id, kind, status, started_at, ended_at, duration_sec,
    to_char(ended_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') as page_ended_at
    from orbit_calls where owner_id = $1 and status = 'ended' and started_at is not null`;
  const rows = after
    ? await context.sql.query<JsonObject>(
        `${columns} and (ended_at, id) < ($2::timestamptz, $3::text) order by ended_at desc, id desc limit $4`,
        [context.userId, after.createdAt, after.id, limit],
      )
    : await context.sql.query<JsonObject>(
        `${columns} order by ended_at desc, id desc offset $2 limit $3`,
        [context.userId, cursor, limit],
      );
  const last = rows.at(-1);
  return json({
    data: rows.map(serializeCall),
    nextCursor: rows.length === limit ? String(cursor + rows.length) : null,
    nextPageToken: rows.length === limit && last ? encodePageToken(last.page_ended_at, String(last.id)) : null,
    hasMore: rows.length === limit,
  });
}

async function handleMe(request: Request, context: OrbitApiContext, parts: string[]) {
  if (parts.length !== 2) return resourceNotFound(request);
  if (parts[1] === "profile") return handleProfile(request, context);
  if (parts[1] === "preferences") return handlePreferences(request, context);
  if (parts[1] === "saved-messages") return request.method === "GET" ? listSavedMessages(context) : methodNotAllowed(request);
  if (parts[1] === "calls") return request.method === "GET" ? listEndedCalls(request, context) : methodNotAllowed(request);
  return resourceNotFound(request);
}

async function patchCall(request: Request, context: OrbitApiContext, row: JsonObject) {
  const id = String(row.id);
  const parsed = z.object({ status: z.enum(["lobby", "active", "ended"]) }).strict().safeParse(await readJson(request));
  if (!parsed.success) return validationProblem(parsed.error, request);
  const current = String(row.status);
  const target = parsed.data.status;
  // OWASP A04:2025 Insecure Design. Reject lifecycle reversal so an ended call cannot become active again.
  if (target !== current && (current === "ended" || target === "lobby")) {
    return problem(409, "call-state-conflict", "Call state conflict", "The requested call state cannot follow the current state.", request);
  }
  if (target === current) return json(serializeCall(row));
  // OWASP A04:2025 Insecure Design. Compare state in the write query to prevent a concurrent call-state reversal.
  const changed = await writeCallStatus(context, id, target, current);
  if (!changed[0]) return problem(409, "call-state-conflict", "Call state conflict", "The call changed while this request was in progress.", request);
  const updated = await context.sql.query<JsonObject>("select id, conversation_id, kind, status, started_at, ended_at, duration_sec from orbit_calls where owner_id = $1 and id = $2", [context.userId, id]);
  return json(serializeCall(updated[0]));
}

async function writeCallStatus(context: OrbitApiContext, id: string, status: "lobby" | "active" | "ended", current: string) {
  if (status === "active") return context.sql.query<{ id: string }>("update orbit_calls set status = 'active', started_at = coalesce(started_at, now()) where owner_id = $1 and id = $2 and status = $3 returning id", [context.userId, id, current]);
  if (status === "ended") return context.sql.query<{ id: string }>("update orbit_calls set status = 'ended', ended_at = now(), duration_sec = case when started_at is null then 0 else extract(epoch from (now() - started_at))::int end where owner_id = $1 and id = $2 and status = $3 returning id", [context.userId, id, current]);
  return [];
}

async function handleCalls(request: Request, context: OrbitApiContext, parts: string[]) {
  if (parts.length !== 2) return resourceNotFound(request);
  const id = parts[1];
  const rows = await context.sql.query<JsonObject>("select id, conversation_id, kind, status, started_at, ended_at, duration_sec from orbit_calls where owner_id = $1 and id = $2", [context.userId, id]);
  if (!rows[0]) return problem(404, "not-found", "Call not found", "The requested call does not exist.", request);
  if (request.method === "GET") return json(serializeCall(rows[0]));
  if (request.method === "PATCH") return patchCall(request, context, rows[0]);
  return methodNotAllowed(request);
}

async function dispatchResource(request: Request, context: OrbitApiContext, parts: string[]) {
  if (parts[2] === "workspaces") return handleWorkspaces(request, context, parts.slice(2));
  if (parts[2] === "conversations") return handleConversations(request, context, parts.slice(2));
  if (parts[2] === "messages") return handleMessage(request, context, parts.slice(2));
  if (parts[2] === "me") return handleMe(request, context, parts.slice(2));
  if (parts[2] === "calls") return handleCalls(request, context, parts.slice(2));
  return resourceNotFound(request);
}

export async function handleOrbitApi(request: Request, context: OrbitApiContext): Promise<Response> {
  if (!context.userId) return problem(401, "unauthorized", "Authentication required", "A valid session is required.", request);
  const path = new URL(request.url).pathname.replace(/^\/+|\/+$/g, "");
  const parts = path.split("/");
  if (parts[0] !== "api" || parts[1] !== "v1") return resourceNotFound(request);
  try {
    return await dispatchResource(request, context, parts);
  } catch (error) {
    if (error instanceof ApiRequestError) return problem(error.status, error.code, error.title, error.message, request);
    console.error("[orbit-api] request failed");
    return problem(500, "internal-error", "Request failed", "The server could not complete the request.", request);
  }
}

export function handleOrbitApiWithIdentity(request: Request, identity: OrbitIdentityContext): Promise<Response> {
  // OWASP A01:2025 Broken Access Control. Use only the verified session in authenticated mode.
  // The fixed auth-off owner makes the public demo explicit and never trusts a client-supplied ID.
  const userId = identity.authenticationRequired ? identity.verifiedUserId : PUBLIC_DEMO_OWNER_ID;
  if (!userId) return Promise.resolve(problem(401, "unauthorized", "Authentication required", "A valid session is required.", request));
  return handleOrbitApi(request, { sql: identity.sql, userId });
}
