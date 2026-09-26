import type { Message, Presence } from "./types";
import { getBearerToken } from "@/lib/auth/client";

export type ApiProblem = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: Array<{ pointer: string; detail: string }>;
};

export class OrbitApiError extends Error {
  readonly problem: ApiProblem;

  constructor(problem: ApiProblem) {
    super(problem.detail);
    this.name = "OrbitApiError";
    this.problem = problem;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const bearer = getBearerToken();
  const response = await fetch(`/api/v1${path}`, {
    credentials: "same-origin",
    ...init,
    headers: { Accept: "application/json, application/problem+json", ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}), ...init?.headers },
  });
  if (!response.ok) {
    let problem: ApiProblem;
    try {
      problem = (await response.json()) as ApiProblem;
    } catch {
      problem = { type: "about:blank", title: response.statusText, status: response.status, detail: response.statusText };
    }
    throw new OrbitApiError(problem);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export type ApiProfile = { userId: string; presence: Presence; status: string };
export type ApiPreferences = { alwaysShowTime: boolean };
export type ApiWorkspace = { id: string; name: string; initials: string; createdAt: string; updatedAt: string };
export type ApiConversation = { id: string; workspaceId: string; kind: "channel" | "dm"; name?: string; description?: string; participantIds: string[]; title?: string; createdAt: string };
export type ApiMessage = Message & { version: number; deletedAt?: string };
export type ApiCall = { id: string; conversationId: string; kind: "voice" | "video"; status: "lobby" | "active" | "ended"; startedAt?: string; endedAt?: string; durationSec?: number };

export function getProfile() {
  return request<ApiProfile>("/me/profile");
}

export function updateProfile(input: Partial<Pick<ApiProfile, "presence" | "status">>) {
  return request<ApiProfile>("/me/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
}

export function getPreferences() {
  return request<ApiPreferences>("/me/preferences");
}

export function updatePreferences(input: ApiPreferences) {
  return request<ApiPreferences>("/me/preferences", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
}

export function listWorkspaces() {
  return request<{ data: ApiWorkspace[] }>("/workspaces");
}

export function getWorkspace(id: string) {
  return request<ApiWorkspace>(`/workspaces/${encodeURIComponent(id)}`);
}

export function createWorkspace(name: string, templateId?: "orbit" | "lumen") {
  return request<ApiWorkspace>("/workspaces", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, templateId }) });
}

export function listConversations(workspaceId: string) {
  return request<{ data: ApiConversation[] }>(`/workspaces/${encodeURIComponent(workspaceId)}/conversations`);
}

export function createConversation(input: { workspaceId: string; kind: "channel" | "dm"; name?: string; description?: string; participantIds?: string[]; title?: string }) {
  const { workspaceId, ...body } = input;
  return request<ApiConversation>(`/workspaces/${encodeURIComponent(workspaceId)}/conversations`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
}

export function listMessages(conversationId: string, options: { limit?: number; cursor?: number; includeDeleted?: boolean } = {}) {
  const query = new URLSearchParams();
  if (options.limit != null) query.set("limit", String(options.limit));
  if (options.cursor != null) query.set("cursor", String(options.cursor));
  if (options.includeDeleted) query.set("includeDeleted", "true");
  return request<{ data: ApiMessage[]; nextCursor: string | null; hasMore: boolean }>(`/conversations/${encodeURIComponent(conversationId)}/messages?${query}`);
}

export function createMessage(input: { conversationId: string; body: string; parentId?: string; file?: File }) {
  if (input.file) {
    const form = new FormData();
    form.set("body", input.body);
    if (input.parentId) form.set("parentId", input.parentId);
    form.set("file", input.file);
    return request<ApiMessage>(`/conversations/${encodeURIComponent(input.conversationId)}/messages`, { method: "POST", body: form });
  }
  return request<ApiMessage>(`/conversations/${encodeURIComponent(input.conversationId)}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body: input.body, parentId: input.parentId ?? null }) });
}

export async function downloadAttachment(messageId: string, attachmentId: string) {
  const bearer = getBearerToken();
  const response = await fetch(`/api/v1/messages/${encodeURIComponent(messageId)}/attachments/${encodeURIComponent(attachmentId)}`, {
    credentials: "same-origin",
    headers: bearer ? { Authorization: `Bearer ${bearer}` } : {},
  });
  if (!response.ok) throw new Error("Could not download the attachment.");
  return response.blob();
}

export function updateMessage(id: string, body: string, version?: number, restore = false) {
  return request<ApiMessage>(`/messages/${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...(version == null ? {} : { "If-Match": `"${version}"` }) }, body: JSON.stringify({ body, ...(restore ? { deleted: false } : {}) }) });
}

export function addReaction(id: string, emoji: string) {
  return request<ApiMessage>(`/messages/${encodeURIComponent(id)}/reactions/${encodeURIComponent(emoji)}`, { method: "PUT" });
}

export function removeReaction(id: string, emoji: string) {
  return request<ApiMessage>(`/messages/${encodeURIComponent(id)}/reactions/${encodeURIComponent(emoji)}`, { method: "DELETE" });
}

export function saveMessage(id: string) {
  return request<{ messageId: string; saved: boolean }>(`/messages/${encodeURIComponent(id)}/saved`, { method: "PUT" });
}

export function unsaveMessage(id: string) {
  return request<void>(`/messages/${encodeURIComponent(id)}/saved`, { method: "DELETE" });
}

export function deleteMessage(id: string, version?: number) {
  return request<void>(`/messages/${encodeURIComponent(id)}`, { method: "DELETE", headers: version == null ? undefined : { "If-Match": `"${version}"` } });
}

export function setReadState(conversationId: string, lastReadAt: string) {
  return request<{ conversationId: string; lastReadAt: string }>(`/conversations/${encodeURIComponent(conversationId)}/read-state`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lastReadAt }) });
}

export function getReadState(conversationId: string) {
  return request<{ conversationId: string; lastReadAt: string | null }>(`/conversations/${encodeURIComponent(conversationId)}/read-state`);
}

export function createCall(conversationId: string, kind: "voice" | "video") {
  return request<ApiCall>(`/conversations/${encodeURIComponent(conversationId)}/calls`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind }) });
}

export function updateCall(id: string, status: ApiCall["status"], options: { keepalive?: boolean } = {}) {
  return request<ApiCall>(`/calls/${encodeURIComponent(id)}`, { method: "PATCH", keepalive: options.keepalive, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
}

export function getCall(id: string) {
  return request<ApiCall>(`/calls/${encodeURIComponent(id)}`);
}

export function listCalls(options: { limit?: number; cursor?: number } = {}) {
  const query = new URLSearchParams();
  if (options.limit != null) query.set("limit", String(options.limit));
  if (options.cursor != null) query.set("cursor", String(options.cursor));
  return request<{ data: ApiCall[]; nextCursor: string | null; hasMore: boolean }>(`/me/calls?${query}`);
}

export function listSavedMessages() {
  return request<{ data: Array<{ messageId: string; savedAt: string }> }>("/me/saved-messages");
}
