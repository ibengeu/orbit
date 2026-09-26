import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { Avatar } from "@/components/orbit/avatar";
import { activityItems, conversationById, conversationTitle, conversationsOf, snippet, timeLabel, userById } from "@/lib/orbit/derive";
import { SEED_MESSAGES } from "@/lib/orbit/seed";
import { useOrbit } from "@/lib/orbit/store";
import type { Message } from "@/lib/orbit/types";

export function ActivityView({ messages }: { messages: Message[] }) {
  const extra = useOrbit((state) => state.extraConversations);
  const workspaceId = useOrbit((state) => state.workspaceId);
  const activityReadIds = useOrbit((state) => state.activityReadIds);
  const deletedIds = useOrbit((state) => state.deletedIds);
  const conversations = conversationsOf(extra).filter((item) => item.workspaceId === workspaceId);
  const items = activityItems(messages).filter((item) => conversations.some((conversation) => conversation.id === item.conversationId));

  return (
    <section aria-label="Activity" className="flex min-h-0 min-w-0 flex-1 flex-col bg-paper">
      <PaneHeader title="Activity" detail="Mentions and threads you’re in">
        <button
          type="button"
          className="ml-auto inline-flex h-11 items-center rounded-md px-3 text-sm font-semibold text-ink-soft hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onClick={() => useOrbit.getState().markActivityRead()}
        >
          Mark all read
        </button>
      </PaneHeader>
      {items.length === 0 ? (
        <Empty title="You’re caught up" body="Mentions and replies in your threads will show up here." />
      ) : (
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {items.map((item) => {
            const conversation = conversationById(conversations, item.conversationId);
            const where = conversation
              ? conversation.kind === "channel"
                ? `#${conversation.name}`
                : conversationTitle(conversation)
              : "a conversation";
            const gone = deletedIds.includes(item.message.id);
            const unread = !activityReadIds.includes(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={gone}
                  onClick={() => useOrbit.getState().openActivity(item.message.id)}
                  className="flex w-full gap-3 border-b border-line px-4 py-3 text-left hover:bg-ink/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent disabled:hover:bg-transparent"
                >
                  <Avatar userId={item.message.authorId} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className={unread ? "text-sm font-semibold" : "text-sm"}>{userById(item.message.authorId).name}</span>
                      <span className="text-xs text-ink-faint">{item.kind === "mention" ? "mentioned you" : "replied in a thread"}</span>
                      <span className="ml-auto text-xs text-ink-faint tabular-nums">{timeLabel(item.message.createdAt)}</span>
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-soft">{where}</span>
                    <span className="mt-1 block truncate text-sm" title={gone ? "Message unavailable" : item.message.body}>
                      {gone ? "Message unavailable" : snippet(item.message.body)}
                      {unread ? <span className="sr-only">, unread</span> : null}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export function LaterView({ messages }: { messages: Message[] }) {
  const savedIds = useOrbit((state) => state.savedIds);
  const savedAt = useOrbit((state) => state.savedAt);
  const deletedIds = useOrbit((state) => state.deletedIds);
  const created = useOrbit((state) => state.createdMessages);
  const edited = useOrbit((state) => state.edited);
  const extra = useOrbit((state) => state.extraConversations);
  const conversations = conversationsOf(extra);
  const saved = savedIds.map((id) => {
    const live = messages.find((message) => message.id === id);
    const raw = live ?? created.find((message) => message.id === id) ?? SEED_MESSAGES.find((message) => message.id === id);
    return { id, message: raw, deleted: deletedIds.includes(id) || !live };
  });

  return (
    <section aria-label="Later" className="flex min-h-0 min-w-0 flex-1 flex-col bg-paper">
      <PaneHeader title="Later" detail="Messages you saved for later" />
      {saved.length === 0 ? (
        <Empty title="Nothing saved" body="Save a message from any conversation to find it here.">
          <button
            type="button"
            className="mt-4 inline-flex h-11 items-center rounded-md bg-accent px-4 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={() => useOrbit.getState().openConversation(useOrbit.getState().conversationId || "general")}
          >
            Back to conversation
          </button>
        </Empty>
      ) : (
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {saved.map(({ id, message, deleted }) => {
            const conversation = message ? conversationById(conversations, message.conversationId) : undefined;
            const where = conversation
              ? conversation.kind === "channel"
                ? `#${conversation.name}`
                : conversationTitle(conversation)
              : "Conversation";
            const body = message ? (edited[id]?.body ?? message.body) : "";
            return (
              <li key={id} className="flex items-start gap-2 border-b border-line">
                <button
                  type="button"
                  aria-label={message ? `Open message from ${userById(message.authorId).name} in ${where}` : "Message unavailable"}
                  disabled={deleted || !message}
                  onClick={() => message && useOrbit.getState().focusMessage(message.id)}
                  className="flex min-w-0 flex-1 gap-3 px-4 py-3 text-left hover:bg-ink/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent disabled:hover:bg-transparent"
                >
                  {message ? <Avatar userId={message.authorId} size="sm" /> : null}
                  <span className="min-w-0">
                    <span className="text-sm font-semibold">{message ? userById(message.authorId).name : "Saved message"}</span>
                    <span className="ml-2 text-xs text-ink-faint">{where}</span>
                    {savedAt[id] ? <span className="ml-2 text-xs text-ink-faint">Saved {timeLabel(savedAt[id])}</span> : null}
                    <span className="mt-1 block truncate text-sm" title={deleted ? "This message was deleted" : body}>
                      {deleted ? "This message was deleted" : snippet(body)}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  className="mr-3 mt-3 shrink-0 rounded-md px-2 py-2 text-xs font-semibold text-ink-soft hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label="Remove from Later"
                  onClick={() => useOrbit.getState().toggleSaved(id)}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function PaneHeader({ title, detail, children }: { title: string; detail: string; children?: ReactNode }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-3 lg:px-4">
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => useOrbit.getState().setNavOpen(true)}
        className="inline-flex size-11 items-center justify-center rounded-md md:hidden"
      >
        <Menu className="size-5" />
      </button>
      <div className="min-w-0">
        <h1 className="text-base font-semibold">{title}</h1>
        <p className="truncate text-xs text-ink-faint">{detail}</p>
      </div>
      {children}
    </header>
  );
}

function Empty({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 text-center">
      <div className="max-w-sm">
        <h2 className="text-lg font-semibold text-balance">{title}</h2>
        <p className="mt-2 text-sm leading-normal text-ink-soft">{body}</p>
        {children}
      </div>
    </div>
  );
}
