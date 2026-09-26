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
import { clearSession, readSession } from "@/lib/orbit/session";
import { useOrbit } from "@/lib/orbit/store";

const RETURN_KEY = "orbit:return";

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

  useEffect(() => {
    useOrbit.getState().hydrate();
  }, []);

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

  if (!hydrated) {
    return (
      <div role="status" aria-live="polite" className="flex h-dvh items-center justify-center bg-paper text-sm text-ink-soft">
        Loading workspace…
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
