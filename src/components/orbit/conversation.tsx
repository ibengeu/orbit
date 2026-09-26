import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Hash, Menu, Mic, Pin, Search, Users, Video } from "lucide-react";
import { Avatar } from "@/components/orbit/avatar";
import { Composer } from "@/components/orbit/composer";
import { MessageList } from "@/components/orbit/messages";
import {
  conversationById,
  conversationTitle,
  conversationsOf,
  memberIds,
  peopleLabel,
  presenceLabel,
  presenceOf,
  userById,
} from "@/lib/orbit/derive";
import { YOU } from "@/lib/orbit/seed";
import { useOrbit } from "@/lib/orbit/store";
import type { Conversation, Message, Presence } from "@/lib/orbit/types";

export function ConversationPane({ messages }: { messages: Message[] }) {
  const conversationId = useOrbit((state) => state.conversationId);
  const extra = useOrbit((state) => state.extraConversations);
  const presence = useOrbit((state) => state.presence);
  const conversation = conversationById(conversationsOf(extra), conversationId);

  return (
    <section id="conversation" aria-label="Conversation" tabIndex={-1} className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-paper outline-none">
      {conversation ? (
        <>
          <a
            href="#composer"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-16 focus:z-30 focus:rounded-md focus:bg-paper-raised focus:px-3 focus:py-2 focus:shadow-pop"
          >
            Skip to composer
          </a>
          <ConversationHeader conversation={conversation} messages={messages} presence={presence} />
        </>
      ) : (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-3">
          <MenuButton />
          <h1 className="text-base font-semibold">Direct messages</h1>
        </header>
      )}
      {conversation ? (
        <>
          <PinnedBanner messages={messages} conversationId={conversation.id} />
          <MessageList
            conversationId={conversation.id}
            messages={messages}
            emptyTitle={
              conversation.kind === "channel"
                ? `This is the start of #${conversation.name}`
                : `This is the start of your conversation`
            }
            emptyBody={
              conversation.kind === "channel"
                ? conversation.description
                : "Say hello. Messages stay on this device."
            }
          />
          <div className="shrink-0 px-4 pt-2 pb-4">
            <Composer
              draftKey={conversation.id}
              fieldId="composer"
              conversationId={conversation.id}
              placeholder={
                conversation.kind === "channel"
                  ? `Message #${conversation.name}`
                  : `Message ${
                      conversation.participantIds.filter((id) => id !== YOU).length === 1
                        ? userById(conversation.participantIds.find((id) => id !== YOU) ?? "").name.split(" ")[0]
                        : conversationTitle(conversation)
                    }`
              }
            />
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center px-6 text-center">
          <div className="max-w-sm">
            <h2 className="text-lg font-semibold">No direct messages yet</h2>
            <p className="mt-2 text-sm text-ink-soft">This workspace only has channels. Switch back to Orbit for the launch conversations.</p>
          </div>
        </div>
      )}
    </section>
  );
}

function condensedNames(ids: string[]) {
  const names = ids.map((id) => userById(id).name.split(" ")[0] ?? "");
  if (names.length <= 2) return names.join(" and ");
  return `${names.slice(0, 2).join(", ")}, +${names.length - 2} more`;
}

function MenuButton() {
  return (
    <button
      type="button"
      aria-label="Open navigation"
      onClick={() => useOrbit.getState().setNavOpen(true)}
      className="inline-flex size-11 items-center justify-center rounded-md text-ink hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
    >
      <Menu className="size-5" />
    </button>
  );
}

function ConversationHeader({
  conversation,
  messages,
  presence,
}: {
  conversation: Conversation;
  messages: Message[];
  presence: Presence;
}) {
  const title = conversationTitle(conversation);
  const members = memberIds(conversation);
  const others = members.filter((id) => id !== YOU);
  const subtitle =
    conversation.kind === "channel"
      ? conversation.description
      : others.length === 1
        ? `${userById(others[0] ?? "").title} · ${presenceLabel(presenceOf(others[0] ?? "", presence))}`
        : condensedNames(others);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-3 lg:px-4">
      <MenuButton />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {conversation.kind === "channel" ? (
          <Hash className="size-4 shrink-0 text-ink-soft" aria-hidden="true" />
        ) : others.length > 1 ? (
          <span className="flex shrink-0 -space-x-2">
            {others.slice(0, 3).map((id) => (
              <Avatar key={id} userId={id} selfPresence={presence} size="sm" />
            ))}
          </span>
        ) : (
          <Avatar userId={others[0] ?? YOU} selfPresence={presence} size="sm" showPresence />
        )}
        <div className="min-w-0">
          <h1 id="conversation-title" title={title} className="truncate text-base font-semibold">
            {conversation.kind === "channel" ? title : title}
          </h1>
          <p title={subtitle} className="truncate text-xs text-ink-faint">{subtitle}</p>
        </div>
      </div>
      <DetailsButton conversation={conversation} messages={messages} presence={presence} count={members.length} />
      {conversation.kind === "dm" ? <CallButtons conversation={conversation} title={title} /> : null}
      <button
        type="button"
        aria-label={`Search ${conversation.kind === "channel" ? `#${conversation.name}` : title}`}
        onClick={() => useOrbit.getState().openSearch(conversation.id)}
        className="inline-flex size-11 items-center justify-center rounded-md text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:size-8"
      >
        <Search className="size-4" />
      </button>
    </header>
  );
}

function CallButtons({ conversation, title }: { conversation: Conversation; title: string }) {
  if (conversation.kind !== "dm") return null;
  const count = memberIds(conversation).length;
  const disabled = count > 8;
  const reason = disabled ? "Calls are limited to 8 people in this demo." : undefined;
  return (
    <>
      <button
        type="button"
        aria-label={`Voice call with ${title}`}
        title={reason}
        disabled={disabled}
        onClick={() => useOrbit.getState().requestCall(conversation.id, "voice")}
        className="inline-flex size-11 items-center justify-center rounded-md text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40"
      >
        <Mic className="size-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label={`Video call with ${title}`}
        title={reason}
        disabled={disabled}
        onClick={() => useOrbit.getState().requestCall(conversation.id, "video")}
        className="inline-flex size-11 items-center justify-center rounded-md text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40"
      >
        <Video className="size-4" aria-hidden="true" />
      </button>
    </>
  );
}

function PinnedBanner({ messages, conversationId }: { messages: Message[]; conversationId: string }) {
  const pinned = messages.find((message) => message.conversationId === conversationId && message.pinned && !message.parentId);
  if (!pinned) return null;
  return (
    <button
      type="button"
      onClick={() => useOrbit.getState().highlight(pinned.id)}
      className="flex items-center gap-2 border-b border-line px-4 py-2 text-left text-sm hover:bg-ink/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
    >
      <Pin className="size-4 shrink-0 text-ink-soft" aria-hidden="true" />
      <span className="truncate">{pinned.body}</span>
    </button>
  );
}

function DetailsButton({
  conversation,
  messages,
  presence,
  count,
}: {
  conversation: Conversation;
  messages: Message[];
  presence: Presence;
  count: number;
}) {
  const [open, setOpen] = useState(false);
  const pinned = messages.find((message) => message.conversationId === conversation.id && message.pinned);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={`Details, ${count} members`}
          className="inline-flex h-11 items-center gap-1 rounded-md px-2 text-xs font-medium text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:h-9"
        >
          <Users className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Details</span>
          <span className="tabular-nums">{count}</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          className="orbit-pop z-40 w-80 rounded-lg border border-line bg-paper-raised p-4 text-sm shadow-pop"
        >
          <h2 className="text-base font-semibold">
            {conversation.kind === "channel" ? `#${conversation.name}` : conversationTitle(conversation)}
          </h2>
          <p className="mt-1 text-ink-soft">
            {conversation.kind === "channel" ? conversation.description : peopleLabel(memberIds(conversation))}
          </p>
          <p className="mt-3 text-xs font-semibold tracking-wide text-ink-faint uppercase">{count} members</p>
          <ul className="mt-2 max-h-56 space-y-2 overflow-y-auto">
            {memberIds(conversation).map((id) => {
              const user = userById(id);
              const state = presenceOf(id, presence);
              return (
                <li key={id} className="flex items-center gap-2">
                  <Avatar userId={id} selfPresence={presence} size="sm" showPresence />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{user.name}</span>
                    <span className="block truncate text-xs text-ink-faint">
                      {user.title} · {presenceLabel(state)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          {pinned ? (
            <button
              type="button"
              className="mt-3 w-full rounded-md border border-line px-3 py-2 text-left hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              onClick={() => {
                useOrbit.getState().highlight(pinned.id);
                setOpen(false);
              }}
            >
              <span className="text-xs font-semibold text-ink-faint">Pinned</span>
              <span className="mt-1 block truncate">{pinned.body}</span>
            </button>
          ) : null}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
