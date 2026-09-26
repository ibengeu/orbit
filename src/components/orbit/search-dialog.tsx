import { useEffect, useState, type ReactNode } from "react";
import { Command } from "cmdk";
import { Hash, MessageSquare, UserRound, X } from "lucide-react";
import {
  conversationTitle,
  conversationsOf,
  snippet,
  userById,
} from "@/lib/orbit/derive";
import { useOrbit } from "@/lib/orbit/store";
import { YOU } from "@/lib/orbit/seed";
import type { Conversation, Message } from "@/lib/orbit/types";

const LIMIT = 5;

export function SearchDialog({ messages }: { messages: Message[] }) {
  const open = useOrbit((state) => state.searchOpen);
  const scopeId = useOrbit((state) => state.searchScopeId);
  const recentIds = useOrbit((state) => state.recentIds);
  const conversationId = useOrbit((state) => state.conversationId);
  const extraConversations = useOrbit((state) => state.extraConversations);
  const conversations = conversationsOf(extraConversations).filter((item) => item.workspaceId === "orbit");
  const scope = conversations.find((item) => item.id === scopeId) ?? null;
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [more, setMore] = useState({ channels: false, people: false, messages: false });

  useEffect(() => {
    if (!open) {
      setQuery("");
      setDebounced("");
    }
  }, [open]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 200);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setMore({ channels: false, people: false, messages: false });
  }, [query, scopeId]);

  const q = debounced.trim().toLowerCase();
  const channels = conversations.filter((item) => item.kind === "channel");
  const people = peopleIn(conversations);
  const channelHits = (q ? channels.filter((item) => includes(item.name, q) || includes(item.description, q)) : []).sort(
    (a, b) => rankText(`${a.name} ${a.description}`, q) - rankText(`${b.name} ${b.description}`, q),
  );
  const peopleHits = (q
    ? people.filter((person) => includes(person.name, q) || includes(person.handle, q) || includes(person.title, q))
    : []
  ).sort((a, b) => rankText(a.name, q) - rankText(b.name, q));
  const messageHits = (q
    ? messages.filter((message) => {
        if (scope && message.conversationId !== scope.id) return false;
        if (!conversations.some((item) => item.id === message.conversationId)) return false;
        const where = whereLabel(conversations, message.conversationId);
        return includes(message.body, q) || includes(userById(message.authorId).name, q) || includes(where, q);
      })
    : []
  ).sort((a, b) => rankText(a.body, q) - rankText(b.body, q) || b.createdAt.localeCompare(a.createdAt));
  const recent = recentConversations(conversations, recentIds, conversationId);
  const nothing = Boolean(q) && channelHits.length + peopleHits.length + messageHits.length === 0;

  return (
    <Command.Dialog
      open={open}
      onOpenChange={useOrbit.getState().setSearchOpen}
      label="Search Orbit"
      shouldFilter={false}
      vimBindings={false}
      overlayClassName="fixed inset-0 z-40 bg-ink/40"
      contentClassName="orbit-search orbit-pop"
    >
      <div className="flex items-center border-b border-line">
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder={scope ? `Search ${scopeName(scope)}` : "Search Orbit"}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ink-faint"
        />
        <button
          type="button"
          className="mr-2 inline-flex h-11 items-center rounded-md px-3 text-sm font-medium text-ink-soft hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
          onClick={() => useOrbit.getState().setSearchOpen(false)}
        >
          Close
        </button>
      </div>
      {scope ? (
        <div className="flex items-center gap-2 border-b border-line px-4 py-2">
          <span className="rounded-full bg-line px-2 py-1 text-xs font-medium">In {scopeName(scope)}</span>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-ink-soft hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            onClick={() => useOrbit.getState().openSearch(null)}
          >
            <X className="size-3.5" aria-hidden="true" />
            Search all of Orbit
          </button>
        </div>
      ) : null}
      <Command.List className="p-2">
        {nothing ? (
          <div className="px-3 py-8 text-center text-sm text-ink-soft">No results for “{query.trim()}”</div>
        ) : null}
        {!q ? (
          <Command.Group heading="Recent">
            {recent.map((conversation) => (
              <ConversationResult key={conversation.id} conversation={conversation} />
            ))}
          </Command.Group>
        ) : null}
        {q ? (
          <ResultGroup
            heading="Channels"
            items={channelHits}
            expanded={more.channels}
            onMore={() => setMore((state) => ({ ...state, channels: true }))}
            render={(conversation) => <ConversationResult key={conversation.id} conversation={conversation} />}
          />
        ) : null}
        {q ? (
          <ResultGroup
            heading="People"
            items={peopleHits}
            expanded={more.people}
            onMore={() => setMore((state) => ({ ...state, people: true }))}
            render={(person) => (
              <Command.Item
                key={person.id}
                value={`person ${person.id}`}
                onSelect={() => {
                  const dm = dmFor(conversations, person.id);
                  if (dm) useOrbit.getState().openConversation(dm.id);
                  useOrbit.getState().setSearchOpen(false);
                }}
                className="mt-1 flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-ink data-[selected=true]:bg-line"
              >
                <UserRound className="size-4 text-ink-faint" aria-hidden="true" />
                <span className="font-medium">{person.name}</span>
                <span className="truncate text-ink-faint">{person.title}</span>
              </Command.Item>
            )}
          />
        ) : null}
        {q ? (
          <ResultGroup
            heading="Messages"
            items={messageHits}
            expanded={more.messages}
            onMore={() => setMore((state) => ({ ...state, messages: true }))}
            render={(message) => {
              const where = whereLabel(conversations, message.conversationId);
              return (
                <Command.Item
                  key={message.id}
                  value={`message ${message.id}`}
                  onSelect={() => {
                    useOrbit.getState().focusMessage(message.id);
                    useOrbit.getState().setSearchOpen(false);
                  }}
                  className="mt-1 flex cursor-pointer items-start gap-2 rounded-md px-2 py-2 text-sm text-ink data-[selected=true]:bg-line"
                >
                  <MessageSquare className="mt-0.5 size-4 shrink-0 text-ink-faint" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {userById(message.authorId).name} · {where}
                    </span>
                    <span className="block truncate text-ink-soft">
                      <Highlight text={snippet(message.body)} query={q} />
                    </span>
                  </span>
                </Command.Item>
              );
            }}
          />
        ) : null}
      </Command.List>
    </Command.Dialog>
  );
}

function ResultGroup<T>({
  heading,
  items,
  expanded,
  onMore,
  render,
}: {
  heading: string;
  items: T[];
  expanded: boolean;
  onMore: () => void;
  render: (item: T) => ReactNode;
}) {
  if (items.length === 0) return null;
  const shown = expanded ? items : items.slice(0, LIMIT);
  return (
    <Command.Group heading={heading} className="mt-2">
      {shown.map((item) => render(item))}
      {!expanded && items.length > LIMIT ? (
        <button
          type="button"
          className="mt-1 w-full rounded-md px-2 py-2 text-left text-xs font-semibold text-accent hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onClick={onMore}
        >
          Show {items.length - LIMIT} more
        </button>
      ) : null}
    </Command.Group>
  );
}

function ConversationResult({ conversation }: { conversation: Conversation }) {
  const label = conversation.kind === "channel" ? `#${conversation.name}` : conversationTitle(conversation);
  return (
    <Command.Item
      value={`conversation ${conversation.id}`}
      onSelect={() => {
        useOrbit.getState().openConversation(conversation.id);
        useOrbit.getState().setSearchOpen(false);
      }}
      className="mt-1 flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-ink data-[selected=true]:bg-line"
    >
      {conversation.kind === "channel" ? (
        <Hash className="size-4 text-ink-faint" aria-hidden="true" />
      ) : (
        <MessageSquare className="size-4 text-ink-faint" aria-hidden="true" />
      )}
      <span className="truncate">{label}</span>
    </Command.Item>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  const needle = query.trim();
  const index = needle ? text.toLowerCase().indexOf(needle.toLowerCase()) : -1;
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark className="bg-accent/20 text-inherit">{text.slice(index, index + needle.length)}</mark>
      {text.slice(index + needle.length)}
    </>
  );
}

function rankText(text: string, query: string) {
  const value = text.toLowerCase();
  if (!query) return 3;
  if (value === query) return 0;
  if (value.startsWith(query)) return 1;
  if (value.includes(query)) return 2;
  return 3;
}

function includes(value: string, query: string) {
  return value.toLowerCase().includes(query);
}

function scopeName(conversation: Conversation) {
  return conversation.kind === "channel" ? `#${conversation.name}` : conversationTitle(conversation);
}

function whereLabel(conversations: Conversation[], id: string) {
  const conversation = conversations.find((item) => item.id === id);
  if (!conversation) return "Message";
  return conversation.kind === "channel" ? `#${conversation.name}` : conversationTitle(conversation);
}

function peopleIn(conversations: Conversation[]) {
  const ids = new Set<string>();
  for (const conversation of conversations) {
    const members = conversation.kind === "channel" ? conversation.memberIds : conversation.participantIds;
    for (const id of members) ids.add(id);
  }
  return [...ids].filter((id) => id !== YOU).map((id) => userById(id));
}

function dmFor(conversations: Conversation[], userId: string) {
  return (
    conversations.find((conversation) => conversation.kind === "dm" && !conversation.title && conversation.participantIds.includes(userId)) ??
    conversations.find((conversation) => conversation.kind === "dm" && conversation.participantIds.includes(userId))
  );
}

function recentConversations(conversations: Conversation[], recentIds: string[], currentId: string) {
  const ids = recentIds.length > 0 ? recentIds : [currentId, "general", "product", "design"];
  const unique = [...new Set(ids)];
  return unique
    .map((id) => conversations.find((item) => item.id === id))
    .filter((item): item is Conversation => Boolean(item))
    .slice(0, LIMIT);
}
