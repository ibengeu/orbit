import { forwardRef, useEffect, useLayoutEffect, useRef, useState, type ComponentPropsWithoutRef, type FocusEvent, type ReactNode } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Popover from "@radix-ui/react-popover";
import { Bookmark, Copy, MessageSquare, MoreHorizontal, Pencil, Phone, Smile, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/orbit/avatar";
import { MessageBody } from "@/components/orbit/message-body";
import { EMOJIS, YOU } from "@/lib/orbit/seed";
import {
  absoluteTime,
  bucketByDay,
  formatBytes,
  groupMessages,
  gutterTime,
  replyCount,
  timeLabel,
  userById,
  type MessageGroup,
} from "@/lib/orbit/derive";
import { useOrbit } from "@/lib/orbit/store";
import type { Message, Presence } from "@/lib/orbit/types";
import { cn } from "@/lib/utils";

export function MessageList({
  conversationId,
  messages,
  emptyTitle,
  emptyBody,
  mode = "channel",
}: {
  conversationId: string;
  messages: Message[];
  emptyTitle: string;
  emptyBody: string;
  mode?: "channel" | "thread";
}) {
  const highlightId = useOrbit((state) => state.highlightId);
  const scroller = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const previous = useRef({ id: "", length: 0 });
  const [pending, setPending] = useState(0);
  const roots =
    mode === "thread"
      ? messages
      : messages.filter((message) => message.conversationId === conversationId && !message.parentId);
  const days = bucketByDay(roots);
  const coarse = useCoarsePointer();

  function scrollTarget() {
    const node = scroller.current;
    if (!node) return null;
    if (mode === "thread") return node.closest("[data-thread-scroll]") as HTMLElement | null;
    return node;
  }

  useLayoutEffect(() => {
    const el = scrollTarget();
    const switched = previous.current.id !== conversationId;
    const grew = roots.length - previous.current.length;
    previous.current = { id: conversationId, length: roots.length };
    if (!el) return;

    if (highlightId) {
      const target = document.getElementById(`msg-${highlightId}`);
      if (target && el.contains(target)) {
        target.scrollIntoView({ block: "center" });
        return;
      }
    }

    if (mode === "thread" || switched || nearBottom.current) {
      el.scrollTop = el.scrollHeight;
      nearBottom.current = true;
      setPending(0);
      return;
    }

    if (grew > 0) setPending((count) => count + grew);
  }, [conversationId, roots.length, highlightId, mode]);

  if (roots.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <h2 className="text-lg font-semibold text-balance">{emptyTitle}</h2>
          <p className="mt-2 text-sm leading-normal text-ink-soft">{emptyBody}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scroller}
      onScroll={() => {
        const el = scroller.current;
        if (!el || mode === "thread") return;
        const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
        const near = distance <= el.clientHeight;
        nearBottom.current = near;
        if (near) setPending(0);
      }}
      className={mode === "thread" ? "w-full" : "flex min-h-0 flex-1 flex-col overflow-y-auto"}
    >
      <div className="mx-auto mt-auto flex w-full max-w-3xl flex-col py-3">
        {days.map((day) => (
          <section key={day.key} aria-label={day.label}>
            <h3 className="sticky top-0 z-10 mx-4 my-2 bg-paper/95 py-1 text-center text-xs font-semibold tracking-wide text-ink-faint">
              <span className="rounded-full border border-line bg-paper-raised px-3 py-1">{day.label}</span>
            </h3>
            {groupMessages(day.messages).map((group) =>
              group.messages[0]?.system ? (
                <div key={group.id}>
                  {group.messages.map((message) => (
                    <p key={message.id} className="px-6 py-2 text-center text-xs text-ink-soft">
                      <Phone className="mr-1 inline size-3.5 align-text-bottom" aria-hidden="true" />
                      {message.body}
                      <span className="sr-only">, {absoluteTime(message.createdAt)}</span>
                    </p>
                  ))}
                </div>
              ) : (
                <MessageGroupView
                  key={group.id}
                  group={group}
                  allMessages={messages}
                  inThread={mode === "thread"}
                  coarse={coarse}
                />
              ),
            )}
          </section>
        ))}
        <div />
        {mode === "channel" && pending > 0 ? (
          <div className="sticky bottom-3 z-20 flex justify-center">
            <button
              type="button"
              onClick={() => {
                const el = scroller.current;
                if (!el) return;
                el.scrollTop = el.scrollHeight;
                nearBottom.current = true;
                setPending(0);
              }}
              className="rounded-full bg-accent px-3 py-2 text-xs font-semibold text-accent-ink shadow-pop focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              New messages
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MessageGroupView({
  group,
  allMessages,
  inThread,
  coarse,
}: {
  group: MessageGroup;
  allMessages: Message[];
  inThread: boolean;
  coarse: boolean;
}) {
  const alwaysShowTime = useOrbit((state) => state.alwaysShowTime);
  const presence = useOrbit((state) => state.presence);
  const author = userById(group.authorId);
  const yours = group.authorId === YOU;

  return (
    <div className={cn("relative px-2 py-0.5", yours && "bg-accent/5")}>
      {yours ? <span className="absolute top-1 bottom-1 left-0 w-1 rounded-full bg-accent" aria-hidden="true" /> : null}
      {group.messages.map((message, index) => (
        <MessageRow
          key={message.id}
          message={message}
          grouped={index > 0}
          showTime={index === 0 || alwaysShowTime}
          authorName={author.name}
          yours={yours}
          presence={presence}
          replies={inThread ? 0 : replyCount(allMessages, message.id)}
          inThread={inThread}
          coarse={coarse}
        />
      ))}
    </div>
  );
}

function MessageRow({
  message,
  grouped,
  showTime,
  authorName,
  yours,
  presence,
  replies,
  inThread,
  coarse,
}: {
  message: Message;
  grouped: boolean;
  showTime: boolean;
  authorName: string;
  yours: boolean;
  presence: Presence;
  replies: number;
  inThread: boolean;
  coarse: boolean;
}) {
  const highlightId = useOrbit((state) => state.highlightId);
  const saved = useOrbit((state) => state.savedIds.includes(message.id));
  const [menu, setMenu] = useState<"react" | "more" | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.body);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [picking, setPicking] = useState(false);
  const [dock, setDock] = useState<"top" | "bottom">("top");
  const [engaged, setEngaged] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const fullTime = absoluteTime(message.createdAt);

  function placeToolbar() {
    const top = articleRef.current?.getBoundingClientRect().top ?? 0;
    setDock(top < 96 ? "bottom" : "top");
  }

  function release(event: FocusEvent) {
    const next = event.relatedTarget;
    if (next instanceof Node && articleRef.current?.contains(next)) return;
    if (next instanceof Element && next.closest("[role='menu'], [data-radix-popper-content-wrapper]")) return;
    setEngaged(false);
  }

  const actionable = coarse || engaged || menu !== null;

  return (
    <article
      ref={articleRef}
      id={`msg-${message.id}`}
      onMouseEnter={placeToolbar}
      onFocus={() => {
        setEngaged(true);
        placeToolbar();
      }}
      onBlur={release}
      tabIndex={coarse ? undefined : 0}
      className={cn(
        "group relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-2 rounded-md px-2 py-1 hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        highlightId === message.id && "bg-accent/10",
        menu && "bg-ink/5",
      )}
    >
      <div className="relative pt-0.5">
        {grouped ? (
          <time
            dateTime={message.createdAt}
            title={fullTime}
            className={cn(
              "absolute top-1 right-0 left-0 text-center text-xs text-ink-faint tabular-nums",
              showTime ? "block" : "hidden group-hover:block group-focus-within:block",
            )}
          >
            {gutterTime(message.createdAt)}
            <span className="sr-only">, {fullTime}</span>
          </time>
        ) : (
          <Avatar userId={message.authorId} selfPresence={presence} showPresence={false} />
        )}
      </div>
      <div className="min-w-0">
        {grouped ? null : (
          <header className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-sm font-semibold">{authorName}</span>
            {yours ? <span className="text-xs font-medium text-ink-faint">You</span> : null}
            <time dateTime={message.createdAt} title={fullTime} className="text-xs text-ink-faint tabular-nums">
              {timeLabel(message.createdAt)}
              <span className="sr-only">, {fullTime}</span>
            </time>
            {message.editedAt ? <span className="text-xs text-ink-faint">(edited)</span> : null}
            {message.pinned ? <span className="text-xs font-medium text-ink-soft">Pinned</span> : null}
          </header>
        )}
        {editing ? (
          <form
            className="mt-1"
            onSubmit={(event) => {
              event.preventDefault();
              useOrbit.getState().editMessage(message.id, draft);
              setEditing(false);
            }}
          >
            <label className="sr-only" htmlFor={`edit-${message.id}`}>
              Edit message
            </label>
            <textarea
              id={`edit-${message.id}`}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  setEditing(false);
                  setDraft(message.body);
                }
                if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              className="min-h-16 w-full rounded-md border border-line bg-paper-raised px-2 py-2 text-sm outline-none focus-visible:border-accent"
            />
            <div className="mt-1 flex gap-2">
              <button
                type="submit"
                disabled={!draft.trim()}
                className="rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-ink disabled:opacity-40"
              >
                Save
              </button>
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-line"
                onClick={() => {
                  setEditing(false);
                  setDraft(message.body);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <MessageBody text={message.body} />
        )}
        {grouped && message.editedAt ? <span className="text-xs text-ink-faint">(edited)</span> : null}
        {message.attachments?.map((file) => (
          <p
            key={file.id}
            className="mt-2 inline-flex max-w-full items-center gap-2 rounded-md border border-line bg-paper-raised px-3 py-2 text-sm"
          >
            <span className="truncate font-medium">{file.name}</span>
            <span className="text-xs text-ink-faint tabular-nums">{formatBytes(file.size)}</span>
          </p>
        ))}
        <ReactionRow message={message} />
        {replies > 0 ? (
          <button
            type="button"
            onClick={() => useOrbit.getState().openThread(message.id)}
            className="mt-1 inline-flex items-center gap-1 rounded-md px-1 py-1 text-xs font-semibold text-accent hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <MessageSquare className="size-3.5" aria-hidden="true" />
            {replies} {replies === 1 ? "reply" : "replies"}
          </button>
        ) : null}
      </div>
      <div
        className={cn(
          "absolute right-2 z-20 flex items-center gap-0.5 rounded-md border border-line bg-paper-raised p-0.5 shadow-pop",
          dock === "bottom" ? "top-full mt-1" : "top-0 -translate-y-1/2",
          menu
            ? "pointer-events-auto opacity-100"
            : !coarse &&
              "pointer-events-none opacity-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100",
        )}
      >
        <Popover.Root open={menu === "react"} onOpenChange={(open) => setMenu(open ? "react" : null)}>
          <Popover.Trigger asChild>
            <ActionButton label="React" tabIndex={actionable ? 0 : -1} className={coarse ? "hidden" : undefined}>
              <Smile className="size-4" />
            </ActionButton>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side={dock === "bottom" ? "bottom" : "top"}
              align="end"
              className="orbit-pop z-50 grid grid-cols-8 gap-1 rounded-lg border border-line bg-paper-raised p-2 shadow-pop"
            >
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  aria-label={`React with ${emoji}`}
                  className="inline-flex size-8 items-center justify-center rounded-md hover:bg-line focus-visible:outline-2 focus-visible:outline-accent"
                  onClick={() => {
                    useOrbit.getState().toggleReaction(message.id, emoji);
                    setMenu(null);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        {inThread ? null : (
          <ActionButton
            label="Reply in thread"
            tabIndex={actionable ? 0 : -1}
            className={coarse ? "hidden" : undefined}
            onClick={() => useOrbit.getState().openThread(message.id)}
          >
            <MessageSquare className="size-4" />
          </ActionButton>
        )}
        <ActionButton
          label={saved ? "Remove from Later" : "Save for later"}
          pressed={saved}
          tabIndex={actionable ? 0 : -1}
          className={coarse ? "hidden" : undefined}
          onClick={() => useOrbit.getState().toggleSaved(message.id)}
        >
          <Bookmark className={cn("size-4", saved && "fill-current")} />
        </ActionButton>
        <DropdownMenu.Root
          open={menu === "more"}
          onOpenChange={(open) => {
            setMenu(open ? "more" : null);
            if (!open) {
              setConfirmDelete(false);
              setPicking(false);
            }
          }}
        >
          <DropdownMenu.Trigger asChild>
            <ActionButton label="More actions" tabIndex={actionable ? 0 : -1} className={coarse ? "size-11" : undefined}>
              <MoreHorizontal className="size-4" />
            </ActionButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              className="orbit-pop z-50 min-w-44 rounded-lg border border-line bg-paper-raised p-1 text-sm shadow-pop"
            >
              {picking ? (
                <div className="grid grid-cols-8 gap-1 p-1">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      aria-label={`React with ${emoji}`}
                      className="inline-flex size-8 items-center justify-center rounded-md hover:bg-line focus-visible:outline-2 focus-visible:outline-accent"
                      onClick={() => {
                        useOrbit.getState().toggleReaction(message.id, emoji);
                        setMenu(null);
                        setPicking(false);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              ) : confirmDelete ? (
                <div className="px-2 py-2">
                  <p className="text-sm font-medium">Delete this message?</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      autoFocus
                      className="rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      onClick={() => {
                        useOrbit.getState().deleteMessage(message.id);
                        setMenu(null);
                        toast("Message deleted", {
                          action: {
                            label: "Undo",
                            onClick: () => useOrbit.getState().undoDelete(message.id),
                          },
                        });
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="rounded-md px-2 py-1 text-xs font-medium text-ink-soft hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      onClick={() => setConfirmDelete(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {coarse ? (
                    <MenuItem
                      onSelect={(event) => {
                        event.preventDefault();
                        setPicking(true);
                      }}
                    >
                      <Smile className="size-4" aria-hidden="true" />
                      Add reaction
                    </MenuItem>
                  ) : null}
                  {coarse && !inThread ? (
                    <MenuItem onSelect={() => useOrbit.getState().openThread(message.id)}>
                      <MessageSquare className="size-4" aria-hidden="true" />
                      Reply in thread
                    </MenuItem>
                  ) : null}
                  {coarse ? (
                    <MenuItem onSelect={() => useOrbit.getState().toggleSaved(message.id)}>
                      <Bookmark className="size-4" aria-hidden="true" />
                      {saved ? "Remove from Later" : "Save for later"}
                    </MenuItem>
                  ) : null}
                  <MenuItem onSelect={() => void copyMessageLink(message)}>
                    <Copy className="size-4" aria-hidden="true" />
                    Copy link
                  </MenuItem>
                  {yours ? (
                    <MenuItem
                      onSelect={() => {
                        setDraft(message.body);
                        setEditing(true);
                      }}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      Edit
                    </MenuItem>
                  ) : null}
                  {yours ? (
                    <MenuItem
                      onSelect={(event) => {
                        event.preventDefault();
                        setConfirmDelete(true);
                      }}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Delete
                    </MenuItem>
                  ) : null}
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </article>
  );
}

function ReactionRow({ message }: { message: Message }) {
  if (message.reactions.length === 0) return null;
  return (
    <div className="mt-1 flex max-w-full flex-wrap gap-1">
      {message.reactions.map((reaction) => {
        const mine = reaction.userIds.includes(YOU);
        const names = reaction.userIds.map((id) => (id === YOU ? "You" : userById(id).name)).join(", ");
        return (
          <button
            key={reaction.emoji}
            type="button"
            aria-pressed={mine}
            aria-label={`${reaction.emoji}, ${reaction.userIds.length}. ${names}. ${mine ? "Remove your reaction" : "Add your reaction"}`}
            onClick={() => useOrbit.getState().toggleReaction(message.id, reaction.emoji)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              mine ? "border-accent bg-accent/10 font-semibold" : "border-line bg-paper-raised",
            )}
          >
            <span aria-hidden="true">{reaction.emoji}</span>
            {reaction.userIds.length}
          </button>
        );
      })}
    </div>
  );
}

async function copyMessageLink(message: Message) {
  const url = `${location.origin}${location.pathname}#${message.conversationId}/${message.id}`;
  try {
    await navigator.clipboard.writeText(url);
    toast("Link copied");
  } catch {
    toast("Couldn’t copy the link");
  }
}

const ActionButton = forwardRef<
  HTMLButtonElement,
  { label: string; pressed?: boolean } & Omit<ComponentPropsWithoutRef<"button">, "aria-label" | "aria-pressed">
>(function ActionButton({ label, pressed, className, onClick, children, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      {...props}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      {children}
    </button>
  );
});

function MenuItem({ children, onSelect }: { children: ReactNode; onSelect: (event: Event) => void }) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 outline-none data-highlighted:bg-line"
    >
      {children}
    </DropdownMenu.Item>
  );
}

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(hover: none)");
    const apply = () => setCoarse(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return coarse;
}
