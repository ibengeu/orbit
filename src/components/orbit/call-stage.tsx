import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff } from "lucide-react";
import { Avatar } from "@/components/orbit/avatar";
import { conversationTitle, conversationsOf, conversationById, memberIds, userById } from "@/lib/orbit/derive";
import { localTracks } from "@/lib/orbit/media";
import { YOU } from "@/lib/orbit/seed";
import { recoverInterruptedCall, useOrbit } from "@/lib/orbit/store";
import type { DemoCall } from "@/lib/orbit/types";

export function CallRuntime() {
  useEffect(() => {
    recoverInterruptedCall();
    const end = () => {
      const call = useOrbit.getState().call;
      if (call?.phase === "active") useOrbit.getState().endCall();
    };
    window.addEventListener("pagehide", end);
    return () => window.removeEventListener("pagehide", end);
  }, []);
  return null;
}

export function CallReturnBar() {
  const call = useOrbit((state) => state.call);
  const [now, setNow] = useState(() => Date.now());
  const visible = Boolean(call && call.phase === "active" && call.surface === "minimized");
  useEffect(() => {
    if (!visible) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [visible]);
  if (!call || !visible || call.startedAt == null) return null;
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b border-line bg-plum px-3 text-paper">
      <Phone className="size-4 shrink-0" aria-hidden="true" />
      <p className="min-w-0 flex-1 truncate text-sm font-medium">
        Demo {call.kind} call · {clock(now - call.startedAt)}
      </p>
      <button
        type="button"
        className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-plum-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        onClick={() => useOrbit.getState().returnToCall()}
      >
        Return to call
      </button>
    </div>
  );
}

export function CallSurfaces() {
  const call = useOrbit((state) => state.call);
  const callSwitch = useOrbit((state) => state.callSwitch);
  return (
    <>
      {call && call.surface === "open" ? <CallDialog call={call} /> : null}
      {callSwitch ? <SwitchDialog /> : null}
    </>
  );
}

function CallDialog({ call }: { call: DemoCall }) {
  const extra = useOrbit((state) => state.extraConversations);
  const conversation = conversationById(conversationsOf(extra), call.conversationId);
  const title = conversation ? conversationTitle(conversation) : "Conversation";
  const others = conversation ? memberIds(conversation).filter((id) => id !== YOU) : [];
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [call.phase, call.id]);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (call.phase === "lobby") useOrbit.getState().cancelLobby();
      else useOrbit.getState().minimizeCall();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [call.phase]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4" role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="call-title"
        className="flex max-h-[100dvh] w-full flex-col bg-paper text-ink shadow-pop sm:max-h-[90dvh] sm:max-w-3xl sm:rounded-xl"
      >
        <header className="flex items-start gap-3 border-b border-line px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold tracking-wide text-accent uppercase">Demo call</p>
            <h2 id="call-title" ref={heading} tabIndex={-1} className="truncate text-lg font-semibold outline-none">
              {call.kind === "video" ? "Video" : "Voice"} · {title}
            </h2>
            <p className="text-sm text-ink-soft">Demo call — other participants are simulated.</p>
          </div>
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-md px-3 text-sm font-medium hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={() => (call.phase === "lobby" ? useOrbit.getState().cancelLobby() : useOrbit.getState().minimizeCall())}
          >
            {call.phase === "lobby" ? "Cancel" : "Hide"}
          </button>
        </header>
        {call.phase === "lobby" ? <Lobby call={call} others={others} /> : <ActiveCall call={call} others={others} />}
      </section>
    </div>
  );
}

function Lobby({ call, others }: { call: DemoCall; others: string[] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const node = videoRef.current;
    const track = localTracks().video;
    if (!node || !track) return;
    const stream = new MediaStream([track]);
    node.srcObject = stream;
    return () => {
      node.srcObject = null;
    };
  }, [call.camera]);
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
      <p className="text-sm text-ink-soft">
        Invitees: {others.map((id) => userById(id).name).join(", ") || "Just you"}. Simulated participants will not hear or see you.
      </p>
      {call.kind === "video" ? (
        <div className="overflow-hidden rounded-lg bg-plum">
          {call.camera === "live" ? (
            <video ref={videoRef} autoPlay playsInline muted className="aspect-video w-full -scale-x-100 object-cover" />
          ) : (
            <div className="flex aspect-video items-center justify-center">
              <Avatar userId={YOU} size="md" />
            </div>
          )}
          <div className="flex flex-wrap gap-2 p-3">
            <button type="button" className={buttonClass} onClick={() => void useOrbit.getState().enablePreview()}>
              {call.camera === "requesting" ? "Requesting camera…" : "Enable preview"}
            </button>
            <p className="text-xs text-plum-muted">Device permission is requested only after you enable preview or join.</p>
          </div>
        </div>
      ) : null}
      <Status call={call} />
      <div className="mt-auto flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onClick={() => void useOrbit.getState().joinDemoCall()}
        >
          {call.mic === "requesting" || call.camera === "requesting" ? "Requesting access…" : "Join demo call"}
        </button>
        {call.mic === "denied" || call.mic === "unavailable" ? (
          <button type="button" className={buttonClass} onClick={() => void useOrbit.getState().joinDemoCall({ withoutMic: true })}>
            Join without microphone
          </button>
        ) : null}
        {call.kind === "video" && (call.camera === "denied" || call.camera === "unavailable") ? (
          <button type="button" className={buttonClass} onClick={() => void useOrbit.getState().joinDemoCall({ withoutCamera: true })}>
            Join without camera
          </button>
        ) : null}
        <button type="button" className={buttonClass} onClick={() => useOrbit.getState().cancelLobby()}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function ActiveCall({ call, others }: { call: DemoCall; others: string[] }) {
  const [now, setNow] = useState(() => Date.now());
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const node = videoRef.current;
    const track = localTracks().video;
    if (!node) return;
    if (!track || call.camera !== "live") {
      node.srcObject = null;
      return;
    }
    node.srcObject = new MediaStream([track]);
    return () => {
      node.srcObject = null;
    };
  }, [call.camera]);
  const elapsed = call.startedAt ? clock(now - call.startedAt) : "0:00";
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 overflow-y-auto p-3 sm:grid-cols-3">
        <article className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg bg-plum p-3 text-paper">
          {call.kind === "video" && call.camera === "live" ? (
            <video ref={videoRef} autoPlay playsInline muted className="aspect-video w-full -scale-x-100 rounded-md object-cover" />
          ) : (
            <Avatar userId={YOU} size="md" />
          )}
          <p className="text-sm font-semibold">Alex Morgan</p>
          <p className="text-xs text-plum-muted">{call.mic === "live" ? "Microphone on" : "Muted"} · You</p>
        </article>
        {others.map((id) => (
          <article key={id} className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-lg bg-plum-raised p-3 text-paper">
            <Avatar userId={id} size="md" />
            <p className="max-w-full truncate text-sm font-semibold">{userById(id).name}</p>
            <p className="text-center text-xs text-plum-muted">Simulated participant — no live video</p>
          </article>
        ))}
      </div>
      <Status call={call} />
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <p className="mr-auto text-sm font-semibold tabular-nums">{elapsed}</p>
        <button type="button" className={buttonClass} aria-pressed={call.mic !== "live"} onClick={() => void useOrbit.getState().toggleMute()}>
          {call.mic === "live" ? <Mic className="size-4" /> : <MicOff className="size-4" />}
          {call.mic === "live" ? "Mute" : "Unmute"}
        </button>
        {call.kind === "video" ? (
          <button type="button" className={buttonClass} aria-pressed={call.camera !== "live"} onClick={() => void useOrbit.getState().toggleCamera()}>
            {call.camera === "live" ? <Video className="size-4" /> : <VideoOff className="size-4" />}
            {call.camera === "live" ? "Camera off" : "Camera on"}
          </button>
        ) : null}
        {(call.mic === "denied" || call.mic === "unavailable") && (
          <button type="button" className={buttonClass} onClick={() => void useOrbit.getState().retryDevice("mic")}>
            Retry microphone
          </button>
        )}
        {call.kind === "video" && (call.camera === "denied" || call.camera === "unavailable") ? (
          <button type="button" className={buttonClass} onClick={() => void useOrbit.getState().retryDevice("camera")}>
            Retry camera
          </button>
        ) : null}
        <button
          type="button"
          className="inline-flex h-11 items-center gap-1 rounded-md bg-danger px-3 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onClick={() => useOrbit.getState().endCall()}
        >
          <PhoneOff className="size-4" aria-hidden="true" />
          End call
        </button>
      </div>
    </div>
  );
}

function Status({ call }: { call: DemoCall }) {
  const lines = [call.micDetail, call.cameraDetail].filter(Boolean);
  if (lines.length === 0 && call.mic !== "requesting" && call.camera !== "requesting") return null;
  return (
    <div className="px-4 pb-2" role="status">
      {call.mic === "requesting" ? <p className="text-sm">Requesting microphone…</p> : null}
      {call.camera === "requesting" ? <p className="text-sm">Requesting camera…</p> : null}
      {lines.map((line) => (
        <p key={line} className="text-sm text-ink">
          {line}
        </p>
      ))}
    </div>
  );
}

function SwitchDialog() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="switch-title" className="w-full max-w-md rounded-xl bg-paper p-5 text-ink shadow-pop">
        <h2 id="switch-title" className="text-lg font-semibold">
          You’re already in a call
        </h2>
        <p className="mt-2 text-sm text-ink-soft">End the current demo call before starting another. This does not contact anyone else.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className={buttonClass} onClick={() => useOrbit.getState().returnToCall()}>
            Return to current call
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center rounded-md bg-danger px-3 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={() => useOrbit.getState().confirmCallSwitch()}
          >
            End current call and start new call
          </button>
        </div>
      </section>
    </div>
  );
}

function clock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const buttonClass =
  "inline-flex h-11 items-center gap-1 rounded-md border border-line bg-paper px-3 text-sm font-medium text-ink hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
