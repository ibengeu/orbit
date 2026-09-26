import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Composer } from "@/components/orbit/composer";
import { MessageList } from "@/components/orbit/messages";
import { conversationTitle, conversationsOf, conversationById, userById, timeLabel, absoluteTime } from "@/lib/orbit/derive";
import { useOrbit } from "@/lib/orbit/store";
import type { Message } from "@/lib/orbit/types";
import { MessageBody } from "@/components/orbit/message-body";
import { Avatar } from "@/components/orbit/avatar";
import { cn } from "@/lib/utils";
import { YOU } from "@/lib/orbit/seed";

export function ThreadPane({ messages }: { messages: Message[] }) {
  const parentId = useOrbit((state) => state.threadParentId);
  const extra = useOrbit((state) => state.extraConversations);
  const presence = useOrbit((state) => state.presence);
  const close = useOrbit((state) => state.closeThread);
  const parent = messages.find((message) => message.id === parentId);
  const replies = messages.filter((message) => message.parentId === parentId);
  const conversation = parent ? conversationById(conversationsOf(extra), parent.conversationId) : null;
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!parentId) return;
    heading.current?.focus({ preventScroll: true });
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (useOrbit.getState().searchOpen) return;
      close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [parentId, close]);

  if (!parentId) return null;

  return (
    <aside
      aria-labelledby="thread-heading"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          close();
        }
      }}
      className="absolute inset-0 z-30 flex w-full min-h-0 flex-col bg-paper shadow-pop md:inset-y-0 md:right-0 md:left-auto md:w-thread xl:static xl:z-auto xl:w-thread xl:shrink-0 xl:border-l xl:shadow-none"
    >
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-3">
          <div className="min-w-0 flex-1">
            <h2 id="thread-heading" ref={heading} tabIndex={-1} className="text-base font-semibold outline-none">
              Thread
            </h2>
            <p className="truncate text-xs text-ink-faint">
              {conversation ? (conversation.kind === "channel" ? `#${conversationTitle(conversation)}` : conversationTitle(conversation)) : "Conversation"}
            </p>
          </div>
          <button
            type="button"
            aria-label="Back to conversation"
            onClick={close}
            className="inline-flex h-11 shrink-0 items-center gap-1 rounded-md px-2 text-sm font-medium text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <X className="size-4" />
            <span className="md:sr-only">Back</span>
          </button>
        </header>
        <div data-thread-scroll className="min-h-0 flex-1 overflow-y-auto">
          <div className="border-b border-line px-4 py-4">
            {parent ? (
              <article className={cn("relative rounded-md px-2 py-1", parent.authorId === YOU && "bg-accent/5")}>
                {parent.authorId === YOU ? (
                  <span className="absolute top-1 bottom-1 left-0 w-1 rounded-full bg-accent" aria-hidden="true" />
                ) : null}
                <div className="flex items-center gap-2">
                  <Avatar userId={parent.authorId} selfPresence={presence} size="sm" />
                  <span className="text-sm font-semibold">{userById(parent.authorId).name}</span>
                  {parent.authorId === YOU ? <span className="text-xs text-ink-faint">You</span> : null}
                  <time dateTime={parent.createdAt} title={absoluteTime(parent.createdAt)} className="text-xs text-ink-faint tabular-nums">
                    {timeLabel(parent.createdAt)}
                    <span className="sr-only">, {absoluteTime(parent.createdAt)}</span>
                  </time>
                  {parent.editedAt ? <span className="text-xs text-ink-faint">(edited)</span> : null}
                </div>
                <div className="mt-2">
                  <MessageBody text={parent.body} />
                </div>
              </article>
            ) : (
              <p className="text-sm text-ink-soft">This message was deleted.</p>
            )}
          </div>
          {replies.length === 0 ? (
            <p className="px-4 py-6 text-sm text-ink-soft">No replies yet. Start the thread below.</p>
          ) : (
            <MessageList
              mode="thread"
              conversationId={parent?.conversationId ?? ""}
              messages={replies}
              emptyTitle="No replies yet"
              emptyBody="Start the thread below."
            />
          )}
        </div>
        {parent ? (
          <div className="shrink-0 border-t border-line px-3 py-3">
            <Composer
              draftKey={`thread:${parent.id}`}
              fieldId="thread-composer"
              conversationId={parent.conversationId}
              parentId={parent.id}
              placeholder="Reply in thread"
            />
          </div>
        ) : null}
      </aside>
  );
}
