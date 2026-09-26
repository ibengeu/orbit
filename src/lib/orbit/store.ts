import { create } from "zustand";
import { assembleMessages, conversationById, conversationsOf, initialsFor, memberIds, slugify, unreadMeta } from "@/lib/orbit/derive";
import { INITIAL_LAST_READ, STORAGE_KEY, YOU } from "@/lib/orbit/seed";
import type { Attachment, Conversation, Message, PersistedOrbit, Presence, SimCall, View, Workspace } from "@/lib/orbit/types";

type OrbitStore = PersistedOrbit & {
  hydrated: boolean;
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
  createWorkspace: (name: string) => string | null;
  createChannel: (name: string, description: string) => string | null;
  goHome: () => void;
  goDms: () => void;
  resetDemo: () => void;
  call: SimCall | null;
  callNotice: string | null;
  startCall: (conversationId: string) => void;
  cancelRing: () => void;
  acceptCall: () => void;
  missCall: () => void;
  setDeclineOnTimeout: (value: boolean) => void;
  toggleSelfMute: () => void;
  toggleSelfVideo: () => void;
  leaveCall: () => void;
  endCallForAll: () => void;
  joinCall: () => void;
  simulateJoins: () => void;
  simulateLeave: () => void;
};

const EMPTY_PERSISTED = (): PersistedOrbit => ({
  workspaceId: "orbit",
  conversationId: "general",
  threadParentId: null,
  view: "conversation",
  drafts: {},
  draftAttachments: {},
  savedIds: [],
  collapsed: { channels: false, dms: false },
  lastRead: { ...INITIAL_LAST_READ },
  lastChannel: { orbit: "general", lumen: "lumen-general" },
  lastDm: { orbit: "dm-priya" },
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

function snapshot(state: OrbitStore): PersistedOrbit {
  return {
    workspaceId: state.workspaceId,
    conversationId: state.conversationId,
    threadParentId: state.threadParentId,
    view: state.view,
    drafts: state.drafts,
    draftAttachments: state.draftAttachments,
    savedIds: state.savedIds,
    collapsed: state.collapsed,
    lastRead: state.lastRead,
    lastChannel: state.lastChannel,
    lastDm: state.lastDm,
    createdMessages: state.createdMessages,
    edited: state.edited,
    deletedIds: state.deletedIds,
    reactionOverrides: state.reactionOverrides,
    presence: state.presence,
    status: state.status,
    alwaysShowTime: state.alwaysShowTime,
    extraWorkspaces: state.extraWorkspaces,
    extraConversations: state.extraConversations,
  };
}

function persist(get: () => OrbitStore) {
  if (!get().hydrated || typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot(get())));
}

function readPersisted(): Partial<PersistedOrbit> | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedOrbit>;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export const useOrbit = create<OrbitStore>((set, get) => ({
  ...EMPTY_PERSISTED(),
  hydrated: false,
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
  callNotice: null,

  hydrate: () => {
    if (get().hydrated) return;
    const base = EMPTY_PERSISTED();
    const saved = readPersisted();
    const next: PersistedOrbit = saved
      ? {
          ...base,
          ...saved,
          drafts: saved.drafts ?? base.drafts,
          draftAttachments: saved.draftAttachments ?? base.draftAttachments,
          savedIds: saved.savedIds ?? base.savedIds,
          collapsed: { ...base.collapsed, ...saved.collapsed },
          lastRead: { ...base.lastRead, ...saved.lastRead },
          lastChannel: { ...base.lastChannel, ...saved.lastChannel },
          lastDm: { ...base.lastDm, ...saved.lastDm },
          createdMessages: saved.createdMessages ?? [],
          edited: saved.edited ?? {},
          deletedIds: saved.deletedIds ?? [],
          reactionOverrides: saved.reactionOverrides ?? {},
          extraWorkspaces: saved.extraWorkspaces ?? [],
          extraConversations: saved.extraConversations ?? [],
          presence: saved.presence ?? base.presence,
          status: saved.status ?? base.status,
          alwaysShowTime: saved.alwaysShowTime ?? false,
          view: saved.view ?? "conversation",
          threadParentId: saved.threadParentId ?? null,
          workspaceId: saved.workspaceId ?? base.workspaceId,
          conversationId: saved.conversationId ?? base.conversationId,
        }
      : base;
    if (next.workspaceId !== "orbit") {
      next.workspaceId = "orbit";
      next.conversationId = next.lastChannel.orbit || "general";
      next.threadParentId = null;
    }
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
    const recentIds = [id, ...state.recentIds.filter((item) => item !== id)].slice(0, 8);
    set({
      workspaceId: conversation.workspaceId,
      conversationId: id,
      view: "conversation",
      navOpen: false,
      recentIds,
      threadParentId: same || options?.keepThread ? state.threadParentId : null,
      lastRead: { ...state.lastRead, [id]: new Date().toISOString() },
      lastChannel:
        conversation.kind === "channel"
          ? { ...state.lastChannel, [conversation.workspaceId]: id }
          : state.lastChannel,
      lastDm:
        conversation.kind === "dm" ? { ...state.lastDm, [conversation.workspaceId]: id } : state.lastDm,
    });
    persist(get);
  },

  setView: (view) => {
    set({ view, navOpen: false });
    persist(get);
  },

  toggleSection: (key) => {
    const collapsed = { ...get().collapsed, [key]: !get().collapsed[key] };
    set({ collapsed });
    persist(get);
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
    const message: Message = {
      id: `m-${crypto.randomUUID()}`,
      conversationId,
      authorId: YOU,
      body: trimmed,
      createdAt: new Date().toISOString(),
      parentId,
      reactions: [],
      attachments: files.length ? files : undefined,
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
    });
    persist(get);
  },

  toggleReaction: (messageId, emoji) => {
    const state = get();
    const message = assembleMessages(state).find((item) => item.id === messageId);
    if (!message) return;
    const reactions = message.reactions.map((reaction) => ({ ...reaction, userIds: [...reaction.userIds] }));
    const existing = reactions.find((reaction) => reaction.emoji === emoji);
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
  },

  toggleSaved: (messageId) => {
    const ids = get().savedIds;
    const next = ids.includes(messageId) ? ids.filter((id) => id !== messageId) : [messageId, ...ids];
    set({ savedIds: next });
    persist(get);
  },

  editMessage: (messageId, body) => {
    const trimmed = body.trim();
    if (!trimmed) return;
    set({
      edited: {
        ...get().edited,
        [messageId]: { body: trimmed, editedAt: new Date().toISOString() },
      },
    });
    persist(get);
  },

  deleteMessage: (messageId) => {
    if (get().deletedIds.includes(messageId)) return;
    set({ deletedIds: [...get().deletedIds, messageId] });
    persist(get);
  },

  undoDelete: (messageId) => {
    set({ deletedIds: get().deletedIds.filter((id) => id !== messageId) });
    persist(get);
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
    }, 2400);
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
    }, 2400);
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
    set({ presence });
    persist(get);
  },

  setStatus: (status) => {
    set({ status: status.trim() });
    persist(get);
  },

  setAlwaysShowTime: (alwaysShowTime) => {
    set({ alwaysShowTime });
    persist(get);
  },

  createWorkspace: (name) => {
    const trimmed = name.trim();
    if (!trimmed) return "Name the workspace first.";
    const state = get();
    const id = `ws-${slugify(trimmed) || "team"}-${Math.random().toString(36).slice(2, 6)}`;
    const workspace: Workspace = { id, name: trimmed, initials: initialsFor(trimmed) };
    const channelId = `${id}-general`;
    const channel: Conversation = {
      kind: "channel",
      id: channelId,
      workspaceId: id,
      name: "general",
      description: `Home for ${trimmed}.`,
      memberIds: [YOU],
    };
    set({
      extraWorkspaces: [...state.extraWorkspaces, workspace],
      extraConversations: [...state.extraConversations, channel],
      workspaceDialog: false,
    });
    get().setWorkspace(id);
    return null;
  },

  createChannel: (name, description) => {
    const slug = slugify(name);
    if (!slug) return "Use letters or numbers in the channel name.";
    const state = get();
    const existing = conversationsOf(state.extraConversations).some(
      (item) => item.workspaceId === state.workspaceId && item.kind === "channel" && item.name === slug,
    );
    if (existing) return "That channel already exists here.";
    const channel: Conversation = {
      kind: "channel",
      id: `${state.workspaceId}-${slug}-${Math.random().toString(36).slice(2, 6)}`,
      workspaceId: state.workspaceId,
      name: slug,
      description: description.trim() || "New channel",
      memberIds: [YOU],
    };
    set({
      extraConversations: [...state.extraConversations, channel],
      channelDialog: false,
    });
    get().openConversation(channel.id);
    return null;
  },

  goHome: () => {
    const state = get();
    const messages = assembleMessages(state);
    const channels = conversationsOf(state.extraConversations).filter(
      (item) => item.workspaceId === "orbit" && item.kind === "channel",
    );
    const unread = channels.find((item) => unreadMeta(messages, item.id, state.lastRead[item.id]).unread > 0);
    const next = unread ?? channels[0];
    if (next) get().openConversation(next.id);
    else set({ view: "conversation", workspaceId: "orbit", navOpen: false });
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

  resetDemo: () => {
    if (typeof localStorage !== "undefined") localStorage.removeItem(STORAGE_KEY);
    set({
      ...EMPTY_PERSISTED(),
      hydrated: true,
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
      callNotice: null,
    });
  },

  startCall: (conversationId) => {
    const state = get();
    if (state.call) {
      flashCallNotice(set, get, "You're already in a call");
      return;
    }
    const conversation = conversationById(conversationsOf(state.extraConversations), conversationId);
    if (!conversation) return;
    const others = memberIds(conversation).filter((id) => id !== YOU);
    const mode = conversation.kind === "channel" ? "channel" : others.length > 1 || conversation.title ? "group" : "direct";
    const id = `call-${crypto.randomUUID()}`;
    if (mode === "channel") {
      set({
        call: {
          id,
          conversationId,
          mode,
          phase: "active",
          connectedAt: Date.now(),
          participants: [],
          youJoined: false,
          youStarted: true,
          simulated: false,
          declineOnTimeout: false,
        },
        callNotice: null,
      });
      postCallMessage(set, get, conversationId, "Call started");
      return;
    }
    set({
      call: {
        id,
        conversationId,
        mode,
        phase: "ringing",
        connectedAt: null,
        participants: others.map((userId) => ({ userId, muted: false, video: false })),
        youJoined: true,
        youStarted: true,
        simulated: false,
        declineOnTimeout: false,
      },
      callNotice: null,
    });
  },

  cancelRing: () => {
    const call = get().call;
    if (!call || call.phase !== "ringing") return;
    set({ call: null });
  },

  acceptCall: () => {
    const call = get().call;
    if (!call || call.phase !== "ringing") return;
    const participants = [
      { userId: YOU, muted: false, video: false },
      ...call.participants.filter((person) => person.userId !== YOU),
    ];
    set({
      call: { ...call, phase: "active", connectedAt: Date.now(), participants, youJoined: true },
    });
    postCallMessage(set, get, call.conversationId, "Call started");
  },

  missCall: () => {
    const call = get().call;
    if (!call || call.phase !== "ringing") return;
    set({ call: null });
    postCallMessage(set, get, call.conversationId, "Missed call");
  },

  setDeclineOnTimeout: (declineOnTimeout) => {
    const call = get().call;
    if (!call || call.phase !== "ringing") return;
    set({ call: { ...call, declineOnTimeout } });
  },

  toggleSelfMute: () => patchSelf(set, get, (person) => ({ ...person, muted: !person.muted })),
  toggleSelfVideo: () => patchSelf(set, get, (person) => ({ ...person, video: !person.video })),

  leaveCall: () => {
    const call = get().call;
    if (!call || call.phase !== "active" || !call.youJoined) return;
    const participants = call.participants.filter((person) => person.userId !== YOU);
    if (call.mode === "direct" || participants.length === 0) {
      finishCall(set, get);
      return;
    }
    set({ call: { ...call, participants, youJoined: false } });
  },

  endCallForAll: () => {
    const call = get().call;
    if (!call || call.phase !== "active" || !call.youStarted) return;
    finishCall(set, get);
  },

  joinCall: () => {
    const call = get().call;
    if (!call || call.phase !== "active" || call.youJoined) return;
    set({
      call: {
        ...call,
        youJoined: true,
        participants: [{ userId: YOU, muted: false, video: false }, ...call.participants],
      },
    });
  },

  simulateJoins: () => {
    const state = get();
    const call = state.call;
    if (!call || call.phase !== "active" || call.simulated || call.mode === "direct") return;
    const conversation = conversationById(conversationsOf(state.extraConversations), call.conversationId);
    if (!conversation) return;
    const present = new Set(call.participants.map((person) => person.userId));
    const extras = memberIds(conversation)
      .filter((id) => id !== YOU && !present.has(id))
      .slice(0, 1)
      .map((userId) => ({ userId, muted: false, video: false }));
    if (extras.length === 0) {
      set({ call: { ...call, simulated: true } });
      return;
    }
    set({ call: { ...call, simulated: true, participants: [...call.participants, ...extras] } });
  },

  simulateLeave: () => {
    const call = get().call;
    if (!call || call.phase !== "active") return;
    const other = call.participants.find((person) => person.userId !== YOU);
    if (!other) return;
    const participants = call.participants.filter((person) => person.userId !== other.userId);
    if (participants.length === 0) {
      finishCall(set, get);
      return;
    }
    set({ call: { ...call, participants, youJoined: participants.some((person) => person.userId === YOU) } });
  },
}));

let callNoticeTimer = 0;

function flashCallNotice(set: (partial: Partial<OrbitStore>) => void, get: () => OrbitStore, message: string) {
  window.clearTimeout(callNoticeTimer);
  set({ callNotice: message });
  callNoticeTimer = window.setTimeout(() => {
    if (get().callNotice === message) set({ callNotice: null });
  }, 2500);
}

function postCallMessage(set: (partial: Partial<OrbitStore>) => void, get: () => OrbitStore, conversationId: string, body: string) {
  const message: Message = {
    id: `m-${crypto.randomUUID()}`,
    conversationId,
    authorId: "system",
    body,
    createdAt: new Date().toISOString(),
    reactions: [],
    system: true,
  };
  set({ createdMessages: [...get().createdMessages, message] });
  persist(get);
}

function finishCall(set: (partial: Partial<OrbitStore>) => void, get: () => OrbitStore) {
  const call = get().call;
  if (!call || call.phase !== "active" || call.connectedAt == null) {
    set({ call: null });
    return;
  }
  const elapsed = Date.now() - call.connectedAt;
  const total = Math.max(0, Math.floor(elapsed / 1000));
  const label = `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
  const conversationId = call.conversationId;
  set({ call: null });
  postCallMessage(set, get, conversationId, `Call ended — ${label}`);
}

function patchSelf(
  set: (partial: Partial<OrbitStore>) => void,
  get: () => OrbitStore,
  update: (person: SimCall["participants"][number]) => SimCall["participants"][number],
) {
  const call = get().call;
  if (!call) return;
  set({
    call: {
      ...call,
      participants: call.participants.map((person) => (person.userId === YOU ? update(person) : person)),
    },
  });
}
