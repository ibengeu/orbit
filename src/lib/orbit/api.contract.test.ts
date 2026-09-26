import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { handleOrbitApi, handleOrbitApiWithIdentity } from "./api.ts";

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
      content bytea not null,
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
});

test("demo workspace creation provisions stable conversation and message resources", async () => {
  const context = await createApiContext();
  const response = await handleOrbitApi(
    new Request("https://optichat.test/api/v1/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Orbit", templateId: "orbit" }),
    }),
    context,
  );
  assert.equal(response.status, 201);
  assert.equal((await response.json()).id, "orbit");
  const product = await handleOrbitApi(
    new Request("https://optichat.test/api/v1/conversations/product/messages"),
    context,
  );
  assert.equal(product.status, 200);
  assert.ok((await product.json()).data.some((message: { id: string }) => message.id === "prod-mention"));
  const ownMessage = await handleOrbitApi(
    new Request("https://optichat.test/api/v1/messages/gen-checklist"),
    context,
  );
  assert.equal((await ownMessage.json()).authorId, "user-1");
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
