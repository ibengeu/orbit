import { forwardRef, useEffect, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Bold, Code, Italic, Link2, Paperclip, Send, Smile, X } from "lucide-react";
import { markdownLink } from "@/lib/orbit/compose";
import { formatBytes } from "@/lib/orbit/derive";
import { forgetFile, rememberFile, fileUrl } from "@/lib/orbit/media";
import { EMOJIS } from "@/lib/orbit/seed";
import { useOrbit } from "@/lib/orbit/store";
import type { Attachment } from "@/lib/orbit/types";
import { cn } from "@/lib/utils";

const MAX_HEIGHT = 192;
const MAX_BODY = 4000;
const NO_FILES: Attachment[] = [];

export function Composer({
  draftKey,
  placeholder,
  fieldId,
  conversationId,
  parentId,
  labelledBy,
}: {
  draftKey: string;
  placeholder: string;
  fieldId?: string;
  conversationId: string;
  parentId?: string;
  labelledBy?: string;
}) {
  const draft = useOrbit((state) => state.drafts[draftKey] ?? "");
  const attachments = useOrbit((state) => state.draftAttachments[draftKey] ?? NO_FILES);
  const setDraft = useOrbit((state) => state.setDraft);
  const setDraftAttachments = useOrbit((state) => state.setDraftAttachments);
  const sendMessage = useOrbit((state) => state.sendMessage);
  const field = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const caret = useRef({ start: 0, end: 0 });
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [formatOpen, setFormatOpen] = useState(true);
  const [fileError, setFileError] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const liveFile = attachments.some((file) => fileUrl(file.id));
  const inputId = fieldId ?? draftKey;
  const canSend = (draft.trim().length > 0 || liveFile) && draft.length <= MAX_BODY;

  useEffect(() => {
    const node = field.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${Math.min(node.scrollHeight, MAX_HEIGHT)}px`;
  }, [draft, draftKey]);

  function remember() {
    const node = field.current;
    if (!node) return;
    caret.current = { start: node.selectionStart ?? draft.length, end: node.selectionEnd ?? draft.length };
  }

  function range() {
    const node = field.current;
    if (node && document.activeElement === node) {
      return { start: node.selectionStart ?? 0, end: node.selectionEnd ?? 0 };
    }
    return caret.current;
  }

  function write(next: string, selection?: [number, number]) {
    setDraft(draftKey, next);
    if (selection) caret.current = { start: selection[0], end: selection[1] };
    requestAnimationFrame(() => {
      const node = field.current;
      if (!node) return;
      node.focus();
      if (selection) node.setSelectionRange(selection[0], selection[1]);
    });
  }

  function insert(text: string) {
    const body = useOrbit.getState().drafts[draftKey] ?? "";
    const { start, end } = range();
    const next = body.slice(0, start) + text + body.slice(end);
    const cursor = start + text.length;
    write(next, [cursor, cursor]);
  }

  function wrap(before: string, after: string) {
    const body = useOrbit.getState().drafts[draftKey] ?? "";
    const { start, end } = range();
    const selected = body.slice(start, end);
    const next = `${body.slice(0, start)}${before}${selected}${after}${body.slice(end)}`;
    const cursor = start + before.length;
    write(next, selected ? [cursor, cursor + selected.length] : [cursor, cursor]);
  }

  function send() {
    const raw = useOrbit.getState().drafts[draftKey] ?? "";
    const body = raw.replace(/^(?:[ \t]*\r?\n)+/, "").replace(/(?:\r?\n[ \t]*)+$/, "");
    const files = (useOrbit.getState().draftAttachments[draftKey] ?? []).filter((file) => fileUrl(file.id));
    if ((!body.trim() && files.length === 0) || raw.length > MAX_BODY) return;
    sendMessage({ conversationId, body, parentId, attachments: files, draftKey });
  }

  return (
    <div className="rounded-lg border border-line bg-paper-raised focus-within:border-accent">
      {fileError ? <p className="px-3 pt-2 text-xs text-danger">{fileError}</p> : null}
      {draft.length >= 3500 ? (
        <p className="px-3 pt-2 text-xs text-ink-soft">{draft.length} / {MAX_BODY}</p>
      ) : null}
      {attachments.length > 0 ? (
        <ul className="flex flex-wrap gap-2 px-3 pt-3" aria-label="Attachments">
          {attachments.map((file) => (
            <li
              key={file.id}
              className="inline-flex max-w-full items-center gap-2 rounded-md border border-line bg-paper px-2 py-1 text-xs"
            >
              <Paperclip className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{file.name}</span>
              <span className="text-ink-faint tabular-nums">{formatBytes(file.size)}</span>
              {fileUrl(file.id) ? null : <span className="text-ink-soft">File unavailable. Remove it and attach it again.</span>}
              <button
                type="button"
                className="rounded-sm p-1 text-ink-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label={`Remove ${file.name}`}
                onClick={() => {
                  forgetFile(file.id);
                  setDraftAttachments(draftKey, attachments.filter((item) => item.id !== file.id));
                }}
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <label className="sr-only" htmlFor={inputId}>
        {placeholder}
      </label>
      <textarea
        id={inputId}
        ref={field}
        aria-labelledby={labelledBy}
        rows={1}
        value={draft}
        placeholder={placeholder}
        onSelect={remember}
        onKeyUp={remember}
        onBlur={remember}
        onChange={(event) => {
          const value = event.target.value.slice(0, MAX_BODY);
          setDraft(draftKey, value);
          const node = event.target;
          node.style.height = "auto";
          node.style.height = `${Math.min(node.scrollHeight, MAX_HEIGHT)}px`;
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            send();
          }
        }}
        className="max-h-48 min-h-11 w-full resize-none overflow-y-auto bg-transparent px-3 py-3 text-sm leading-normal outline-none placeholder:text-ink-faint"
      />
      <div className="flex flex-wrap items-center gap-1 px-2 pb-2">
        <Popover.Root open={emojiOpen} onOpenChange={setEmojiOpen}>
          <Popover.Trigger asChild>
            <ToolbarButton label="Insert emoji">
              <Smile className="size-4" />
            </ToolbarButton>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="top"
              align="start"
              className="orbit-pop z-50 grid w-64 grid-cols-8 gap-1 rounded-lg border border-line bg-paper-raised p-2 shadow-pop"
            >
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-md text-base hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  aria-label={`Insert ${emoji}`}
                  onClick={() => {
                    insert(emoji);
                    setEmojiOpen(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <ToolbarButton label="Attach a file" onClick={() => fileRef.current?.click()}>
          <Paperclip className="size-4" />
        </ToolbarButton>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif,application/pdf,text/plain"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif", "application/pdf", "text/plain"].includes(file.type);
            if (!allowed || !file.size || file.size > 10 * 1024 * 1024) {
              const message = !allowed
                ? "Choose an image, PDF, or plain text file."
                : "That file is larger than 10 MB.";
              setFileError(message);
              useOrbit.getState().announce(message);
              return;
            }
            setFileError(null);
            const current = useOrbit.getState().draftAttachments[draftKey] ?? [];
            current.forEach((item) => forgetFile(item.id));
            const id = crypto.randomUUID();
            rememberFile(id, file);
            setDraftAttachments(draftKey, [{ id, name: file.name, size: file.size }]);
          }}
        />
        <ToolbarButton label={formatOpen ? "Hide formatting" : "Show formatting"} aria-pressed={formatOpen} onClick={() => setFormatOpen((value) => !value)}>
          <Bold className="size-4" />
        </ToolbarButton>
        {formatOpen ? (
          <>
        <ToolbarButton label="Bold" onClick={() => wrap("**", "**")}>
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Italic" onClick={() => wrap("*", "*")}>
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Code" onClick={() => wrap("`", "`")}>
          <Code className="size-4" />
        </ToolbarButton>
        <Popover.Root
          open={linkOpen}
          onOpenChange={(open) => {
            setLinkOpen(open);
            if (!open) setLinkError(null);
          }}
        >
          <Popover.Trigger asChild>
            <ToolbarButton label="Insert link">
              <Link2 className="size-4" />
            </ToolbarButton>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              side="top"
              align="start"
              className="orbit-pop z-50 w-72 rounded-lg border border-line bg-paper-raised p-3 shadow-pop"
            >
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const body = useOrbit.getState().drafts[draftKey] ?? "";
                  const { start, end } = range();
                  const selected = body.slice(start, end);
                  const result = markdownLink(selected, linkUrl);
                  if ("error" in result) {
                    setLinkError(result.error);
                    return;
                  }
                  const next = body.slice(0, start) + result.markdown + body.slice(end);
                  const cursor = start + result.markdown.length;
                  write(next, [cursor, cursor]);
                  setLinkError(null);
                  setLinkOpen(false);
                  setLinkUrl("https://");
                }}
              >
                <label htmlFor={`${draftKey}-link`} className="text-xs font-medium text-ink-soft">
                  Link address
                </label>
                <input
                  id={`${draftKey}-link`}
                  value={linkUrl}
                  onChange={(event) => {
                    setLinkUrl(event.target.value);
                    setLinkError(null);
                  }}
                  className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-2 text-sm outline-none focus-visible:border-accent"
                  aria-invalid={linkError ? true : undefined}
                  aria-describedby={linkError ? `${draftKey}-link-error` : undefined}
                />
                {linkError ? (
                  <p id={`${draftKey}-link-error`} role="alert" className="mt-1 text-xs text-danger">
                    {linkError}
                  </p>
                ) : null}
                <button
                  type="submit"
                  className="mt-2 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Insert
                </button>
              </form>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
          </>
        ) : null}
        <span className="ml-auto hidden text-xs text-ink-faint sm:inline">Shift + Enter for a new line</span>
        <button
          type="button"
          aria-label="Send message"
          disabled={!canSend}
          onClick={send}
          className="inline-flex size-11 items-center justify-center rounded-md bg-accent text-accent-ink hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 lg:size-8"
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
}

const ToolbarButton = forwardRef<
  HTMLButtonElement,
  { label: string; children: ReactNode } & Omit<ComponentPropsWithoutRef<"button">, "aria-label" | "children">
>(function ToolbarButton({ label, children, className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      {...props}
      aria-label={label}
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-md text-ink-soft hover:bg-line hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:size-8",
        className,
      )}
    >
      {children}
    </button>
  );
});
