import { create } from "zustand";
import { addReaction, createCall, createConversation as createServerConversation, createMessage, createWorkspace as createServerWorkspace, deleteMessage as deleteServerMessage, listConversations, OrbitApiError, removeReaction, saveMessage, setReadState, unsaveMessage, updateCall, updateMessage, updatePreferences, updateProfile } from "@/lib/orbit/api-client";
import { workspaceNameError } from "@/lib/orbit/compose";
import { activityItems, assembleMessages, conversationById, conversationsOf, memberIds, slugify, workspacesOf } from "@/lib/orbit/derive";
import { captureMedia, explainMediaError, forgetFile, localFile, localTracks, setTrackEnabled, stopCallTracks } from "@/lib/orbit/media";
import { STORAGE_KEY, YOU } from "@/lib/orbit/seed";
import type { Attachment, CallHistoryItem, CallKind, Conversation, DemoCall, Message, PersistedOrbit, Presence, View, Workspace } from "@/lib/orbit/types";

type OrbitStore = PersistedOrbit & {
  hydrated: boolean;
  cacheOwnerId: string | null;
  highlightId: string | null;
  searchOpen: boolean;
  searchScopeId: string | null;
  searchReturn: HTMLElement | null;
  threadReturn: HTMLElement | null;
  recentIds: string[];
  menu: "workspace" | "profile" | null;
  navOpen: boolean;
  channelDialog: boolean;
  workspaceDialog: boolean;
  statusDialog: boolean;
  prefsDialog: boolean;
  hydrate: () => void;
  clearAccountState: () => void;
  setWorkspace: (id: string) => void;
  openConversation: (id: string, options?: { keepThread?: boolean }) => void;
  setView: (view: View) => void;
  toggleSection: (key: "channels" | "dms") => void;
  setDraft: (key: string, value: string) => void;
  setDraftAttachments: (key: string, files: Attachment[]) => void;
  sendMessage: (input: {
    conversationId: string;
    body: string;
    parentId?: string;
    attachments?: Attachment[];
    draftKey: string;
  }) => void;
  toggleReaction: (messageId: string, emoji: string) => void;
  toggleSaved: (messageId: string) => void;
  editMessage: (messageId: string, body: string) => void;
  deleteMessage: (messageId: string) => void;
  undoDelete: (messageId: string) => void;
  openThread: (parentId: string) => void;
  closeThread: () => void;
  highlight: (messageId: string) => void;
  focusMessage: (messageId: string) => void;
  openDirectMessage: (userId: string) => Promise<void>;
  setMenu: (menu: "workspace" | "profile" | null) => void;
  openSearch: (scopeId?: string | null) => void;
  setSearchOpen: (open: boolean) => void;
  setNavOpen: (open: boolean) => void;
  setChannelDialog: (open: boolean) => void;
  setWorkspaceDialog: (open: boolean) => void;
  setStatusDialog: (open: boolean) => void;
  setPrefsDialog: (open: boolean) => void;
  setPresence: (presence: Presence) => void;
  setStatus: (status: string) => void;
  setAlwaysShowTime: (value: boolean) => void;
  createWorkspace: (name: string) => Promise<string | null>;
  createChannel: (name: string, description: string) => Promise<string | null>;
  goHome: () => void;
  goDms: () => void;
  resetLocalView: () => void;
  liveMessage: string;
  announce: (message: string) => void;
  call: DemoCall | null;
  callSwitch: { conversationId: string; kind: CallKind } | null;
  requestCall: (conversationId: string, kind: CallKind) => Promise<void>;
  cancelLobby: () => Promise<void>;
  joinDemoCall: (options?: { withoutMic?: boolean; withoutCamera?: boolean }) => Promise<void>;
  enablePreview: () => Promise<void>;
  retryDevice: (device: "mic" | "camera") => Promise<void>;
  toggleMute: () => Promise<void>;
  toggleCamera: () => Promise<void>;
  endCall: () => Promise<void>;
  minimizeCall: () => void;
  returnToCall: () => void;
  confirmCallSwitch: () => Promise<void>;
  dismissCallSwitch: () => void;
  openActivity: (messageId: string) => void;
  markActivityRead: () => void;
};

const EMPTY_PERSISTED = (): PersistedOrbit => ({
  workspaceId: "",
  conversationId: "",
  threadParentId: null,
  view: "conversation",
  drafts: {},
  draftAttachments: {},
  savedIds: [],
  savedAt: {},
  activityReadIds: [],
  callHistory: [],
  collapsed: { channels: false, dms: false },
  lastRead: {},
  lastChannel: {},
  lastDm: {},
  createdMessages: [],
  edited: {},
  deletedIds: [],
  reactionOverrides: {},
  presence: "online",
  status: "Launch desk",
  alwaysShowTime: false,
  extraWorkspaces: [],
  extraConversations: [],
});

type LocalOrbitCache = Pick<PersistedOrbit, "workspaceId" | "conversationId" | "threadParentId" | "view" | "drafts" | "draftAttachments" | "activityReadIds" | "collapsed" | "lastChannel" | "lastDm">;

function snapshot(state: OrbitStore): LocalOrbitCache {
  return {
    workspaceId: state.workspaceId,
    conversationId: state.conversationId,
    threadParentId: state.threadParentId,
    view: state.view,
    drafts: state.drafts,
    draftAttachments: state.draftAttachments,
    activityReadIds: state.activityReadIds,
    collapsed: state.collapsed,
    lastChannel: state.lastChannel,
    lastDm: state.lastDm,
  };
}

function persist(get: () => OrbitStore) {
  const state = get();
  if (!state.hydrated || !state.cacheOwnerId || typeof localStorage === "undefined") return;
  localStorage.setItem(`${STORAGE_KEY}:${state.cacheOwnerId}`, JSON.stringify(snapshot(state)));
}

const messageWriteQueues = new Map<string, Promise<void>>();

function queueMessageWrite(messageId: string, write: () => Promise<void>) {
  // OWASP A04:2025 Insecure Design. Serialize mutations to one message.
  // This prevents a fast restore from reaching the server before its delete.
  const pending = messageWriteQueues.get(messageId) ?? Promise.resolve();
  const next = pending.catch(() => undefined).then(write);
  messageWriteQueues.set(messageId, next);
  void next.finally(() => {
    if (messageWriteQueues.get(messageId) === next) messageWriteQueues.delete(messageId);
  }).catch(() => undefined);
  return next;
}

export function readUserCache(userId: string): Partial<LocalOrbitCache> | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${userId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LocalOrbitCache>;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export const useOrbit = create<OrbitStore>((set, get) => ({
  ...EMPTY_PERSISTED(),
  hydrated: false,
  cacheOwnerId: null,
  highlightId: null,
  searchOpen: false,
  searchScopeId: null,
  searchReturn: null,
  threadReturn: null,
  recentIds: [],
  menu: null,
  navOpen: false,
  channelDialog: false,
  workspaceDialog: false,
  statusDialog: false,
  prefsDialog: false,
  call: null,
  callSwitch: null,
  liveMessage: "",

  announce: (message) => set({ liveMessage: message }),

  clearAccountState: () => {
    stopCallTracks();
    set({ ...EMPTY_PERSISTED(), hydrated: false, cacheOwnerId: null, call: null, callSwitch: null, liveMessage: "" });
  },

  hydrate: () => {
    if (get().hydrated) return;
    // OWASP A01:2025 Broken Access Control. Ignore legacy unscoped storage before identity verification.
    // This prevents another account's cached transcript or draft from entering the current view.
    if (typeof localStorage !== "undefined") localStorage.removeItem(STORAGE_KEY);
    const next = EMPTY_PERSISTED();
    set({ ...next, hydrated: true });
    if (typeof location !== "undefined" && location.hash.length > 1) {
      const [conversationId, messageId] = location.hash.slice(1).split("/");
      const conversations = conversationsOf(next.extraConversations);
      const conversation = conversationId ? conversationById(conversations, conversationId) : null;
      if (conversation) {
        get().openConversation(conversation.id, { keepThread: Boolean(messageId) });
        if (messageId) get().focusMessage(messageId);
      }
    }
  },

  setWorkspace: (id) => {
    const state = get();
    const conversations = conversationsOf(state.extraConversations).filter((item) => item.workspaceId === id);
    const channel = conversations.find((item) => item.kind === "channel" && item.id === state.lastChannel[id]);
    const fallback = conversations.find((item) => item.kind === "channel") ?? conversations[0];
    const nextId = channel?.id ?? fallback?.id ?? "";
    set({
      workspaceId: id,
      conversationId: nextId,
      threadParentId: null,
      view: "conversation",
      navOpen: false,
    });
    if (nextId) get().openConversation(nextId);
    else persist(get);
  },

  openConversation: (id, options) => {
    const state = get();
    const conversation = conversationById(conversationsOf(state.extraConversations), id);
    if (!conversation) return;
    const same = state.conversationId === id;
    const readAt = new Date().toISOString();
    const recentIds = [id, ...state.recentIds.filter((item) => item !== id)].slice(0, 8);
    set({
      workspaceId: conversation.workspaceId,
      conversationId: id,
      view: "conversation",
      navOpen: false,
      menu: null,
      searchOpen: false,
      searchScopeId: null,
      recentIds,
      threadParentId: same || options?.keepThread ? state.threadParentId : null,
      lastRead: { ...state.lastRead, [id]: readAt },
      lastChannel:
        conversation.kind === "channel"
          ? { ...state.lastChannel, [conversation.workspaceId]: id }
          : state.lastChannel,
      lastDm:
        conversation.kind === "dm" ? { ...state.lastDm, [conversation.workspaceId]: id } : state.lastDm,
    });
    persist(get);
    void setReadState(id, readAt).catch(() => set({ liveMessage: "Could not save where you left off in this conversation." }));
    const call = get().call;
    if (call?.phase === "active" && call.conversationId !== id) {
      set({ call: { ...call, surface: "minimized" } });
    }
  },

  setView: (view) => {
    set({ view, navOpen: false });
    persist(get);
  },

  toggleSection: (key) => {
    const collapsed = { ...get().collapsed, [key]: !get().collapsed[key] };
    set({ collapsed });
    if (typeof sessionStorage !== "undefined") sessionStorage.setItem("orbit:collapsed", JSON.stringify(collapsed));
  },

  setDraft: (key, value) => {
    set({ drafts: { ...get().drafts, [key]: value } });
    persist(get);
  },

  setDraftAttachments: (key, files) => {
    const draftAttachments = { ...get().draftAttachments };
    if (files.length === 0) delete draftAttachments[key];
    else draftAttachments[key] = files;
    set({ draftAttachments });
    persist(get);
  },

  sendMessage: ({ conversationId, body, parentId, attachments, draftKey }) => {
    const trimmed = body.trim();
    const files = attachments?.filter((file) => file.name) ?? [];
    if (!trimmed && files.length === 0) return;
    const file = files[0] ? localFile(files[0].id) : undefined;
    if (files.length && !file) {
      set({ liveMessage: "This file is no longer available. Attach it again." });
      return;
    }
    const message: Message = {
      id: `m-${crypto.randomUUID()}`,
      conversationId,
      authorId: YOU,
      body: trimmed,
      createdAt: new Date().toISOString(),
      parentId,
      reactions: [],
      attachments: files,
    };
    const drafts = { ...get().drafts };
    delete drafts[draftKey];
    const draftAttachments = { ...get().draftAttachments };
    delete draftAttachments[draftKey];
    set({
      createdMessages: [...get().createdMessages, message],
      drafts,
      draftAttachments,
      lastRead: { ...get().lastRead, [conversationId]: message.createdAt },
      liveMessage: parentId ? "Reply sent" : "Message sent",
    });
    persist(get);
    {
      void createMessage({ conversationId, body: trimmed, parentId, file: file ?? undefined })
        .then((serverMessage) => {
          if (files[0]) forgetFile(files[0].id);
          set({
            createdMessages: get().createdMessages.map((item) =>
              item.id === message.id
                ? { ...item, ...serverMessage, authorId: YOU, id: serverMessage.id }
                : item,
            ),
          });
          persist(get);
        })
        .catch(() => {
          const current = get();
          set({
            createdMessages: current.createdMessages.filter((item) => item.id !== message.id),
            drafts: { ...current.drafts, [draftKey]: current.drafts[draftKey] || body },
            draftAttachments: files.length ? { ...current.draftAttachments, [draftKey]: files } : current.draftAttachments,
            liveMessage: "Could not send the message. Try again.",
          });
          persist(get);
        });
    }
  },

  toggleReaction: (messageId, emoji) => {
    const state = get();
    const message = assembleMessages(state).find((item) => item.id === messageId);
    if (!message) return;
    const reactions = message.reactions.map((reaction) => ({ ...reaction, userIds: [...reaction.userIds] }));
    const existing = reactions.find((reaction) => reaction.emoji === emoji);
    const hadReaction = Boolean(existing?.userIds.includes(YOU));
    if (existing) {
      existing.userIds = existing.userIds.includes(YOU)
        ? existing.userIds.filter((id) => id !== YOU)
        : [...existing.userIds, YOU];
    } else {
      reactions.push({ emoji, userIds: [YOU] });
    }
    set({
      reactionOverrides: {
        ...state.reactionOverrides,
        [messageId]: reactions.filter((reaction) => reaction.userIds.length > 0),
      },
    });
    persist(get);
    void (hadReaction ? removeReaction(messageId, emoji) : addReaction(messageId, emoji)).catch(() => {
      set({ reactionOverrides: { ...get().reactionOverrides, [messageId]: message.reactions }, liveMessage: "Could not save your reaction. Try again." });
      persist(get);
    });
  },

  toggleSaved: (messageId) => {
    const state = get();
    if (state.deletedIds.includes(messageId)) return;
    const saved = state.savedIds.includes(messageId);
    const savedAt = { ...state.savedAt };
    if (saved) delete savedAt[messageId];
    else savedAt[messageId] = new Date().toISOString();
    set({
      savedIds: saved ? state.savedIds.filter((id) => id !== messageId) : [messageId, ...state.savedIds],
      savedAt,
      liveMessage: saved ? "Removed from Later" : "Saved for later",
    });
    persist(get);
    void (saved ? unsaveMessage(messageId) : saveMessage(messageId)).catch(() => {
      set({ savedIds: state.savedIds, savedAt: state.savedAt, liveMessage: `Could not ${saved ? "remove this message from" : "save this message to"} Later. Try again.` });
      persist(get);
    });
  },

  editMessage: (messageId, body) => {
    const trimmed = body.trim();
    if (!trimmed) return;
    const previous = get().edited[messageId];
    set({
      edited: {
        ...get().edited,
        [messageId]: { body: trimmed, editedAt: new Date().toISOString() },
      },
    });
    persist(get);
    void updateMessage(messageId, trimmed).catch(() => {
      const edited = { ...get().edited };
      if (previous) edited[messageId] = previous;
      else delete edited[messageId];
      set({ edited, liveMessage: "Could not save the message changes. Try again." });
      persist(get);
    });
  },

  deleteMessage: (messageId) => {
    if (get().deletedIds.includes(messageId)) return;
    const previous = get();
    const savedAt = { ...get().savedAt };
    delete savedAt[messageId];
    set({
      deletedIds: [...get().deletedIds, messageId],
      savedIds: get().savedIds.filter((id) => id !== messageId),
      savedAt,
      liveMessage: "Message deleted",
    });
    persist(get);
    const ownerId = get().cacheOwnerId;
    void queueMessageWrite(messageId, () => deleteServerMessage(messageId)).catch(() => {
      if (get().cacheOwnerId !== ownerId) return;
      set({ deletedIds: previous.deletedIds, savedIds: previous.savedIds, savedAt: previous.savedAt, liveMessage: "Could not delete the message. Try again." });
      persist(get);
    });
  },

  undoDelete: (messageId) => {
    const message = get().createdMessages.find((item) => item.id === messageId);
    const previous = get().deletedIds;
    const ownerId = get().cacheOwnerId;
    set({ deletedIds: get().deletedIds.filter((id) => id !== messageId) });
    persist(get);
    if (message) void queueMessageWrite(messageId, () => updateMessage(messageId, message.body, undefined, true).then(() => undefined)).catch(() => {
      if (get().cacheOwnerId !== ownerId) return;
      set({ deletedIds: previous, liveMessage: "Could not restore the message. Try again." });
      persist(get);
    });
  },

  openThread: (parentId) => {
    const threadReturn = document.activeElement instanceof HTMLElement ? document.activeElement : get().threadReturn;
    set({ threadParentId: parentId, view: "conversation", threadReturn });
    persist(get);
  },

  closeThread: () => {
    const threadReturn = get().threadReturn;
    set({ threadParentId: null, threadReturn: null });
    persist(get);
    window.setTimeout(() => {
      if (threadReturn && document.contains(threadReturn)) threadReturn.focus();
      else document.getElementById("composer")?.focus();
    }, 0);
  },

  highlight: (messageId) => {
    set({ highlightId: messageId });
    window.setTimeout(() => {
      if (get().highlightId === messageId) set({ highlightId: null });
    }, 2000);
  },

  focusMessage: (messageId) => {
    const state = get();
    const message = assembleMessages(state).find((item) => item.id === messageId);
    if (!message) return;
    const conversation = conversationById(conversationsOf(state.extraConversations), message.conversationId);
    if (!conversation) return;
    const recentIds = [conversation.id, ...state.recentIds.filter((item) => item !== conversation.id)].slice(0, 8);
    set({
      workspaceId: conversation.workspaceId,
      conversationId: conversation.id,
      view: "conversation",
      navOpen: false,
      recentIds,
      threadParentId: message.parentId ?? null,
      lastRead: { ...state.lastRead, [conversation.id]: new Date().toISOString() },
      lastChannel:
        conversation.kind === "channel"
          ? { ...state.lastChannel, [conversation.workspaceId]: conversation.id }
          : state.lastChannel,
      lastDm:
        conversation.kind === "dm"
          ? { ...state.lastDm, [conversation.workspaceId]: conversation.id }
          : state.lastDm,
      highlightId: message.id,
    });
    persist(get);
    window.setTimeout(() => {
      if (get().highlightId === message.id) set({ highlightId: null });
    }, 2000);
  },

  openActivity: (messageId) => {
    const state = get();
    if (state.deletedIds.includes(messageId)) return;
    const message = assembleMessages(state).find((item) => item.id === messageId);
    if (!message) return;
    if (!state.activityReadIds.includes(messageId)) {
      set({ activityReadIds: [...state.activityReadIds, messageId] });
      persist(get);
    }
    get().focusMessage(messageId);
  },

  markActivityRead: () => {
    const ids = activityItems(assembleMessages(get())).map((item) => item.id);
    set({ activityReadIds: [...new Set([...get().activityReadIds, ...ids])], liveMessage: "Activity marked read" });
    persist(get);
  },

  openDirectMessage: async (userId) => {
    if (userId === YOU) return;
    const state = get();
    const conversations = conversationsOf(state.extraConversations);
    const existing = conversations.find(
      (conversation) =>
        conversation.workspaceId === state.workspaceId &&
        conversation.kind === "dm" &&
        conversation.participantIds.length === 2 &&
        conversation.participantIds.includes(YOU) &&
        conversation.participantIds.includes(userId),
    );
    if (existing) {
      get().openConversation(existing.id);
      return;
    }

    let createdId: string;
    try {
      const created = await createServerConversation({
        workspaceId: state.workspaceId,
        kind: "dm",
        participantIds: [userId],
      });
      createdId = created.id;
    } catch (cause) {
      set({ liveMessage: cause instanceof OrbitApiError ? cause.problem.detail : "Could not open the direct message. Try again." });
      return;
    }
    const conversation: Conversation = { kind: "dm", id: createdId, workspaceId: state.workspaceId, participantIds: [YOU, userId] };
    set({ extraConversations: [...get().extraConversations, conversation] });
    persist(get);
    get().openConversation(conversation.id);
  },

  openSearch: (scopeId = null) => {
    const current = get();
    const searchReturn = current.searchOpen
      ? current.searchReturn
      : document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    set({ searchOpen: true, searchScopeId: scopeId, menu: null, searchReturn });
  },

  setSearchOpen: (searchOpen) => {
    const searchReturn = get().searchReturn;
    set({
      searchOpen,
      searchScopeId: searchOpen ? get().searchScopeId : null,
      searchReturn: searchOpen ? searchReturn : null,
    });
    if (!searchOpen && searchReturn && document.contains(searchReturn)) {
      window.setTimeout(() => searchReturn.focus(), 0);
    }
  },

  setMenu: (menu) => set({ menu }),
  setNavOpen: (navOpen) => set({ navOpen }),
  setChannelDialog: (channelDialog) => set({ channelDialog }),
  setWorkspaceDialog: (workspaceDialog) => set({ workspaceDialog }),
  setStatusDialog: (statusDialog) => set({ statusDialog }),
  setPrefsDialog: (prefsDialog) => set({ prefsDialog }),

  setPresence: (presence) => {
    const previous = get().presence;
    set({ presence });
    persist(get);
    void updateProfile({ presence }).catch(() => { set({ presence: previous, liveMessage: "Could not update your availability. Try again." }); persist(get); });
  },

  setStatus: (status) => {
    const next = status.trim();
    const previous = get().status;
    set({ status: next });
    persist(get);
    void updateProfile({ status: next }).catch(() => { set({ status: previous, liveMessage: "Could not save status." }); persist(get); });
  },

  setAlwaysShowTime: (alwaysShowTime) => {
    const previous = get().alwaysShowTime;
    set({ alwaysShowTime });
    persist(get);
    void updatePreferences({ alwaysShowTime }).catch(() => { set({ alwaysShowTime: previous, liveMessage: "Could not save the message time setting. Try again." }); persist(get); });
  },

  createWorkspace: async (name) => {
    const state = get();
    const error = workspaceNameError(
      name,
      workspacesOf(state.extraWorkspaces).map((workspace) => workspace.name),
    );
    if (error) return error;
    const trimmed = name.trim();
    let workspace: Workspace;
    let channelId: string;
    try {
      const created = await createServerWorkspace(trimmed);
      const conversations = await listConversations(created.id);
      const general = conversations.data.find((item) => item.kind === "channel" && item.name === "general");
      if (!general) return "The workspace has no general channel.";
      workspace = { id: created.id, name: created.name, initials: created.initials };
      channelId = general.id;
    } catch (cause) {
      return cause instanceof OrbitApiError ? cause.problem.detail : "Could not create the workspace. Try again.";
    }
    const channel: Conversation = {
      kind: "channel",
      id: channelId,
      workspaceId: workspace.id,
      name: "general",
      description: `Home for ${trimmed}.`,
      memberIds: [YOU],
    };
    set({
      extraWorkspaces: [...get().extraWorkspaces, workspace],
      extraConversations: [...get().extraConversations, channel],
      workspaceDialog: false,
    });
    get().setWorkspace(workspace.id);
    return null;
  },

  createChannel: async (name, description) => {
    const slug = slugify(name);
    if (!slug) return "Use letters or numbers in the channel name.";
    const state = get();
    const existing = conversationsOf(state.extraConversations).some(
      (item) => item.workspaceId === state.workspaceId && item.kind === "channel" && item.name === slug,
    );
    if (existing) return "A channel with this name already exists in this workspace.";
    let createdId: string;
    try {
      const created = await createServerConversation({
        workspaceId: state.workspaceId,
        kind: "channel",
        name: slug,
        description: description.trim() || "New channel",
      });
      createdId = created.id;
    } catch (cause) {
      return cause instanceof OrbitApiError ? cause.problem.detail : "Could not create the channel. Try again.";
    }
    const channel: Conversation = {
      kind: "channel",
      id: createdId,
      workspaceId: state.workspaceId,
      name: slug,
      description: description.trim() || "New channel",
      memberIds: [YOU],
    };
    set({
      extraConversations: [...get().extraConversations, channel],
      channelDialog: false,
    });
    get().openConversation(channel.id);
    return null;
  },

  goHome: () => {
    const state = get();
    const conversations = conversationsOf(state.extraConversations);
    const home = conversations.find((item) => item.workspaceId === state.workspaceId && item.kind === "channel" && item.name === "general");
    if (home) get().openConversation(home.id);
  },

  goDms: () => {
    const state = get();
    const conversations = conversationsOf(state.extraConversations).filter(
      (item) => item.workspaceId === state.workspaceId && item.kind === "dm",
    );
    const preferred = conversations.find((item) => item.id === state.lastDm[state.workspaceId]);
    const next = preferred ?? conversations[0];
    if (next) get().openConversation(next.id);
    else {
      set({ view: "conversation", conversationId: "", threadParentId: null, navOpen: false });
      persist(get);
    }
  },

  resetLocalView: () => {
    set({
      threadParentId: null,
      view: "conversation",
      drafts: {},
      draftAttachments: {},
      collapsed: { channels: false, dms: false },
      lastChannel: {},
      lastDm: {},
      highlightId: null,
      searchOpen: false,
      searchScopeId: null,
      searchReturn: null,
      threadReturn: null,
      recentIds: [],
      menu: null,
      navOpen: false,
      channelDialog: false,
      workspaceDialog: false,
      statusDialog: false,
      prefsDialog: false,
      callSwitch: null,
    });
    persist(get);
  },

requestCall: async (conversationId, kind) => {
    const state = get();
    const conversation = conversationById(conversationsOf(state.extraConversations), conversationId);
    if (!conversation || conversation.kind !== "dm") return;
    if (memberIds(conversation).length > 8) {
      set({ liveMessage: "Calls are limited to 8 people in this demo." });
      return;
    }
    if (state.call && !(state.call.conversationId === conversationId && state.call.kind === kind)) {
      set({ callSwitch: { conversationId, kind } });
      return;
    }
    if (state.call) {
      set({ call: { ...state.call, surface: "open" }, callSwitch: null });
      return;
    }
    stopCallTracks();
    let serverCall;
    try {
      serverCall = await createCall(conversationId, kind);
    } catch {
      set({ liveMessage: "Could not start the call. Try again." });
      return;
    }
    set({
      callSwitch: null,
      call: {
        id: serverCall.id,
        conversationId,
        kind,
        phase: "lobby",
        startedAt: null,
        surface: "open",
        mic: "idle",
        camera: "idle",
        micDetail: null,
        cameraDetail: null,
      },
    });
  },

  cancelLobby: async () => {
    const call = get().call;
    if (!call || call.phase !== "lobby") return;
    try {
      await updateCall(call.id, "ended");
    } catch {
      set({ liveMessage: "Could not cancel the call. Try again." });
      return;
    }
    stopCallTracks();
    set({ call: null });
  },

  enablePreview: async () => {
    const call = get().call;
    if (!call || call.kind !== "video" || call.phase !== "lobby") return;
    set({ call: { ...call, camera: "requesting", cameraDetail: null } });
    try {
      await captureMedia(false, true);
      const current = get().call;
      if (!current || current.id !== call.id) return;
      set({ call: { ...current, camera: "live", cameraDetail: null } });
    } catch (error) {
      const current = get().call;
      if (!current || current.id !== call.id) return;
      const missing = error instanceof DOMException && (error.name === "NotFoundError" || error.name === "DevicesNotFoundError");
      set({
        call: {
          ...current,
          camera: missing ? "unavailable" : "denied",
          cameraDetail: explainMediaError(error, "camera"),
        },
      });
    }
  },

  joinDemoCall: async (options) => {
    const call = get().call;
    if (!call || call.phase !== "lobby") return;
    const wantMic = !options?.withoutMic;
    const wantCamera = call.kind === "video" && !options?.withoutCamera;
    set({
      call: {
        ...call,
        mic: wantMic ? "requesting" : "muted",
        camera: wantCamera ? "requesting" : call.camera === "live" ? "live" : "muted",
        micDetail: null,
      },
    });
    try {
      if (wantMic || (wantCamera && call.camera !== "live")) {
        await captureMedia(wantMic, wantCamera && call.camera !== "live");
      }
      const current = get().call;
      if (!current || current.id !== call.id) return;
      await updateCall(call.id, "active");
      const startedAt = Date.now();
      set({
        call: {
          ...current,
          phase: "active",
          startedAt,
          surface: "open",
          mic: wantMic ? "live" : "muted",
          camera: wantCamera || current.camera === "live" ? "live" : "muted",
          micDetail: null,
          cameraDetail: null,
        },
      });
      sessionStorage.setItem(
        "orbit:live-call",
        JSON.stringify({ id: current.id, conversationId: current.conversationId, kind: current.kind, startedAt }),
      );
    } catch (error) {
      const current = get().call;
      if (!current || current.id !== call.id) return;
      const missing = error instanceof DOMException && (error.name === "NotFoundError" || error.name === "DevicesNotFoundError");
      set({
        call: {
          ...current,
          phase: "lobby",
          mic: wantMic ? (missing ? "unavailable" : "denied") : "muted",
          camera: wantCamera ? (missing ? "unavailable" : "denied") : current.camera,
          micDetail: wantMic ? explainMediaError(error, "microphone") : null,
          cameraDetail: wantCamera ? explainMediaError(error, "camera") : current.cameraDetail,
        },
      });
    }
  },

  retryDevice: async (device) => {
    const call = get().call;
    if (!call) return;
    if (device === "mic") {
      set({ call: { ...call, mic: "requesting", micDetail: null } });
      try {
        await captureMedia(true, false);
        const current = get().call;
        if (!current) return;
        set({ call: { ...current, mic: "live", micDetail: null } });
      } catch (error) {
        const current = get().call;
        if (!current) return;
        const missing = error instanceof DOMException && (error.name === "NotFoundError" || error.name === "DevicesNotFoundError");
        set({ call: { ...current, mic: missing ? "unavailable" : "denied", micDetail: explainMediaError(error, "microphone") } });
      }
      return;
    }
    set({ call: { ...call, camera: "requesting", cameraDetail: null } });
    try {
      await captureMedia(false, true);
      const current = get().call;
      if (!current) return;
      set({ call: { ...current, camera: "live", cameraDetail: null } });
    } catch (error) {
      const current = get().call;
      if (!current) return;
      const missing = error instanceof DOMException && (error.name === "NotFoundError" || error.name === "DevicesNotFoundError");
      set({ call: { ...current, camera: missing ? "unavailable" : "denied", cameraDetail: explainMediaError(error, "camera") } });
    }
  },

  toggleMute: async () => {
    const call = get().call;
    if (!call || call.phase !== "active") return;
    if (call.mic === "live") {
      setTrackEnabled("audio", false);
      set({ call: { ...call, mic: "muted" } });
      return;
    }
    if (call.mic === "muted") {
      if (localTracks().audio) {
        setTrackEnabled("audio", true);
        set({ call: { ...get().call!, mic: "live", micDetail: null } });
        return;
      }
      await get().retryDevice("mic");
    }
  },

  toggleCamera: async () => {
    const call = get().call;
    if (!call || call.phase !== "active" || call.kind !== "video") return;
    if (call.camera === "live") {
      setTrackEnabled("video", false);
      set({ call: { ...call, camera: "muted" } });
      return;
    }
    if (localTracks().video) {
      setTrackEnabled("video", true);
      set({ call: { ...get().call!, camera: "live", cameraDetail: null } });
      return;
    }
    await get().retryDevice("camera");
  },

  endCall: async () => {
    const call = get().call;
    if (!call) return;
    try {
      await updateCall(call.id, "ended");
    } catch {
      set({ liveMessage: "Could not end the call. Try again." });
      return;
    }
    stopCallTracks();
    sessionStorage.removeItem("orbit:live-call");
    if (call.phase === "active" && call.startedAt != null) recordCall(set, get, call);
    set({ call: null, callSwitch: null });
  },

  minimizeCall: () => {
    const call = get().call;
    if (!call || call.phase !== "active") return;
    set({ call: { ...call, surface: "minimized" } });
  },

  returnToCall: () => {
    const call = get().call;
    if (!call) {
      set({ callSwitch: null });
      return;
    }
    set({ call: { ...call, surface: "open" }, callSwitch: null });
    get().openConversation(call.conversationId);
  },

  confirmCallSwitch: async () => {
    const next = get().callSwitch;
    if (!next) return;
    await get().endCall();
    if (get().call) return;
    await get().requestCall(next.conversationId, next.kind);
  },

  dismissCallSwitch: () => set({ callSwitch: null }),
}));

const LIVE_CALL_KEY = "orbit:live-call";

export async function recoverInterruptedCall() {
  if (typeof sessionStorage === "undefined") return;
  const raw = sessionStorage.getItem(LIVE_CALL_KEY);
  if (!raw) return;
  try {
    const saved = JSON.parse(raw) as { id: string; conversationId: string; kind: CallKind; startedAt: number };
    if (!saved.id || !saved.conversationId || !saved.startedAt) {
      sessionStorage.removeItem(LIVE_CALL_KEY);
      return;
    }
    // OWASP A04:2025 Insecure Design. Retry a cancelled pagehide write before clearing recovery state.
    // This prevents a locally ended call from remaining active in server history.
    await updateCall(saved.id, "ended");
    sessionStorage.removeItem(LIVE_CALL_KEY);
    const state = useOrbit.getState();
    if (state.createdMessages.some((message) => message.id === `history-${saved.id}`)) return;
    const endedAt = Date.now();
    recordCall(
      (partial) => useOrbit.setState(partial),
      useOrbit.getState,
      {
        id: saved.id,
        conversationId: saved.conversationId,
        kind: saved.kind,
        phase: "active",
        startedAt: saved.startedAt,
        surface: "open",
        mic: "idle",
        camera: "idle",
        micDetail: null,
        cameraDetail: null,
      },
      endedAt,
    );
  } catch (error) {
    if (error instanceof OrbitApiError && error.problem.status === 404) sessionStorage.removeItem(LIVE_CALL_KEY);
  }
}

function recordCall(
  set: (partial: Partial<OrbitStore>) => void,
  get: () => OrbitStore,
  call: DemoCall,
  endedAtMs = Date.now(),
) {
  if (call.startedAt == null) return;
  const historyId = `history-${call.id}`;
  if (get().createdMessages.some((message) => message.id === historyId)) return;
  const durationSec = Math.max(0, Math.floor((endedAtMs - call.startedAt) / 1000));
  const startedAt = new Date(call.startedAt).toISOString();
  const endedAt = new Date(endedAtMs).toISOString();
  const item: CallHistoryItem = {
    id: historyId,
    conversationId: call.conversationId,
    kind: call.kind,
    initiatorId: YOU,
    startedAt,
    endedAt,
    durationSec,
  };
  const label = `${Math.floor(durationSec / 60)}:${String(durationSec % 60).padStart(2, "0")}`;
  const noun = call.kind === "video" ? "Video call" : "Voice call";
  const message: Message = {
    id: historyId,
    conversationId: call.conversationId,
    authorId: "system",
    body: `${noun} ended · ${label}`,
    createdAt: endedAt,
    reactions: [],
    system: true,
  };
  set({
    createdMessages: [...get().createdMessages, message],
    callHistory: [...get().callHistory, item],
  });
  persist(get);
}
