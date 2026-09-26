import { format, isToday, isYesterday } from "date-fns";
import { SEED_CONVERSATIONS, SEED_MESSAGES, SEED_WORKSPACES, USERS, YOU } from "@/lib/orbit/seed";
import type { Conversation, Message, PersistedOrbit, Presence, User, Workspace } from "@/lib/orbit/types";

const FIVE_MINUTES = 5 * 60 * 1000;

export function userById(id: string): User {
  return (
    USERS.find((user) => user.id === id) ?? {
      id,
      name: "Unknown teammate",
      handle: "unknown",
      initials: "?",
      title: "",
      presence: "offline",
    }
  );
}

export function presenceOf(userId: string, selfPresence: Presence): Presence {
  if (userId === YOU) return selfPresence;
  return userById(userId).presence;
}

export function presenceLabel(presence: Presence) {
  if (presence === "online") return "Available";
  if (presence === "away") return "Away";
  return "Offline";
}

export function workspacesOf(extra: Workspace[]) {
  return [...SEED_WORKSPACES, ...extra];
}

export function conversationsOf(extra: Conversation[]) {
  return [...SEED_CONVERSATIONS, ...extra];
}

export function assembleMessages(state: Pick<PersistedOrbit, "createdMessages" | "edited" | "deletedIds" | "reactionOverrides">) {
  const deleted = new Set(state.deletedIds);
  const serverMessages = new Map(state.createdMessages.map((message) => [message.id, message]));
  const seededIds = new Set(SEED_MESSAGES.map((message) => message.id));
  const seeded = SEED_MESSAGES.map((message) => {
    const updated = serverMessages.get(message.id);
    return updated ? { ...message, ...updated, attachments: updated.attachments ?? message.attachments, pinned: updated.pinned ?? message.pinned, system: updated.system ?? message.system } : message;
  });
  return [...seeded, ...state.createdMessages.filter((message) => !seededIds.has(message.id))]
    .filter((message) => !deleted.has(message.id))
    .map((message) => {
      const edit = state.edited[message.id];
      const reactions = state.reactionOverrides[message.id] ?? message.reactions;
      if (!edit) return { ...message, reactions };
      return { ...message, body: edit.body, editedAt: edit.editedAt, reactions };
    })
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function conversationById(conversations: Conversation[], id: string) {
  return conversations.find((conversation) => conversation.id === id) ?? null;
}

export function memberIds(conversation: Conversation) {
  return conversation.kind === "channel" ? conversation.memberIds : conversation.participantIds;
}

export function conversationTitle(conversation: Conversation) {
  if (conversation.kind === "channel") return conversation.name;
  if (conversation.title) return conversation.title;
  const others = conversation.participantIds.filter((id) => id !== YOU);
  return others.map((id) => userById(id).name).join(", ") || "You";
}

export function peopleLabel(ids: string[]) {
  const names = ids.filter((id) => id !== YOU).map((id) => userById(id).name);
  if (names.length === 0) return "Just you";
  if (names.length === 1) return names[0] ?? "Just you";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export function rootMessages(messages: Message[], conversationId: string) {
  return messages.filter((message) => message.conversationId === conversationId && !message.parentId);
}

export function threadReplies(messages: Message[], parentId: string) {
  return messages.filter((message) => message.parentId === parentId);
}

export function replyCount(messages: Message[], parentId: string) {
  return threadReplies(messages, parentId).length;
}

export function replyCountsByParent(messages: Message[]) {
  const counts = new Map<string, number>();
  for (const message of messages) {
    if (!message.parentId) continue;
    counts.set(message.parentId, (counts.get(message.parentId) ?? 0) + 1);
  }
  return counts;
}

export function unreadMeta(messages: Message[], conversationId: string, lastRead?: string) {
  const cutoff = lastRead ? new Date(lastRead).getTime() : 0;
  const fresh = messages.filter(
    (message) =>
      message.conversationId === conversationId &&
      !message.system &&
      message.authorId !== YOU &&
      new Date(message.createdAt).getTime() > cutoff,
  );
  return { unread: fresh.length };
}

export function mentionBadge(messages: Message[], conversationId: string, readIds: string[]) {
  const read = new Set(readIds);
  return activityItems(messages).filter(
    (item) => item.kind === "mention" && item.conversationId === conversationId && !read.has(item.id),
  ).length;
}

export type ConversationBadge = { unread: number; mentions: number };

export function conversationBadges(
  messages: Message[],
  conversations: Conversation[],
  lastRead: Record<string, string>,
  activityReadIds: string[],
) {
  const badges = new Map<string, ConversationBadge>();
  const cutoffs = new Map<string, number>();
  for (const conversation of conversations) {
    badges.set(conversation.id, { unread: 0, mentions: 0 });
    cutoffs.set(conversation.id, lastRead[conversation.id] ? new Date(lastRead[conversation.id]!).getTime() : 0);
  }
  const activities = collectActivityItems(messages, (message) => countUnreadMessage(message, badges, cutoffs));
  addUnreadMentions(activities, badges, new Set(activityReadIds));
  return badges;
}

function countUnreadMessage(message: Message, badges: Map<string, ConversationBadge>, cutoffs: Map<string, number>) {
  const badge = badges.get(message.conversationId);
  if (!badge || message.system || message.authorId === YOU) return;
  if (new Date(message.createdAt).getTime() > (cutoffs.get(message.conversationId) ?? 0)) badge.unread += 1;
}

function addUnreadMentions(items: ActivityItem[], badges: Map<string, ConversationBadge>, read: Set<string>) {
  for (const item of items) {
    if (item.kind !== "mention" || read.has(item.id)) continue;
    const badge = badges.get(item.conversationId);
    if (badge) badge.mentions += 1;
  }
}

export type MessageGroup = {
  id: string;
  authorId: string;
  messages: Message[];
};

export function groupMessages(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = [];
  for (const message of messages) {
    const last = groups[groups.length - 1];
    const prev = last?.messages[last.messages.length - 1];
    if (canGroupMessage(last, prev, message) && last) last.messages.push(message);
    else groups.push({ id: message.id, authorId: message.authorId, messages: [message] });
  }
  return groups;
}

function canGroupMessage(last: MessageGroup | undefined, prev: Message | undefined, message: Message) {
  if (!last || !prev || message.system || prev.system || last.authorId !== message.authorId) return false;
  const closeInTime = new Date(message.createdAt).getTime() - new Date(prev.createdAt).getTime() < FIVE_MINUTES;
  return closeInTime && new Date(message.createdAt).toDateString() === new Date(prev.createdAt).toDateString();
}

export function dayLabel(iso: string) {
  const date = new Date(iso);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMM d");
}

export function timeLabel(iso: string) {
  return format(new Date(iso), "h:mm a");
}

export function gutterTime(iso: string) {
  return format(new Date(iso), "h:mm");
}

export function absoluteTime(iso: string) {
  return format(new Date(iso), "EEEE, MMMM d, yyyy 'at' h:mm a");
}

export type DayBucket = { key: string; label: string; messages: Message[] };

export function bucketByDay(messages: Message[]): DayBucket[] {
  const buckets: DayBucket[] = [];
  for (const message of messages) {
    const key = new Date(message.createdAt).toDateString();
    const last = buckets[buckets.length - 1];
    if (last?.key === key) last.messages.push(message);
    else buckets.push({ key, label: dayLabel(message.createdAt), messages: [message] });
  }
  return buckets;
}

export function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "");
  return letters.join("") || "OR";
}

export type ActivityItem = {
  id: string;
  kind: "mention" | "thread";
  message: Message;
  conversationId: string;
};

export function activityItems(messages: Message[]): ActivityItem[] {
  return collectActivityItems(messages);
}

function collectActivityItems(messages: Message[], visitMessage?: (message: Message) => void) {
  const participated = new Set<string>();
  for (const message of messages) {
    if (message.authorId === YOU && message.parentId) participated.add(message.parentId);
  }

  const items: ActivityItem[] = [];
  const mentionPattern = new RegExp(`@${userById(YOU).handle}\\b`, "i");
  for (const message of messages) {
    visitMessage?.(message);
    const item = activityForMessage(message, participated, mentionPattern);
    if (item) insertRecentActivity(items, item);
  }
  return items;
}

function activityForMessage(message: Message, participated: Set<string>, mentionPattern: RegExp): ActivityItem | null {
  if (message.authorId === YOU) return null;
  const mention = mentionPattern.test(message.body);
  const threadUpdate = Boolean(message.parentId && (participated.has(message.parentId) || mention));
  if (!mention && !threadUpdate) return null;
  return {
    id: message.id,
    kind: mention ? "mention" : "thread",
    message,
    conversationId: message.conversationId,
  };
}

function insertRecentActivity(items: ActivityItem[], item: ActivityItem) {
  let index = 0;
  while (index < items.length && items[index]!.message.createdAt >= item.message.createdAt) index += 1;
  if (index >= 8) return;
  items.splice(index, 0, item);
  if (items.length > 8) items.pop();
}

export function snippet(body: string, max = 140) {
  const flat = body.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max - 1).trimEnd()}…`;
}
