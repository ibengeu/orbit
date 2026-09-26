export type Presence = "online" | "away" | "offline";

export type View = "conversation" | "activity" | "later";

export type User = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  title: string;
  presence: Presence;
  status?: string;
};

export type Workspace = {
  id: string;
  name: string;
  initials: string;
};

export type Conversation =
  | {
      kind: "channel";
      id: string;
      workspaceId: string;
      name: string;
      description: string;
      memberIds: string[];
    }
  | {
      kind: "dm";
      id: string;
      workspaceId: string;
      participantIds: string[];
      title?: string;
    };

export type Reaction = {
  emoji: string;
  userIds: string[];
};

export type Attachment = {
  id: string;
  name: string;
  size: number;
};

export type Message = {
  id: string;
  conversationId: string;
  authorId: string;
  body: string;
  createdAt: string;
  editedAt?: string;
  parentId?: string;
  reactions: Reaction[];
  attachments?: Attachment[];
  pinned?: boolean;
  system?: boolean;
};

export type CallKind = "voice" | "video";

export type DeviceState = "idle" | "requesting" | "live" | "muted" | "denied" | "unavailable";

export type DemoCall = {
  id: string;
  conversationId: string;
  kind: CallKind;
  phase: "lobby" | "active";
  startedAt: number | null;
  surface: "open" | "minimized";
  mic: DeviceState;
  camera: DeviceState;
  micDetail: string | null;
  cameraDetail: string | null;
};

export type CallHistoryItem = {
  id: string;
  conversationId: string;
  kind: CallKind;
  initiatorId: string;
  startedAt: string;
  endedAt: string;
  durationSec: number;
};

export type PersistedOrbit = {
  workspaceId: string;
  conversationId: string;
  threadParentId: string | null;
  view: View;
  drafts: Record<string, string>;
  draftAttachments: Record<string, Attachment[]>;
  savedIds: string[];
  savedAt: Record<string, string>;
  activityReadIds: string[];
  callHistory: CallHistoryItem[];
  collapsed: { channels: boolean; dms: boolean };
  lastRead: Record<string, string>;
  lastChannel: Record<string, string>;
  lastDm: Record<string, string>;
  createdMessages: Message[];
  edited: Record<string, { body: string; editedAt: string }>;
  deletedIds: string[];
  reactionOverrides: Record<string, Reaction[]>;
  presence: Presence;
  status: string;
  alwaysShowTime: boolean;
  extraWorkspaces: Workspace[];
  extraConversations: Conversation[];
};
