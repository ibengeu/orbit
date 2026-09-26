import { useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";
import { CallReturnBar, CallRuntime, CallSurfaces } from "@/components/orbit/call-stage";
import { MobileNav, Sidebar, WorkspaceRail } from "@/components/orbit/chrome";
import { ConversationPane } from "@/components/orbit/conversation";
import { OrbitDialogs } from "@/components/orbit/dialogs";
import { ActivityView, LaterView } from "@/components/orbit/lists";
import { SearchDialog } from "@/components/orbit/search-dialog";
import { ThreadPane } from "@/components/orbit/thread-pane";
import { Welcome } from "@/components/orbit/welcome";
import { assembleMessages, conversationById, conversationTitle, conversationsOf, workspacesOf } from "@/lib/orbit/derive";
import { createWorkspace, getPreferences, getProfile, getReadState, listCalls, listConversations, listMessages, listSavedMessages, listWorkspaces, type ApiCall, type ApiConversation, type ApiMessage, type ApiWorkspace } from "@/lib/orbit/api-client";
import { SEED_CONVERSATIONS, SEED_WORKSPACES, YOU } from "@/lib/orbit/seed";
import { clearSession, readSession } from "@/lib/orbit/session";
import { readUserCache, useOrbit } from "@/lib/orbit/store";
import type { Conversation, Message } from "@/lib/orbit/types";

const RETURN_KEY = "orbit:return";
const demoConversationIds = new Set(SEED_CONVERSATIONS.map((conversation) => conversation.id));

async function provisionDemoWorkspaces(): Promise<ApiWorkspace[]> {
  const current = await listWorkspaces();
  for (const seed of SEED_WORKSPACES) {
    if (current.data.some((workspace) => workspace.id === seed.id)) continue;
    try {
      await createWorkspace(seed.name, seed.id as "orbit" | "lumen");
    } catch {
      // A concurrent browser session can create the same resource first.
    }
  }
  return (await listWorkspaces()).data;
}

async function loadConversationMessages(conversationId: string): Promise<ApiMessage[]> {
  const messages: ApiMessage[] = [];
  let cursor = 0;
  let after: string | undefined;
  for (;;) {
    const page = await listMessages(conversationId, { limit: 100, cursor, after, includeDeleted: true });
    messages.push(...page.data);
    if (!page.nextCursor) return messages;
    cursor = Number(page.nextCursor);
    after = page.nextPageToken ?? undefined;
  }
}

async function loadCallHistory(): Promise<ApiCall[]> {
  const calls: ApiCall[] = [];
  let cursor = 0;
  let after: string | undefined;
  for (;;) {
    const page = await listCalls({ limit: 100, cursor, after });
    calls.push(...page.data);
    if (!page.nextCursor) return calls;
    cursor = Number(page.nextCursor);
    after = page.nextPageToken ?? undefined;
  }
}

function uiConversation(item: ApiConversation, userId: string): Conversation {
  const participantIds = item.participantIds.map((id) => (id === userId ? YOU : id));
  if (item.kind === "channel") {
    return { kind: "channel", id: item.id, workspaceId: item.workspaceId, name: item.name ?? "channel", description: item.description ?? "", memberIds: participantIds };
  }
  return { kind: "dm", id: item.id, workspaceId: item.workspaceId, participantIds, title: item.title };
}

function uiMessage(item: ApiMessage, userId: string): Message {
  return {
    ...item,
    authorId: item.authorId === userId ? YOU : item.authorId,
    reactions: item.reactions.map((reaction) => ({
      emoji: reaction.emoji,
      userIds: reaction.userIds.map((id) => (id === userId ? YOU : id)),
    })),
  };
}

async function loadServerState() {
  const [profile, preferences, saved, calls, workspaces] = await Promise.all([
    getProfile(), getPreferences(), listSavedMessages(), loadCallHistory(), provisionDemoWorkspaces(),
  ]);
  const collections = await Promise.all(workspaces.map((workspace) => listConversations(workspace.id)));
  const conversations = collections.flatMap((collection) => collection.data);
  const [messageCollections, readStates] = await Promise.all([
    Promise.all(conversations.map((conversation) => loadConversationMessages(conversation.id))),
    Promise.all(conversations.map((conversation) => getReadState(conversation.id))),
  ]);
  const messages = messageCollections.flat();
  return { profile, preferences, saved, calls, workspaces, conversations, messages, readStates };
}

function callHistoryMessage(call: ApiCall): Message | null {
  if (!call.startedAt || !call.endedAt) return null;
  const duration = call.durationSec ?? 0;
  const label = `${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, "0")}`;
  return { id: `history-${call.id}`, conversationId: call.conversationId, authorId: "system", body: `${call.kind === "video" ? "Video" : "Voice"} call ended · ${label}`, createdAt: call.endedAt, reactions: [], system: true };
}

type ServerSnapshot = Awaited<ReturnType<typeof loadServerState>>;
type UserCache = ReturnType<typeof readUserCache>;

function selectedLocation(snapshot: ServerSnapshot, local: UserCache) {
  const hashConversationId = typeof location === "undefined" ? "" : location.hash.slice(1).split("/")[0];
  const hashConversation = snapshot.conversations.find((item) => item.id === hashConversationId);
  const workspaceId = selectedWorkspaceId(snapshot, local, hashConversation);
  const conversationId = selectedConversationId(snapshot, local, workspaceId, hashConversation);
  const threadParentId = selectedThreadParentId(snapshot, local, conversationId);
  return { workspaceId, conversationId, threadParentId, view: local?.view ?? "conversation" };
}

function selectedWorkspaceId(snapshot: ServerSnapshot, local: UserCache, hashConversation: ApiConversation | undefined) {
  if (hashConversation) return hashConversation.workspaceId;
  const cached = snapshot.workspaces.find((item) => item.id === local?.workspaceId);
  return cached?.id ?? snapshot.workspaces[0]?.id ?? "orbit";
}

function selectedConversationId(snapshot: ServerSnapshot, local: UserCache, workspaceId: string, hashConversation: ApiConversation | undefined) {
  if (hashConversation) return hashConversation.id;
  const conversations = snapshot.conversations.filter((item) => item.workspaceId === workspaceId);
  return conversations.find((item) => item.id === local?.conversationId)?.id ?? conversations[0]?.id ?? "";
}

function selectedThreadParentId(snapshot: ServerSnapshot, local: UserCache, conversationId: string) {
  if (!local?.threadParentId) return null;
  return snapshot.messages.some((item) => item.id === local.threadParentId && item.conversationId === conversationId) ? local.threadParentId : null;
}

function localViewState(local: UserCache, userId: string) {
  return {
    cacheOwnerId: userId,
    ...localDraftState(local),
    ...localNavigationState(local),
  };
}

function localDraftState(local: UserCache) {
  return { drafts: local?.drafts ?? {}, draftAttachments: local?.draftAttachments ?? {}, activityReadIds: local?.activityReadIds ?? [] };
}

function localNavigationState(local: UserCache) {
  return {
    collapsed: local?.collapsed ?? { channels: false, dms: false },
    lastChannel: local?.lastChannel ?? { orbit: "general", lumen: "lumen-general" },
    lastDm: local?.lastDm ?? { orbit: "dm-priya" },
  };
}

function serverViewState(snapshot: ServerSnapshot, userId: string) {
  const savedIds = snapshot.saved.data.map((item) => item.messageId);
  const savedAt = Object.fromEntries(snapshot.saved.data.map((item) => [item.messageId, item.savedAt]));
  const callMessages = snapshot.calls.map(callHistoryMessage).filter((item): item is Message => item !== null);
  const readStates = Object.fromEntries(snapshot.readStates.flatMap((item) => item.lastReadAt ? [[item.conversationId, item.lastReadAt]] : []));
  return {
    presence: snapshot.profile.presence,
    status: snapshot.profile.status,
    alwaysShowTime: snapshot.preferences.alwaysShowTime,
    extraWorkspaces: snapshot.workspaces.filter((item) => !SEED_WORKSPACES.some((seed) => seed.id === item.id)).map(({ id, name, initials }) => ({ id, name, initials })),
    extraConversations: snapshot.conversations.filter((item) => !demoConversationIds.has(item.id)).map((item) => uiConversation(item, userId)),
    createdMessages: [...snapshot.messages.map((item) => uiMessage(item, userId)), ...callMessages],
    callHistory: snapshot.calls.filter((item) => item.startedAt && item.endedAt).map((item) => ({
      id: `history-${item.id}`, conversationId: item.conversationId, kind: item.kind, initiatorId: YOU,
      startedAt: item.startedAt!, endedAt: item.endedAt!, durationSec: item.durationSec ?? 0,
    })),
    deletedIds: snapshot.messages.filter((item) => item.deletedAt).map((item) => item.id),
    savedIds,
    savedAt,
    lastRead: readStates,
    edited: {},
    reactionOverrides: {},
    call: null,
    callSwitch: null,
  };
}

function applyServerState(snapshot: ServerSnapshot) {
  const userId = snapshot.profile.userId;
  const local = readUserCache(userId);
  // OWASP A01:2025 Broken Access Control. Apply only the verified user's cache and current server snapshot.
  // This prevents messages, workspaces, drafts, and state from a prior account from entering the view.
  useOrbit.setState({ ...localViewState(local, userId), ...serverViewState(snapshot, userId), ...selectedLocation(snapshot, local) });
}

export function OrbitApp() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const existing = readSession();
    if (!existing && location.hash.length > 1) sessionStorage.setItem(RETURN_KEY, location.hash);
    if (existing) enterDemo();
    setAuthed(Boolean(existing));
    setReady(true);
    const onSignOut = () => {
      clearSession();
      useOrbit.getState().clearAccountState();
      history.replaceState(null, "", location.pathname);
      setAuthed(false);
    };
    window.addEventListener("orbit-signout", onSignOut);
    return () => window.removeEventListener("orbit-signout", onSignOut);
  }, []);

  if (!ready) return null;
  if (!authed) {
    return (
      <Welcome
        onEnter={() => {
          enterDemo();
          setAuthed(true);
        }}
      />
    );
  }
  return <AuthedApp />;
}

function enterDemo() {
  const pending = sessionStorage.getItem(RETURN_KEY);
  if (pending && location.hash.length <= 1) location.hash = pending;
  sessionStorage.removeItem(RETURN_KEY);
  useOrbit.getState().hydrate();
}

function AuthedApp() {
  const hydrated = useOrbit((state) => state.hydrated);
  const [serverState, setServerState] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    useOrbit.getState().hydrate();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    setServerState("loading");
    void loadServerState()
      .then((snapshot) => { if (!cancelled) { applyServerState(snapshot); setServerState("ready"); } })
      .catch(() => { if (!cancelled) setServerState("error"); });
    return () => { cancelled = true; };
  }, [hydrated, retry]);

  useEffect(() => {
    const shell = document.getElementById("orbit-shell");
    const viewport = window.visualViewport;
    if (!shell || !viewport) return;
    const sync = () => {
      shell.style.height = `${viewport.height}px`;
      shell.style.transform = viewport.offsetTop ? `translateY(${viewport.offsetTop}px)` : "";
      document.documentElement.style.setProperty("--orbit-vvh", `${viewport.height}px`);
      document.documentElement.style.setProperty("--orbit-vv-top", `${viewport.offsetTop}px`);
    };
    sync();
    viewport.addEventListener("resize", sync);
    viewport.addEventListener("scroll", sync);
    return () => {
      viewport.removeEventListener("resize", sync);
      viewport.removeEventListener("scroll", sync);
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (query.matches) useOrbit.getState().setNavOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, [contenteditable='true']")) return;
      event.preventDefault();
      const state = useOrbit.getState();
      if (state.searchOpen) state.setSearchOpen(false);
      else state.openSearch(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!hydrated || serverState === "loading") {
    return (
      <div role="status" aria-live="polite" className="flex h-dvh items-center justify-center bg-paper text-sm text-ink-soft">
        Loading workspace…
      </div>
    );
  }

  if (serverState === "error") {
    return (
      <div role="alert" className="flex h-dvh flex-col items-center justify-center gap-4 bg-paper px-6 text-center text-ink">
        <p>Could not load the workspace. Check your connection and try again.</p>
        <button type="button" className="rounded-md bg-accent px-4 py-2 font-semibold text-accent-ink" onClick={() => setRetry((value) => value + 1)}>Try again</button>
      </div>
    );
  }

  return <OrbitShell />;
}

function OrbitShell() {
  const liveMessage = useOrbit((state) => state.liveMessage);
  const createdMessages = useOrbit((state) => state.createdMessages);
  const edited = useOrbit((state) => state.edited);
  const deletedIds = useOrbit((state) => state.deletedIds);
  const reactionOverrides = useOrbit((state) => state.reactionOverrides);
  const view = useOrbit((state) => state.view);
  const conversationId = useOrbit((state) => state.conversationId);
  const workspaceId = useOrbit((state) => state.workspaceId);
  const extra = useOrbit((state) => state.extraConversations);
  const extraWorkspaces = useOrbit((state) => state.extraWorkspaces);
  const threadParentId = useOrbit((state) => state.threadParentId);

  const messages = useMemo(
    () => assembleMessages({ createdMessages, edited, deletedIds, reactionOverrides }),
    [createdMessages, edited, deletedIds, reactionOverrides],
  );

  useEffect(() => {
    const conversation = conversationById(conversationsOf(extra), conversationId);
    const workspaceName = workspacesOf(extraWorkspaces).find((item) => item.id === workspaceId)?.name ?? "Orbit";
    const title = conversation
      ? conversation.kind === "channel"
        ? `#${conversationTitle(conversation)} · ${workspaceName}`
        : `${conversationTitle(conversation)} · ${workspaceName}`
      : workspaceName;
    document.title = title;
  }, [conversationId, extra, extraWorkspaces, workspaceId]);

  return (
    <div id="orbit-shell" className="flex h-dvh overflow-hidden bg-paper text-ink">
      <a
        href="#conversation"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-paper focus:px-3 focus:py-2"
      >
        Skip to conversation
      </a>
      <div className="hidden h-full md:block">
        <WorkspaceRail />
      </div>
      <div className="hidden h-full w-sidebar-xs shrink-0 md:block lg:w-sidebar-sm xl:w-sidebar">
        <Sidebar messages={messages} />
      </div>
      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <CallRuntime />
        <CallReturnBar />
        <CallSurfaces />
        <div className="relative flex min-h-0 min-w-0 flex-1">
        {view === "activity" ? <ActivityView messages={messages} /> : null}
        {view === "later" ? <LaterView messages={messages} /> : null}
        {view === "conversation" ? <ConversationPane messages={messages} /> : null}
        {view === "conversation" && threadParentId ? (
          <button
            type="button"
            aria-label="Close thread"
            className="absolute inset-0 z-20 bg-ink/30 max-md:hidden xl:hidden"
            onClick={() => useOrbit.getState().closeThread()}
          />
        ) : null}
        {view === "conversation" ? <ThreadPane messages={messages} /> : null}
        </div>
      </main>
      <MobileNav messages={messages} />
      <SearchDialog messages={messages} />
      <OrbitDialogs />
      <Toaster position="bottom-center" />
      <p className="sr-only" aria-live="polite">{liveMessage}</p>
    </div>
  );
}
