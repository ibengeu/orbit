import { useEffect, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, Bookmark, ChevronDown, Hash, House, MessageSquare, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/orbit/avatar";
import {
  conversationTitle,
  conversationsOf,
  presenceLabel,
  unreadMeta,
  userById,
} from "@/lib/orbit/derive";
import { YOU } from "@/lib/orbit/seed";
import { useOrbit } from "@/lib/orbit/store";
import type { Conversation, Message } from "@/lib/orbit/types";
import { cn } from "@/lib/utils";

export function OrbitMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="3.2" fill="currentColor" />
      <ellipse cx="16" cy="16" rx="12" ry="5" fill="none" stroke="currentColor" strokeWidth="1.6" transform="rotate(-24 16 16)" />
      <ellipse cx="16" cy="16" rx="12" ry="5" fill="none" stroke="currentColor" strokeWidth="1.6" transform="rotate(58 16 16)" />
    </svg>
  );
}

const SAMPLE_WORKSPACES = [
  { id: "orbit", name: "Orbit", live: true },
  { id: "lumen", name: "Lumen", live: false },
  { id: "field", name: "Field", live: false },
] as const;

export function WorkspaceRail() {
  const presence = useOrbit((state) => state.presence);
  const goHome = useOrbit((state) => state.goHome);

  return (
    <nav aria-label="Workspaces" className="flex h-full w-rail shrink-0 flex-col items-center gap-3 bg-plum py-3 text-paper">
      <div className="flex w-full flex-1 flex-col items-center gap-2">
        {SAMPLE_WORKSPACES.map((workspace) =>
          workspace.live ? (
            <button
              key={workspace.id}
              type="button"
              aria-current="true"
              aria-label={workspace.name}
              onClick={goHome}
              className="relative inline-flex size-11 items-center justify-center rounded-lg bg-paper text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
            >
              <span className="absolute -left-3 h-5 w-1 rounded-full bg-paper" aria-hidden="true" />
              <OrbitMark className="size-6" />
            </button>
          ) : (
            <RailNotice key={workspace.id} label={workspace.name} message="Coming soon">
              <WorkspaceGlyph id={workspace.id} />
            </RailNotice>
          ),
        )}
        <RailNotice label="Add a workspace" message="Not available in this demo">
          <Plus className="size-5" />
        </RailNotice>
      </div>
      <ProfileMenu>
        <button
          type="button"
          aria-label="Your profile"
          className="relative rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        >
          <Avatar userId={YOU} selfPresence={presence} showPresence />
        </button>
      </ProfileMenu>
    </nav>
  );
}

function WorkspaceGlyph({ id }: { id: string }) {
  if (id === "lumen") {
    return (
      <svg viewBox="0 0 32 32" className="size-6" aria-hidden="true">
        <circle cx="14" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M18 10a7 7 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" className="size-6" aria-hidden="true">
      <rect x="8" y="8" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="18" y="8" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="8" y="18" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="18" y="18" width="6" height="6" rx="1" fill="currentColor" />
    </svg>
  );
}

function RailNotice({ label, message, children }: { label: string; message: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={label}
        onClick={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex size-11 items-center justify-center rounded-lg border border-plum-line bg-plum-raised text-plum-muted hover:bg-plum-hover hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
      >
        {children}
      </button>
      {open ? (
        <span
          role="tooltip"
          className="absolute top-1/2 left-full z-50 ml-2 -translate-y-1/2 rounded-md bg-paper px-2 py-1 text-xs font-medium whitespace-nowrap text-ink shadow-pop"
        >
          {message}
        </span>
      ) : null}
    </span>
  );
}

export function Sidebar({ messages, onNavigate }: { messages: Message[]; onNavigate?: () => void }) {
  const conversationId = useOrbit((state) => state.conversationId);
  const view = useOrbit((state) => state.view);
  const collapsed = useOrbit((state) => state.collapsed);
  const extraConversations = useOrbit((state) => state.extraConversations);
  const lastRead = useOrbit((state) => state.lastRead);
  const conversations = conversationsOf(extraConversations).filter((item) => item.workspaceId === "orbit");
  const channels = conversations.filter((item) => item.kind === "channel");
  const dms = conversations.filter((item) => item.kind === "dm");
  const current = conversations.find((item) => item.id === conversationId);
  const [mod, setMod] = useState("Ctrl");

  useEffect(() => {
    setMod(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl");
  }, []);

  return (
    <nav aria-label="Sidebar" className="flex h-full min-h-0 w-full flex-col bg-plum-raised text-paper">
      <div className="flex items-center gap-2 px-3 py-3">
        <WorkspaceMenu name="Orbit" />
      </div>
      <div className="px-3 pb-2">
        <button
          type="button"
          onClick={() => {
            useOrbit.getState().openSearch(null);
            onNavigate?.();
          }}
          className="flex h-11 w-full items-center gap-2 rounded-md border border-plum-line bg-plum px-3 text-left text-sm text-plum-muted hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        >
          <Search className="size-4" aria-hidden="true" />
          <span className="flex-1">Search</span>
          <kbd className="rounded-sm border border-plum-line px-1.5 py-0.5 text-xs">{mod} K</kbd>
        </button>
      </div>
      <div className="flex flex-col gap-0.5 px-2">
        <NavButton
          icon={<House className="size-4" />}
          label="Home"
          active={view === "conversation" && current?.kind === "channel"}
          onClick={() => {
            useOrbit.getState().goHome();
            onNavigate?.();
          }}
        />
        <NavButton
          icon={<MessageSquare className="size-4" />}
          label="DMs"
          active={view === "conversation" && (!current || current.kind === "dm")}
          onClick={() => {
            useOrbit.getState().goDms();
            onNavigate?.();
          }}
        />
        <NavButton
          icon={<Bell className="size-4" />}
          label="Activity"
          active={view === "activity"}
          onClick={() => useOrbit.getState().setView("activity")}
        />
        <NavButton
          icon={<Bookmark className="size-4" />}
          label="Later"
          active={view === "later"}
          onClick={() => useOrbit.getState().setView("later")}
        />
      </div>
      <div className="mt-3 min-h-0 flex-1 overflow-y-auto px-2 pb-4">
        <Section
          label="Channels"
          collapsed={collapsed.channels}
          unread={channels.reduce((sum, channel) => sum + unreadMeta(messages, channel.id, lastRead[channel.id]).unread, 0)}
          containsActive={view === "conversation" && channels.some((channel) => channel.id === conversationId)}
          onToggle={() => useOrbit.getState().toggleSection("channels")}
          onAdd={() => useOrbit.getState().setChannelDialog(true)}
        >
          {channels.map((channel) => (
            <ConversationButton
              key={channel.id}
              conversation={channel}
              active={view === "conversation" && conversationId === channel.id}
              meta={unreadMeta(messages, channel.id, lastRead[channel.id])}
              onClick={() => {
                useOrbit.getState().openConversation(channel.id);
                onNavigate?.();
              }}
            />
          ))}
        </Section>
        <Section
          label="Direct messages"
          collapsed={collapsed.dms}
          unread={dms.reduce((sum, dm) => sum + unreadMeta(messages, dm.id, lastRead[dm.id]).unread, 0)}
          containsActive={view === "conversation" && dms.some((dm) => dm.id === conversationId)}
          onToggle={() => useOrbit.getState().toggleSection("dms")}
        >
          {dms.length === 0 ? (
            <p className="px-2 py-2 text-sm text-plum-faint">No direct messages yet.</p>
          ) : (
            dms.map((dm) => (
              <ConversationButton
                key={dm.id}
                conversation={dm}
                active={view === "conversation" && conversationId === dm.id}
                meta={unreadMeta(messages, dm.id, lastRead[dm.id])}
                onClick={() => {
                  useOrbit.getState().openConversation(dm.id);
                  onNavigate?.();
                }}
              />
            ))
          )}
        </Section>
      </div>
    </nav>
  );
}

function markFromTitle(title: string) {
  const parts = title.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return (parts[0] ?? "G").slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function NavButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "flex h-11 items-center gap-2 rounded-md px-2 text-left text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper lg:h-9",
        active ? "bg-paper font-semibold text-ink" : "text-plum-muted hover:bg-plum-hover hover:text-paper",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Section({
  label,
  collapsed,
  unread = 0,
  containsActive = false,
  onToggle,
  onAdd,
  children,
}: {
  label: string;
  collapsed: boolean;
  unread?: number;
  containsActive?: boolean;
  onToggle: () => void;
  onAdd?: () => void;
  children: ReactNode;
}) {
  return (
    <section className="mt-3">
      <div className="flex items-center">
        <button
          type="button"
          aria-expanded={!collapsed}
          onClick={onToggle}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-1 rounded-md px-1 py-1 text-left text-xs font-semibold tracking-wide uppercase hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper",
            collapsed && containsActive ? "text-paper" : "text-plum-faint",
          )}
        >
          <ChevronDown className={cn("size-3.5 shrink-0 transition-transform duration-quick", collapsed && "-rotate-90")} />
          <span className="truncate">{label}</span>
          {collapsed && containsActive ? <span className="sr-only">, contains the open conversation</span> : null}
          {collapsed && unread > 0 ? (
            <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-paper px-1.5 text-xs font-semibold text-ink tabular-nums">
              <span className="sr-only">{unread} unread</span>
              <span aria-hidden="true">{unread}</span>
            </span>
          ) : null}
        </button>
        {onAdd ? (
          <button
            type="button"
            aria-label={`Add to ${label}`}
            onClick={onAdd}
            className="inline-flex size-8 items-center justify-center rounded-md text-plum-faint hover:bg-plum-hover hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          >
            <Plus className="size-4" />
          </button>
        ) : null}
      </div>
      {collapsed ? null : <div className="mt-1 flex flex-col gap-0.5">{children}</div>}
    </section>
  );
}

function ConversationButton({
  conversation,
  active,
  meta,
  onClick,
}: {
  conversation: Conversation;
  active: boolean;
  meta: { unread: number; mention: boolean };
  onClick: () => void;
}) {
  const presence = useOrbit((state) => state.presence);
  const title = conversationTitle(conversation);
  const unread = meta.unread > 0;
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "flex h-11 w-full items-center gap-2 rounded-md px-2 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper lg:h-8",
        active
          ? "bg-paper font-semibold text-ink"
          : unread
            ? "font-semibold text-paper hover:bg-plum-hover"
            : "font-medium text-plum-muted hover:bg-plum-hover hover:text-paper",
      )}
    >
      {conversation.kind === "channel" ? (
        <Hash className="size-3.5 shrink-0" aria-hidden="true" />
      ) : conversation.title || conversation.participantIds.length > 2 ? (
        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-plum text-xs font-semibold text-paper">
          {markFromTitle(conversation.title ?? "Group")}
        </span>
      ) : (
        <Avatar
          userId={conversation.participantIds.find((id) => id !== YOU) ?? YOU}
          selfPresence={presence}
          size="sm"
          showPresence={conversation.participantIds.filter((id) => id !== YOU).length === 1}
        />
      )}
      <span className="min-w-0 flex-1 truncate" title={title}>
        {title}
        {unread ? <span className="sr-only">{meta.mention ? ", mention" : ", unread"}</span> : null}
      </span>
      {unread ? (
        <span className="inline-flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
          {meta.mention ? (
            <span className="rounded-sm bg-accent px-1 text-xs font-semibold text-accent-ink">@</span>
          ) : null}
          <span className="text-xs tabular-nums">{meta.unread}</span>
        </span>
      ) : null}
    </button>
  );
}

function WorkspaceMenu({ name }: { name: string }) {
  const menu = useOrbit((state) => state.menu);
  return (
    <DropdownMenu.Root
      open={menu === "workspace"}
      onOpenChange={(open) => useOrbit.getState().setMenu(open ? "workspace" : null)}
    >
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-1 rounded-md px-1 py-1 text-left text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
        >
          <span className="truncate">{name}</span>
          <ChevronDown className="size-4 shrink-0 text-plum-faint" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          className="orbit-pop z-50 w-64 rounded-lg border border-line bg-paper-raised p-1 text-sm text-ink shadow-pop"
        >
          {SAMPLE_WORKSPACES.map((workspace) => (
            <DropdownMenu.Item
              key={workspace.id}
              onSelect={() => {
                if (workspace.live) useOrbit.getState().goHome();
                else toast(`${workspace.name} is coming soon.`);
              }}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 outline-none data-highlighted:bg-line"
            >
              <span className="inline-flex size-6 items-center justify-center rounded-md bg-plum text-paper">
                {workspace.id === "orbit" ? <OrbitMark className="size-4" /> : workspace.name.slice(0, 1)}
              </span>
              <span className="flex-1 truncate">{workspace.name}</span>
              <span className="text-xs text-ink-faint">{workspace.live ? "Current" : "Coming soon"}</span>
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator className="my-1 h-px bg-line" />
          <DropdownMenu.Item
            onSelect={() => toast("Not available in this demo.")}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 outline-none data-highlighted:bg-line"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add a workspace
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export function ProfileMenu({ children }: { children: ReactNode }) {
  const menu = useOrbit((state) => state.menu);
  const presence = useOrbit((state) => state.presence);
  const status = useOrbit((state) => state.status);
  const you = userById(YOU);
  return (
    <DropdownMenu.Root
      open={menu === "profile"}
      onOpenChange={(open) => useOrbit.getState().setMenu(open ? "profile" : null)}
    >
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="right"
          align="end"
          className="orbit-pop z-50 w-64 rounded-lg border border-line bg-paper-raised p-1 text-sm text-ink shadow-pop"
        >
          <div className="px-2 py-2">
            <p className="font-semibold">{you.name}</p>
            <p className="text-xs text-ink-soft">
              {you.title} · {presenceLabel(presence)}
              {status ? ` · ${status}` : ""}
            </p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-line" />
          <DropdownMenu.RadioGroup
            value={presence}
            onValueChange={(value) => useOrbit.getState().setPresence(value as typeof presence)}
          >
            {(["online", "away", "offline"] as const).map((value) => (
              <DropdownMenu.RadioItem
                key={value}
                value={value}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 outline-none data-highlighted:bg-line data-[state=checked]:font-semibold"
              >
                <span className="inline-flex size-4 items-center justify-center">
                  <DropdownMenu.ItemIndicator>
                    <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                  </DropdownMenu.ItemIndicator>
                </span>
                {presenceLabel(value)}
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Separator className="my-1 h-px bg-line" />
          <MenuAction onSelect={() => useOrbit.getState().setStatusDialog(true)}>Set a status</MenuAction>
          <MenuAction onSelect={() => useOrbit.getState().setView("later")}>Saved for later</MenuAction>
          <MenuAction onSelect={() => useOrbit.getState().setPrefsDialog(true)}>Preferences</MenuAction>
          <MenuAction
            onSelect={() => {
              if (!window.confirm("Reset demo data on this device? Messages you sent will be removed.")) return;
              useOrbit.getState().resetDemo();
              toast("Demo data restored.");
            }}
          >
            Reset demo data
          </MenuAction>
          <MenuAction
            onSelect={() => toast("You’re Rowan Hale on this device. Signing out isn’t connected.")}
          >
            Sign out
          </MenuAction>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function MenuAction({ children, onSelect }: { children: ReactNode; onSelect: () => void }) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      className="cursor-pointer rounded-md px-2 py-2 outline-none data-highlighted:bg-line"
    >
      {children}
    </DropdownMenu.Item>
  );
}

export function MobileNav({ messages }: { messages: Message[] }) {
  const open = useOrbit((state) => state.navOpen);
  return (
    <Dialog.Root open={open} onOpenChange={useOrbit.getState().setNavOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40 md:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="orbit-pop fixed inset-0 z-50 flex bg-plum outline-none md:hidden"
        >
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <WorkspaceRail />
          <div className="min-w-0 flex-1">
            <Sidebar
              messages={messages}
              onNavigate={() => useOrbit.getState().setNavOpen(false)}
            />
          </div>
          <Dialog.Close
            aria-label="Close navigation"
            className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-md text-paper hover:bg-plum-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          >
            <X className="size-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
