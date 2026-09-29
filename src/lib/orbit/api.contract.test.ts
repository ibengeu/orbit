import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { handleOrbitApi, handleOrbitApiWithIdentity } from "./api.ts";
import { YOU } from "./seed.ts";
import { DEMO_CONVERSATIONS, DEMO_LAST_READ, DEMO_MESSAGES, DEMO_WORKSPACES, seedOrbitDemo } from "../../../db/seed/orbit-demo.ts";

const databases: PGlite[] = [];

afterEach(async () => {
  await Promise.all(databases.splice(0).map((database) => database.close()));
});

async function createApiContext(userId = "user-1") {
  const database = new PGlite();
  databases.push(database);
  await database.exec(`
    create table orbit_workspaces (
      owner_id text not null,
      id text not null,
      name text not null,
      initials text not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      primary key (owner_id, id)
    );
    create table orbit_conversations (
      owner_id text not null,
      id text not null,
      workspace_id text not null,
      kind text not null,
      name text,
      description text,
      participant_ids jsonb not null default '[]'::jsonb,
      title text,
      created_at timestamptz not null default now(),
      primary key (owner_id, id),
      foreign key (owner_id, workspace_id)
        references orbit_workspaces(owner_id, id) on delete cascade
    );
    create table orbit_messages (
      owner_id text not null,
      id text not null,
      conversation_id text not null,
      author_id text not null,
      body text not null,
      parent_id text,
      created_at timestamptz not null default now(),
      edited_at timestamptz,
      deleted_at timestamptz,
      version integer not null default 1,
      pinned boolean not null default false,
      primary key (owner_id, id),
      foreign key (owner_id, conversation_id) references orbit_conversations(owner_id, id) on delete cascade
    );
    create table orbit_reactions (
      owner_id text not null,
      message_id text not null,
      user_id text not null,
      emoji text not null,
      created_at timestamptz not null default now(),
      primary key (owner_id, message_id, user_id, emoji)
    );
    create table orbit_saved_messages (
      owner_id text not null,
      message_id text not null,
      saved_at timestamptz not null default now(),
      primary key (owner_id, message_id)
    );
    create table orbit_message_attachments (
      owner_id text not null,
      id text not null,
      message_id text not null,
      name text not null,
      media_type text not null,
      size_bytes integer not null,
      content bytea,
      object_key text,
      check ((content is null) <> (object_key is null)),
      primary key (owner_id, id),
      foreign key (owner_id, message_id) references orbit_messages(owner_id, id) on delete cascade
    );
    create table orbit_read_states (
      owner_id text not null,
      conversation_id text not null,
      last_read_at timestamptz not null,
      primary key (owner_id, conversation_id)
    );
    create table orbit_profiles (
      owner_id text primary key,
      presence text not null default 'online',
      status text not null default '',
      updated_at timestamptz not null default now()
    );
    create table orbit_preferences (
      owner_id text primary key,
      always_show_time boolean not null default false,
      updated_at timestamptz not null default now()
    );
    create table orbit_calls (
      owner_id text not null,
      id text not null,
      conversation_id text not null,
      kind text not null,
      status text not null,
      started_at timestamptz,
      ended_at timestamptz,
      duration_sec integer,
      primary key (owner_id, id)
    );
  `);
  const sql = {
    async query<T = Record<string, unknown>>(text: string, params: unknown[] = []) {
      const result = await database.query<T>(text, params);
      return result.rows;
    },
  };
  return { sql, userId };
}

function createMemoryAttachmentStorage() {
  const objects = new Map<string, { content: Uint8Array; contentType: string }>();
  return {
    objects,
    async putObject(key: string, content: Uint8Array, contentType: string) {
      objects.set(key, { content: Uint8Array.from(content), contentType });
    },
    async getObject(key: string) {
      const object = objects.get(key);
      if (!object) throw new Error("Object not found");
      return Uint8Array.from(object.content);
    },
    async deleteObject(key: string) {
      objects.delete(key);
    },
  };
}

async function provisionWorkspace(context: Awaited<ReturnType<typeof createApiContext>>, name = "Orbit") {
  const response = await handleOrbitApi(
    new Request("https://optichat.test/api/v1/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }),
    context,
  );
  assert.equal(response.status, 201);
  return (await response.json()) as { id: string; name: string };
}

test("workspace creation returns a stable resource and persists its general channel", async () => {
  const context = await createApiContext();
  const createResponse = await handleOrbitApi(
    new Request("https://optichat.test/api/v1/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Research" }),
    }),
    context,
  );

  assert.equal(createResponse.status, 201);
  const workspace = (await createResponse.json()) as { id: string; name: string; initials: string };
  assert.match(workspace.id, /^ws-/);
  assert.equal(workspace.name, "Research");
  assert.equal(workspace.initials, "R");

  const duplicateResponse = await handleOrbitApi(
    new Request("https://optichat.test/api/v1/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "research" }),
    }),
    context,
  );
  assert.equal(duplicateResponse.status, 409);

  const getResponse = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}`),
    context,
  );
  assert.equal(getResponse.status, 200);
  assert.deepEqual(await getResponse.json(), workspace);

  const conversationsResponse = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`),
    context,
  );
  assert.equal(conversationsResponse.status, 200);
  const conversations = (await conversationsResponse.json()) as {
    data: Array<{ kind: string; name: string }>;
  };
  assert.deepEqual(conversations.data.map(({ kind, name }) => [kind, name]), [["channel", "general"]]);
});

test("messages persist, support reactions and saved state, and enforce author concurrency", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`), context);
  const conversation = (await conversations.json()).data[0] as { id: string };
  const createMessage = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: "Ship the API" }),
    }),
    context,
  );
  assert.equal(createMessage.status, 201);
  const message = (await createMessage.json()) as { id: string; version: number; body: string };
  assert.equal(message.body, "Ship the API");
  assert.equal(message.version, 1);
  const messageId = message.id;

  const ordinaryText = "'); drop table orbit_messages; --";
  const injectionText = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: ordinaryText }),
    }),
    context,
  );
  assert.equal(injectionText.status, 201);
  assert.equal((await injectionText.json()).body, ordinaryText);

  const reaction = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/messages/${messageId}/reactions/${encodeURIComponent("🚀")}`, {
      method: "PUT",
    }),
    context,
  );
  assert.equal(reaction.status, 200);
  assert.deepEqual((await reaction.json()).reactions, [{ emoji: "🚀", userIds: ["user-1"] }]);
  const removedReaction = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/messages/${messageId}/reactions/${encodeURIComponent("🚀")}`, { method: "DELETE" }),
    context,
  );
  assert.equal(removedReaction.status, 200);
  assert.deepEqual((await removedReaction.json()).reactions, []);

  const saved = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/messages/${messageId}/saved`, { method: "PUT" }),
    context,
  );
  assert.equal(saved.status, 200);
  assert.deepEqual(await saved.json(), { messageId, saved: true });

  const staleEdit = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/messages/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "If-Match": '"99"' },
      body: JSON.stringify({ body: "Stale edit" }),
    }),
    context,
  );
  assert.equal(staleEdit.status, 412);
  assert.equal(staleEdit.headers.get("Content-Type"), "application/problem+json");

  const edit = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/messages/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "If-Match": '"1"' },
      body: JSON.stringify({ body: "API shipped" }),
    }),
    context,
  );
  assert.equal(edit.status, 200);
  assert.equal((await edit.json()).body, "API shipped");

  const deletion = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/messages/${messageId}`, { method: "DELETE", headers: { "If-Match": '"2"' } }),
    context,
  );
  assert.equal(deletion.status, 204);
  const restored = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/messages/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "If-Match": '"3"' },
      body: JSON.stringify({ deleted: false }),
    }),
    context,
  );
  assert.equal(restored.status, 200);
  assert.equal((await restored.json()).body, "API shipped");

  await context.sql.query(
    "insert into orbit_messages (owner_id, id, conversation_id, author_id, body) values ($1, $2, $3, $4, $5)",
    [context.userId, "msg-other", conversation.id, "other-user", "Owned by another author"],
  );
  const forbiddenEdit = await handleOrbitApi(
    new Request("https://optichat.test/api/v1/messages/msg-other", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: "Must not change" }),
    }),
    context,
  );
  assert.equal(forbiddenEdit.status, 403);
  const forbiddenDelete = await handleOrbitApi(
    new Request("https://optichat.test/api/v1/messages/msg-other", { method: "DELETE" }),
    context,
  );
  assert.equal(forbiddenDelete.status, 403);

  const savedList = await handleOrbitApi(new Request("https://optichat.test/api/v1/me/saved-messages"), context);
  assert.deepEqual((await savedList.json()).data.map((item: { messageId: string }) => item.messageId), [messageId]);
});

test("validation, authentication, and ownership failures use safe problem details", async () => {
  const context = await createApiContext();
  const invalid = await handleOrbitApi(
    new Request("https://optichat.test/api/v1/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "" }),
    }),
    context,
  );
  assert.equal(invalid.status, 400);
  assert.equal(invalid.headers.get("Content-Type"), "application/problem+json");
  assert.equal((await invalid.json()).type, "https://optichat.dev/problems/validation-error");

  const unexpectedField = await handleOrbitApi(
    new Request("https://optichat.test/api/v1/workspaces", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Research", ownerId: "user-2" }),
    }),
    context,
  );
  assert.equal(unexpectedField.status, 400);
  assert.equal(unexpectedField.headers.get("Content-Type"), "application/problem+json");
  assert.equal((await unexpectedField.json()).errors[0].pointer, "/ownerId");

  const wrongMedia = await handleOrbitApi(new Request("https://optichat.test/api/v1/workspaces", {
    method: "POST", headers: { "Content-Type": "text/plain" }, body: '{"name":"Research"}',
  }), context);
  assert.equal(wrongMedia.status, 415);
  assert.equal(wrongMedia.headers.get("Content-Type"), "application/problem+json");

  const oversized = await handleOrbitApi(
    new Request("https://optichat.test/api/v1/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "x".repeat(1_000_001) }),
    }),
    context,
  );
  assert.equal(oversized.status, 413);
  assert.equal((await oversized.json()).type, "https://optichat.dev/problems/request-too-large");

  const unauthenticated = await handleOrbitApi(new Request("https://optichat.test/api/v1/workspaces"), { ...context, userId: "" });
  assert.equal(unauthenticated.status, 401);
  assert.equal(unauthenticated.headers.get("Content-Type"), "application/problem+json");

  const userOne = await handleOrbitApi(new Request("https://optichat.test/api/v1/workspaces"), context);
  assert.equal(userOne.status, 200);
  assert.deepEqual((await userOne.json()).data, []);
  const createdWorkspace = await provisionWorkspace(context);
  const userTwo = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${createdWorkspace.id}`), { ...context, userId: "user-2" });
  assert.equal(userTwo.status, 404);
  const unknownChild = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${createdWorkspace.id}/unknown`), context);
  assert.equal(unknownChild.status, 404);
});

test("profile, preferences, and read state persist between requests", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`), context);
  const conversation = (await conversations.json()).data[0] as { id: string };
  const profile = await handleOrbitApi(
    new Request("https://optichat.test/api/v1/me/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ presence: "away", status: "Reviewing" }),
    }),
    context,
  );
  assert.deepEqual(await profile.json(), { userId: "user-1", presence: "away", status: "Reviewing" });
  const preferences = await handleOrbitApi(
    new Request("https://optichat.test/api/v1/me/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alwaysShowTime: true }),
    }),
    context,
  );
  assert.deepEqual(await preferences.json(), { alwaysShowTime: true });
  const read = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/read-state`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lastReadAt: "2026-09-26T12:00:00.000Z" }),
    }),
    context,
  );
  assert.deepEqual(await read.json(), { conversationId: conversation.id, lastReadAt: "2026-09-26T12:00:00.000Z" });
  const readBack = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/read-state`), context);
  assert.deepEqual(await readBack.json(), { conversationId: conversation.id, lastReadAt: "2026-09-26T12:00:00.000Z" });
  const profileRead = await handleOrbitApi(new Request("https://optichat.test/api/v1/me/profile"), context);
  assert.deepEqual(await profileRead.json(), { userId: "user-1", presence: "away", status: "Reviewing" });
});

test("conversation creation and call lifecycle persist with ownership checks", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const createdConversation = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "channel", name: "launch", description: "Launch work" }),
    }),
    context,
  );
  assert.equal(createdConversation.status, 201);
  const conversation = (await createdConversation.json()) as { id: string; name: string; description: string };
  assert.equal(conversation.name, "launch");
  assert.equal(conversation.description, "Launch work");

  const callResponse = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/calls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "voice" }),
    }),
    context,
  );
  assert.equal(callResponse.status, 201);
  const call = (await callResponse.json()) as { id: string; status: string };
  assert.equal(call.status, "lobby");

  const active = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/calls/${call.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "active" }),
    }),
    context,
  );
  assert.equal((await active.json()).status, "active");

  const ended = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/calls/${call.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ended" }),
    }),
    context,
  );
  const endedCall = (await ended.json()) as { status: string; durationSec: number };
  assert.equal(endedCall.status, "ended");
  assert.equal(typeof endedCall.durationSec, "number");

  const history = await handleOrbitApi(new Request("https://optichat.test/api/v1/me/calls"), context);
  assert.deepEqual((await history.json()).data.map((item: { id: string }) => item.id), [call.id]);

  const otherUser = await handleOrbitApi(new Request(`https://optichat.test/api/v1/calls/${call.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "lobby" }) }), { ...context, userId: "user-2" });
  assert.equal(otherUser.status, 404);
});

test("ended calls stay ended and can be read by their owner", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`), context);
  const conversation = (await conversations.json()).data[0] as { id: string };
  const created = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/calls`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "voice" }),
  }), context);
  const call = (await created.json()) as { id: string };
  const end = await handleOrbitApi(new Request(`https://optichat.test/api/v1/calls/${call.id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "ended" }),
  }), context);
  assert.equal(end.status, 200);
  const reopen = await handleOrbitApi(new Request(`https://optichat.test/api/v1/calls/${call.id}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "active" }),
  }), context);
  assert.equal(reopen.status, 409);
  assert.equal(reopen.headers.get("content-type"), "application/problem+json");
  const read = await handleOrbitApi(new Request(`https://optichat.test/api/v1/calls/${call.id}`), context);
  assert.equal(read.status, 200);
  assert.equal((await read.json()).status, "ended");
  const hidden = await handleOrbitApi(new Request(`https://optichat.test/api/v1/calls/${call.id}`), { ...context, userId: "user-2" });
  assert.equal(hidden.status, 404);
});

test("ended call history supports pagination", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`), context);
  const conversation = (await conversations.json()).data[0] as { id: string };
  for (const id of ["call-a", "call-b", "call-c"]) {
    await context.sql.query("insert into orbit_calls (owner_id, id, conversation_id, kind, status, started_at, ended_at, duration_sec) values ($1, $2, $3, 'voice', 'ended', now(), now(), 0)", [context.userId, id, conversation.id]);
  }
  const first = await handleOrbitApi(new Request("https://optichat.test/api/v1/me/calls?limit=2"), context);
  const firstBody = await first.json() as { data: Array<{ id: string }>; nextCursor: string | null; hasMore: boolean };
  assert.equal(firstBody.data.length, 2);
  assert.equal(firstBody.nextCursor, "2");
  assert.equal(firstBody.hasMore, true);
  const second = await handleOrbitApi(new Request(`https://optichat.test/api/v1/me/calls?limit=2&cursor=${firstBody.nextCursor}`), context);
  const secondBody = await second.json() as { data: Array<{ id: string }>; hasMore: boolean };
  assert.equal(secondBody.data.length, 1);
  assert.equal(secondBody.hasMore, false);
});

test("ended call keyset pages preserve equal-time records", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`),
    context,
  );
  const conversation = (await conversations.json()).data[0] as { id: string };

  for (const id of ["call-a", "call-b", "call-c"]) {
    await context.sql.query(
      "insert into orbit_calls (owner_id, id, conversation_id, kind, status, started_at, ended_at, duration_sec) values ($1, $2, $3, 'voice', 'ended', $4, $4, 0)",
      [context.userId, id, conversation.id, "2026-01-01T00:00:00.000200Z"],
    );
  }

  const first = await handleOrbitApi(new Request("https://optichat.test/api/v1/me/calls?limit=2"), context);
  const firstBody = await first.json() as {
    data: Array<{ id: string }>;
    nextCursor: string | null;
    nextPageToken: string | null;
    hasMore: boolean;
  };
  assert.deepEqual(firstBody.data.map((item) => item.id), ["call-c", "call-b"]);
  assert.ok(firstBody.nextPageToken);

  const second = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/me/calls?limit=2&cursor=${firstBody.nextCursor}&after=${encodeURIComponent(firstBody.nextPageToken)}`),
    context,
  );
  const secondBody = await second.json() as { data: Array<{ id: string }>; hasMore: boolean };
  assert.deepEqual(secondBody.data.map((item) => item.id), ["call-a"]);
  assert.equal(secondBody.hasMore, false);
});

test("message keyset pages keep equal-timestamp messages and their details stable", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`),
    context,
  );
  const conversation = (await conversations.json()).data[0] as { id: string };
  const messages = [
    ["page-a", "2026-01-01T00:00:00.000100Z"],
    ["page-b", "2026-01-01T00:00:00.000200Z"],
    ["page-c", "2026-01-01T00:00:00.000200Z"],
  ];

  for (const [id, createdAt] of messages) {
    await context.sql.query(
      "insert into orbit_messages (owner_id, id, conversation_id, author_id, body, created_at) values ($1, $2, $3, $1, $4, $5)",
      [context.userId, id, conversation.id, id, createdAt],
    );
  }
  await context.sql.query(
    "insert into orbit_reactions (owner_id, message_id, user_id, emoji) values ($1, 'page-b', $1, '👍')",
    [context.userId],
  );
  await context.sql.query(
    "insert into orbit_message_attachments (owner_id, id, message_id, name, media_type, size_bytes, content) values ($1, 'attachment-b', 'page-b', 'notes.txt', 'text/plain', 1, $2)",
    [context.userId, Buffer.from("x")],
  );
  await context.sql.query(
    "insert into orbit_workspaces (owner_id, id, name, initials) values ('user-2', 'other-workspace', 'Other', 'OT')",
  );
  await context.sql.query(
    "insert into orbit_conversations (owner_id, id, workspace_id, kind, name) values ('user-2', 'other-room', 'other-workspace', 'channel', 'other-room')",
  );
  await context.sql.query(
    "insert into orbit_messages (owner_id, id, conversation_id, author_id, body, created_at) values ('user-2', 'page-b', 'other-room', 'user-2', 'Private message', $1)",
    ["2026-01-01T00:00:00.000200Z"],
  );
  await context.sql.query("insert into orbit_reactions (owner_id, message_id, user_id, emoji) values ('user-2', 'page-b', 'user-2', '🔒')");
  await context.sql.query(
    "insert into orbit_message_attachments (owner_id, id, message_id, name, media_type, size_bytes, content) values ('user-2', 'other-attachment', 'page-b', 'private.txt', 'text/plain', 1, $1)",
    [Buffer.from("y")],
  );
  await context.sql.query("update orbit_messages set deleted_at = now() where owner_id = $1 and id = 'page-a'", [context.userId]);

  const first = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/messages?limit=2&includeDeleted=true`),
    context,
  );
  const firstBody = await first.json() as {
    data: Array<{ id: string; body: string; reactions: Array<{ emoji: string }>; attachments?: Array<{ name: string }>; deletedAt?: string }>;
    nextCursor: string | null;
    nextPageToken: string | null;
    hasMore: boolean;
  };

  assert.equal(firstBody.hasMore, true);
  assert.equal(firstBody.nextCursor, "2");
  assert.ok(firstBody.nextPageToken);
  assert.deepEqual(firstBody.data.map((item) => item.id), ["page-c", "page-b"]);
  assert.equal(firstBody.data[1]?.body, "page-b");
  assert.deepEqual(firstBody.data[1]?.reactions.map((item) => item.emoji), ["👍"]);
  assert.deepEqual(firstBody.data[1]?.attachments?.map((item) => item.name), ["notes.txt"]);
  assert.equal(Object.hasOwn(firstBody.data[1]?.attachments?.[0] ?? {}, "content"), false);

  const second = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/messages?limit=2&cursor=${firstBody.nextCursor}&after=${encodeURIComponent(firstBody.nextPageToken)}&includeDeleted=true`),
    context,
  );
  const secondBody = await second.json() as {
    data: Array<{ id: string; deletedAt?: string }>;
    nextCursor: string | null;
    nextPageToken: string | null;
    hasMore: boolean;
  };

  assert.deepEqual(secondBody.data.map((item) => item.id), ["page-a"]);
  assert.ok(secondBody.data[0]?.deletedAt);
  assert.equal(secondBody.nextPageToken, null);
  assert.equal(secondBody.hasMore, false);
});

test("invalid message pagination returns a field-level problem", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`),
    context,
  );
  const conversation = (await conversations.json()).data[0] as { id: string };
  const response = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/messages?limit=101`),
    context,
  );
  assert.equal(response.status, 400);
  assert.equal(response.headers.get("Content-Type"), "application/problem+json");
  assert.deepEqual((await response.json()).errors, [
    { pointer: "/limit", detail: "Expected a whole number from 1 to 100." },
  ]);
  const invalidDeleted = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/messages?includeDeleted=maybe`), context);
  assert.equal(invalidDeleted.status, 400);
  assert.equal((await invalidDeleted.json()).errors[0].pointer, "/includeDeleted");
  const invalidAfter = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/messages?after=not-a-page-token`), context);
  assert.equal(invalidAfter.status, 400);
  assert.equal((await invalidAfter.json()).errors[0].pointer, "/after");
});

test("the demo seed gives its owner the demo workspaces, conversations, messages, and read state", async () => {
  const context = await createApiContext();
  await seedOrbitDemo(context.sql, context.userId);
  // OWASP A04:2025 Insecure Design. The seed is idempotent so a repeated job cannot duplicate demo data.
  await seedOrbitDemo(context.sql, context.userId);

  const workspaces = await handleOrbitApi(new Request("https://optichat.test/api/v1/workspaces"), context);
  assert.deepEqual((await workspaces.json()).data.map((item: { id: string; name: string }) => [item.id, item.name]).sort(),
    DEMO_WORKSPACES.map((item) => [item.id, item.name]).sort());

  const actualMessages: Array<{
    id: string;
    conversationId: string;
    body: string;
    authorId: string;
    parentId?: string;
    createdAt: string;
    pinned: boolean;
    attachments?: Array<{ id: string; name: string; size: number }>;
    reactions: Array<{ emoji: string; userIds: string[] }>;
  }> = [];
  for (const workspace of DEMO_WORKSPACES) {
    const listed = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`), context);
    const conversations = (await listed.json()).data as Array<{ id: string; participantIds: string[] }>;
    const expectedConversations = DEMO_CONVERSATIONS.filter((item) => item.workspaceId === workspace.id);
    // Conversations list in fixture order, so each workspace opens on its first channel.
    assert.deepEqual(conversations.map((item) => item.id), expectedConversations.map((item) => item.id));
    for (const conversation of conversations) {
      assert.ok(!conversation.participantIds.includes(YOU), "the seed maps the demo user to the owner");
      const response = await handleOrbitApi(
        new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/messages?limit=100`),
        context,
      );
      assert.equal(response.status, 200);
      const page = (await response.json()).data as typeof actualMessages;
      const orderedExpected = DEMO_MESSAGES
        .filter((message) => message.conversationId === conversation.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
      assert.deepEqual(page.map((message) => message.id), orderedExpected.map((message) => message.id));
      actualMessages.push(...page);
    }
  }
  assert.equal(actualMessages.length, DEMO_MESSAGES.length);

  for (const expected of DEMO_MESSAGES) {
    const actual = actualMessages.find((message: { id: string }) => message.id === expected.id);
    assert.ok(actual, `Missing seeded message ${expected.id}`);
    assert.equal(actual.body, expected.body);
    assert.equal(actual.authorId, expected.authorId === YOU ? context.userId : expected.authorId);
    assert.equal(actual.parentId ?? null, expected.parentId ?? null);
    assert.equal(actual.createdAt, expected.createdAt);
    assert.equal(actual.pinned, expected.pinned ?? false, `pinned state of ${expected.id}`);
    assert.deepEqual(actual.attachments, expected.attachments, `attachments of ${expected.id}`);
    for (const file of expected.attachments ?? []) {
      const download = await handleOrbitApi(new Request(`https://optichat.test/api/v1/messages/${expected.id}/attachments/${file.id}`), context);
      assert.equal(download.status, 200);
      const bytes = new Uint8Array(await download.arrayBuffer());
      assert.equal(bytes.byteLength, file.size);
      assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], `${file.name} is a PNG`);
    }
    const expectedReactions = expected.reactions.map((reaction) => ({
      emoji: reaction.emoji,
      userIds: reaction.userIds.map((userId) => userId === YOU ? context.userId : userId),
    }));
    assert.deepEqual(actual.reactions, expectedReactions);
  }

  for (const [conversationId, lastReadAt] of Object.entries(DEMO_LAST_READ)) {
    const readState = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversationId}/read-state`), context);
    assert.equal((await readState.json()).lastReadAt, lastReadAt);
  }
});

test("the demo seed refuses to write into an owner whose conversation ids already belong to another workspace", async () => {
  const context = await createApiContext();
  await provisionWorkspace(context, "Team");
  // OWASP A04:2025 Insecure Design. Fail safely instead of attaching demo messages to a user's own conversation.
  await assert.rejects(seedOrbitDemo(context.sql, context.userId), /already used by another workspace/);
  const workspaces = await handleOrbitApi(new Request("https://optichat.test/api/v1/workspaces"), context);
  assert.deepEqual((await workspaces.json()).data.map((item: { name: string }) => item.name), ["Team"]);
  const general = await handleOrbitApi(new Request("https://optichat.test/api/v1/conversations/general/messages"), context);
  assert.deepEqual((await general.json()).data, []);
});

test("a workspace request cannot copy demo data or choose a demo workspace id", async () => {
  const context = await createApiContext();
  const response = await handleOrbitApi(
    new Request("https://optichat.test/api/v1/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Orbit", templateId: "orbit" }),
    }),
    context,
  );
  // OWASP A01:2025 Broken Access Control. The server assigns workspace ids; a client field cannot select a fixed id or copy data.
  assert.equal(response.status, 400);
  assert.equal(response.headers.get("Content-Type"), "application/problem+json");
  const workspaces = await handleOrbitApi(new Request("https://optichat.test/api/v1/workspaces"), context);
  assert.deepEqual((await workspaces.json()).data, []);
});

test("message listing can include soft-delete markers for state recovery", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`), context,
  );
  const conversation = (await conversations.json()).data[0] as { id: string };
  const created = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/messages`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body: "Temporary" }),
    }), context,
  );
  const id = (await created.json()).id as string;
  await handleOrbitApi(new Request(`https://optichat.test/api/v1/messages/${id}`, { method: "DELETE" }), context);
  const visible = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/messages`), context,
  );
  assert.deepEqual((await visible.json()).data, []);
  const all = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/conversations/${conversation.id}/messages?includeDeleted=true`), context,
  );
  assert.equal((await all.json()).data[0].id, id);
  assert.ok((await handleOrbitApi(new Request(`https://optichat.test/api/v1/messages/${id}`), context)).ok);
});

test("direct conversations always include the authenticated caller", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const response = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "dm", participantIds: ["mina"] }),
    }),
    context,
  );
  assert.equal(response.status, 201);
  assert.deepEqual((await response.json()).participantIds, ["user-1", "mina"]);
});

test("an attached file persists and only the owner can download it", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`), context);
  const conversationId = (await conversations.json()).data[0].id as string;
  const form = new FormData();
  form.set("body", "File for the team");
  form.set("file", new File(["safe example"], "notes.txt", { type: "text/plain" }));
  const created = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversationId}/messages`, {
    method: "POST", body: form,
  }), context);
  assert.equal(created.status, 201);
  const message = await created.json();
  assert.equal(message.attachments[0].name, "notes.txt");
  const path = `https://optichat.test/api/v1/messages/${message.id}/attachments/${message.attachments[0].id}`;
  const download = await handleOrbitApi(new Request(path), context);
  assert.equal(download.status, 200);
  assert.equal(download.headers.get("Content-Type"), "text/plain");
  assert.equal(await download.text(), "safe example");
  const hidden = await handleOrbitApi(new Request(path), { ...context, userId: "user-2" });
  assert.equal(hidden.status, 404);
  assert.equal(hidden.headers.get("Content-Type"), "application/problem+json");
});

test("configured object storage keeps attachment bytes out of Postgres and serves the same bytes", async () => {
  const context = await createApiContext();
  const storage = createMemoryAttachmentStorage();
  const storageContext = { ...context, attachmentStorage: storage };
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`), context);
  const conversationId = (await conversations.json()).data[0].id as string;
  const form = new FormData();
  form.set("body", "Stored in OptiStorage");
  form.set("file", new File(["object-store bytes"], "notes.txt", { type: "text/plain" }));

  const created = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversationId}/messages`, {
    method: "POST", body: form,
  }), storageContext);
  assert.equal(created.status, 201);
  const message = await created.json();
  const rows = await context.sql.query<{ content: Uint8Array | null; object_key: string | null }>(
    "select content, object_key from orbit_message_attachments where owner_id = $1 and message_id = $2",
    [context.userId, message.id],
  );
  assert.equal(rows[0]?.content, null);
  assert.ok(rows[0]?.object_key);
  assert.deepEqual(Object.keys(message.attachments[0]).sort(), ["id", "name", "size"]);
  assert.equal(new TextDecoder().decode(await storage.getObject(rows[0]!.object_key!)), "object-store bytes");

  const download = await handleOrbitApi(new Request(`https://optichat.test/api/v1/messages/${message.id}/attachments/${message.attachments[0].id}`), storageContext);
  assert.equal(download.status, 200);
  assert.equal(download.headers.get("Content-Type"), "text/plain");
  assert.equal(await download.text(), "object-store bytes");
  const hidden = await handleOrbitApi(
    new Request(`https://optichat.test/api/v1/messages/${message.id}/attachments/${message.attachments[0].id}`),
    { ...storageContext, userId: "user-2" },
  );
  assert.equal(hidden.status, 404);
});

test("OptiStorage upload failure returns a safe error and creates no message", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`), context);
  const conversationId = (await conversations.json()).data[0].id as string;
  const storageContext = {
    ...context,
    attachmentStorage: {
      async putObject() { throw new Error("credential-bearing upstream error"); },
      async getObject() { throw new Error("unused"); },
      async deleteObject() {},
    },
  };
  const form = new FormData();
  form.set("body", "Storage outage");
  form.set("file", new File(["bytes"], "outage.txt", { type: "text/plain" }));

  const response = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversationId}/messages`, {
    method: "POST", body: form,
  }), storageContext);
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("Content-Type"), "application/problem+json");
  assert.equal((await response.text()).includes("credential-bearing"), false);
  const messages = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversationId}/messages`), context);
  assert.deepEqual((await messages.json()).data, []);
});

test("failed attachment metadata writes remove the uploaded object", async () => {
  const context = await createApiContext();
  const storage = createMemoryAttachmentStorage();
  const storageContext = { ...context, attachmentStorage: storage };
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`), context);
  const conversationId = (await conversations.json()).data[0].id as string;
  await context.sql.query("alter table orbit_message_attachments add constraint reject_attachment_write check (false)");
  const form = new FormData();
  form.set("body", "Database failure");
  form.set("file", new File(["temporary bytes"], "temporary.txt", { type: "text/plain" }));

  const response = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversationId}/messages`, {
    method: "POST", body: form,
  }), storageContext);
  assert.equal(response.status, 500);
  assert.equal(response.headers.get("Content-Type"), "application/problem+json");
  assert.equal(storage.objects.size, 0);
  const messages = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversationId}/messages`), context);
  assert.deepEqual((await messages.json()).data, []);
});

test("remote plain HTTP OptiStorage endpoints fail closed before accepting an attachment", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`), context);
  const conversationId = (await conversations.json()).data[0].id as string;
  const keys = ["OPTISTORAGE_ENDPOINT", "OPTISTORAGE_BUCKET", "OPTISTORAGE_ACCESS_KEY_ID", "OPTISTORAGE_SECRET_ACCESS_KEY"] as const;
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  process.env.OPTISTORAGE_ENDPOINT = "http://storage.example";
  process.env.OPTISTORAGE_BUCKET = "orbit-files";
  process.env.OPTISTORAGE_ACCESS_KEY_ID = "test-access-key";
  process.env.OPTISTORAGE_SECRET_ACCESS_KEY = "test-secret-key";
  try {
    const form = new FormData();
    form.set("body", "Should not upload");
    form.set("file", new File(["bytes"], "blocked.txt", { type: "text/plain" }));
    const response = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversationId}/messages`, {
      method: "POST", body: form,
    }), context);
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("Content-Type"), "application/problem+json");
    assert.equal((await response.text()).includes("storage.example"), false);
  } finally {
    for (const key of keys) {
      const value = previous[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("active content in an attachment is rejected without creating a message", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`), context);
  const conversationId = (await conversations.json()).data[0].id as string;
  const form = new FormData();
  form.set("body", "Unsafe file");
  form.set("file", new File(["<svg onload=alert(1)>"], "image.svg", { type: "image/svg+xml" }));
  const result = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversationId}/messages`, {
    method: "POST", body: form,
  }), context);
  assert.equal(result.status, 400);
  assert.equal(result.headers.get("Content-Type"), "application/problem+json");
  const messages = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversationId}/messages`), context);
  assert.deepEqual((await messages.json()).data, []);
});

test("a file can be sent without text", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`), context);
  const conversationId = (await conversations.json()).data[0].id as string;
  const form = new FormData();
  form.set("body", "");
  form.set("file", new File(["file only"], "alone.txt", { type: "text/plain" }));
  const created = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversationId}/messages`, {
    method: "POST", body: form,
  }), context);
  assert.equal(created.status, 201);
  const message = await created.json();
  assert.equal(message.body, "");
  assert.equal(message.attachments[0].name, "alone.txt");
});

test("an oversized file returns a safe 413 and leaves no message", async () => {
  const context = await createApiContext();
  const workspace = await provisionWorkspace(context);
  const conversations = await handleOrbitApi(new Request(`https://optichat.test/api/v1/workspaces/${workspace.id}/conversations`), context);
  const conversationId = (await conversations.json()).data[0].id as string;
  const form = new FormData();
  form.set("body", "Too large");
  form.set("file", new File([new Uint8Array(10 * 1024 * 1024 + 1)], "huge.txt", { type: "text/plain" }));
  const response = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversationId}/messages`, {
    method: "POST", body: form,
  }), context);
  assert.equal(response.status, 413);
  assert.equal(response.headers.get("Content-Type"), "application/problem+json");
  const messages = await handleOrbitApi(new Request(`https://optichat.test/api/v1/conversations/${conversationId}/messages`), context);
  assert.deepEqual((await messages.json()).data, []);
});

test("an auth-off database uses one public demo owner while auth-on still requires a session", async () => {
  const context = await createApiContext();
  const create = await handleOrbitApiWithIdentity(new Request("https://optichat.test/api/v1/workspaces", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Public demo" }),
  }), { sql: context.sql, authenticationRequired: false, verifiedUserId: null });
  assert.equal(create.status, 201);
  const created = await create.json();
  const read = await handleOrbitApiWithIdentity(new Request(`https://optichat.test/api/v1/workspaces/${created.id}`), {
    sql: context.sql, authenticationRequired: false, verifiedUserId: null,
  });
  assert.equal(read.status, 200);
  assert.equal((await read.json()).id, created.id);
  const privateRead = await handleOrbitApiWithIdentity(new Request(`https://optichat.test/api/v1/workspaces/${created.id}`), {
    sql: context.sql, authenticationRequired: true, verifiedUserId: null,
  });
  assert.equal(privateRead.status, 401);
  assert.equal(privateRead.headers.get("Content-Type"), "application/problem+json");
  const signedInRead = await handleOrbitApiWithIdentity(new Request(`https://optichat.test/api/v1/workspaces/${created.id}`), {
    sql: context.sql, authenticationRequired: true, verifiedUserId: "user-1",
  });
  assert.equal(signedInRead.status, 404);
});
