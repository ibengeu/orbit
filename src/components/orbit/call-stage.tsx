import { useEffect, useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff } from "lucide-react";
import { Avatar, avatarClass } from "@/components/orbit/avatar";
import { conversationById, conversationsOf, userById } from "@/lib/orbit/derive";
import { YOU } from "@/lib/orbit/seed";
import { useOrbit } from "@/lib/orbit/store";
import { cn } from "@/lib/utils";

const RING_MS = 4000;

export function CallRuntime() {
  const callId = useOrbit((state) => state.call?.id ?? null);
  const phase = useOrbit((state) => state.call?.phase ?? null);
  const conversationId = useOrbit((state) => state.conversationId);
  const view = useOrbit((state) => state.view);

  useEffect(() => {
    const call = useOrbit.getState().call;
    if (!call || call.phase !== "ringing") return;
    if (view !== "conversation" || conversationId !== call.conversationId) {
      useOrbit.getState().cancelRing();
    }
  }, [callId, phase, conversationId, view]);

  useEffect(() => {
    const call = useOrbit.getState().call;
    if (!call || call.phase !== "ringing") return;
    const timer = window.setTimeout(() => {
      const current = useOrbit.getState().call;
      if (!current || current.id !== call.id || current.phase !== "ringing") return;
      if (current.declineOnTimeout) useOrbit.getState().missCall();
      else useOrbit.getState().acceptCall();
    }, RING_MS);
    return () => window.clearTimeout(timer);
  }, [callId, phase]);

  return null;
}

export function CallReturnBar() {
  const call = useOrbit((state) => state.call);
  const conversationId = useOrbit((state) => state.conversationId);
  const view = useOrbit((state) => state.view);
  const [now, setNow] = useState(() => Date.now());
  const away = Boolean(call && call.phase === "active" && (view !== "conversation" || conversationId !== call.conversationId));

  useEffect(() => {
    if (!away) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [away]);

  if (!call || !away || call.connectedAt == null) return null;
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b border-line bg-plum px-3 text-paper">
      <Phone className="size-4 shrink-0" aria-hidden="true" />
      <p className="min-w-0 flex-1 truncate text-sm font-medium">
        {call.youJoined ? "In a call" : "Call in progress"} · {clock(now - call.connectedAt)}
      </p>
      <button
        type="button"
        className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-plum-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        onClick={() => useOrbit.getState().openConversation(call.conversationId)}
      >
        Return
      </button>
      {call.youJoined ? (
        <button
          type="button"
          className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-plum-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          onClick={() => useOrbit.getState().leaveCall()}
        >
          Leave
        </button>
      ) : null}
    </div>
  );
}

export function CallColumn({ conversationId }: { conversationId: string }) {
  const call = useOrbit((state) => state.call);
  const notice = useOrbit((state) => state.callNotice);
  if (call?.conversationId !== conversationId) {
    return notice ? <Notice message={notice} /> : null;
  }
  return (
    <>
      {notice ? <Notice message={notice} /> : null}
      {call.phase === "ringing" ? <Ringing callId={call.id} /> : null}
      {call.phase === "active" && call.youJoined ? <ActiveCall /> : null}
      {call.phase === "active" && !call.youJoined ? <CallBanner /> : null}
    </>
  );
}

function Notice({ message }: { message: string }) {
  return (
    <p role="status" className="border-b border-line bg-paper-raised px-4 py-2 text-sm text-ink">
      {message}
    </p>
  );
}

function Ringing({ callId }: { callId: string }) {
  const call = useOrbit((state) => state.call);
  const extra = useOrbit((state) => state.extraConversations);
  if (!call || call.id !== callId) return null;
  const conversation = conversationById(conversationsOf(extra), call.conversationId);
  const names = call.participants.map((person) => userById(person.userId).name.split(" ")[0]);
  const who = names.length === 0 ? "the group" : names.length === 1 ? names[0] : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
  return (
    <section aria-label="Ringing" className="flex shrink-0 flex-wrap items-center gap-2 border-b border-line bg-paper-raised px-4 py-3">
      <span className="orbit-ring inline-flex rounded-full">
        <Avatar userId={call.participants[0]?.userId ?? YOU} size="md" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">Ringing {who}…</p>
        <p className="truncate text-xs text-ink-faint">
          {conversation?.kind === "dm" && conversation.title ? "Group call" : "Answers automatically, or choose an outcome"}
        </p>
      </div>
      <label className="hidden items-center gap-2 text-xs text-ink-soft sm:inline-flex">
        <input
          type="checkbox"
          checked={call.declineOnTimeout}
          onChange={(event) => useOrbit.getState().setDeclineOnTimeout(event.target.checked)}
        />
        No answer
      </label>
      <button type="button" className={controlClass} onClick={() => useOrbit.getState().acceptCall()}>
        Accept
      </button>
      <button type="button" className={controlClass} onClick={() => useOrbit.getState().missCall()}>
        Decline
      </button>
      <button type="button" className={controlClass} onClick={() => useOrbit.getState().cancelRing()}>
        Cancel
      </button>
    </section>
  );
}

function CallBanner() {
  const call = useOrbit((state) => state.call);
  const [connecting, setConnecting] = useState(false);
  if (!call) return null;
  const count = call.participants.length;
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-line bg-paper-raised px-4 py-2">
      <Phone className="size-4 shrink-0 text-accent" aria-hidden="true" />
      <p className="min-w-0 flex-1 truncate text-sm">
        {count === 0 ? "Call in progress — no one has joined yet" : `Call in progress — ${count} ${count === 1 ? "person" : "people"}`}
      </p>
      {call.mode !== "direct" && !call.simulated ? (
        <button type="button" className={controlClass} onClick={() => useOrbit.getState().simulateJoins()}>
          Someone joins
        </button>
      ) : null}
      {call.participants.some((person) => person.userId !== YOU) ? (
        <button type="button" className={controlClass} onClick={() => useOrbit.getState().simulateLeave()}>
          Someone leaves
        </button>
      ) : null}
      <button
        type="button"
        className="inline-flex h-11 items-center rounded-md bg-accent px-3 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        onClick={() => {
          setConnecting(true);
          window.setTimeout(() => {
            useOrbit.getState().joinCall();
            setConnecting(false);
          }, 400);
        }}
      >
        {connecting ? "Connecting…" : "Join"}
      </button>
      {call.youStarted ? (
        <button type="button" className={controlClass} onClick={() => useOrbit.getState().endCallForAll()}>
          End for all
        </button>
      ) : null}
    </div>
  );
}

function ActiveCall() {
  const call = useOrbit((state) => state.call);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  if (!call || call.connectedAt == null) return null;
  const you = call.participants.find((person) => person.userId === YOU);
  const count = call.participants.length;
  return (
    <section aria-label="Active call" className="flex max-h-80 shrink-0 flex-col gap-3 overflow-y-auto border-b border-line bg-paper-raised px-4 py-3 max-md:absolute max-md:inset-x-0 max-md:top-14 max-md:bottom-0 max-md:z-20 max-md:max-h-none">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold">Call · {clock(now - call.connectedAt)}</p>
        <span className="text-xs text-ink-faint">
          {count} {count === 1 ? "person" : "people"}
        </span>
      </div>
      <ul className={cn("grid gap-2", count <= 1 ? "grid-cols-1" : count === 2 ? "grid-cols-2" : count <= 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3 sm:grid-cols-4")}>
        {call.participants.map((person) => {
          const user = userById(person.userId);
          return (
            <li key={person.userId} className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-lg bg-plum px-2 py-3 text-paper">
              {person.video ? (
                <span className={cn("inline-flex size-12 items-center justify-center rounded-md text-sm font-semibold", avatarClass(person.userId))}>
                  {user.initials}
                  <span className="sr-only">Camera placeholder, no live video</span>
                </span>
              ) : (
                <Avatar userId={person.userId} size="md" />
              )}
              <span className="max-w-full truncate text-xs font-medium">{person.userId === YOU ? "You" : user.name}</span>
              <span className="inline-flex items-center gap-1 text-xs text-plum-muted">
                {person.muted ? <MicOff className="size-3.5" aria-hidden="true" /> : <Mic className="size-3.5" aria-hidden="true" />}
                {person.video ? <Video className="size-3.5" aria-hidden="true" /> : <VideoOff className="size-3.5" aria-hidden="true" />}
                <span className="sr-only">
                  {person.muted ? "Muted" : "Microphone on"}, {person.video ? "camera placeholder" : "camera off"}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" aria-pressed={Boolean(you?.muted)} className={controlClass} onClick={() => useOrbit.getState().toggleSelfMute()}>
          {you?.muted ? "Unmute" : "Mute"}
        </button>
        <button type="button" aria-pressed={Boolean(you?.video)} className={controlClass} onClick={() => useOrbit.getState().toggleSelfVideo()}>
          {you?.video ? "Stop video" : "Start video"}
        </button>
        {call.mode !== "direct" && !call.simulated ? (
          <button type="button" className={controlClass} onClick={() => useOrbit.getState().simulateJoins()}>
            Someone joins
          </button>
        ) : null}
        {call.mode !== "direct" && call.participants.some((person) => person.userId !== YOU) ? (
          <button type="button" className={controlClass} onClick={() => useOrbit.getState().simulateLeave()}>
            Someone leaves
          </button>
        ) : null}
        {call.youStarted && call.mode !== "direct" ? (
          <button type="button" className={controlClass} onClick={() => useOrbit.getState().endCallForAll()}>
            End for all
          </button>
        ) : null}
        <button
          type="button"
          className="ml-auto inline-flex h-11 items-center gap-1 rounded-md bg-danger px-3 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onClick={() => useOrbit.getState().leaveCall()}
        >
          <PhoneOff className="size-4" aria-hidden="true" />
          Leave
        </button>
      </div>
    </section>
  );
}

function clock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

const controlClass =
  "inline-flex h-11 items-center rounded-md border border-line bg-paper px-3 text-sm font-medium text-ink hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
