import { Fragment, type ReactNode } from "react";
import { USERS } from "@/lib/orbit/seed";

const HANDLES = new Set(USERS.map((user) => user.handle));

function renderInline(text: string, depth = 0): ReactNode[] {
  const pattern =
    depth === 0
      ? /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|`([^`\n]+)`|\*\*((?:(?!\*\*).)+?)\*\*|\*([^*\n]+)\*|(https?:\/\/[^\s<]+)|\B@([a-z0-9-]+)/g
      : /`([^`\n]+)`|\*([^*\n]+)\*|(https?:\/\/[^\s<]+)/g;
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (depth === 0 && match[1] && match[2]) {
      nodes.push(
        <a key={key++} href={match[2]} target="_blank" rel="noreferrer" className="font-medium text-accent underline">
          {match[1]}
        </a>,
      );
    } else if (depth === 0 && match[3]) {
      nodes.push(<Code key={key++}>{match[3]}</Code>);
    } else if (depth === 0 && match[4]) {
      nodes.push(
        <strong key={key++} className="font-semibold">
          {renderInline(match[4], 1)}
        </strong>,
      );
    } else if (depth === 0 && match[5]) {
      nodes.push(
        <em key={key++} className="italic">
          {match[5]}
        </em>,
      );
    } else if (depth === 0 && match[6]) {
      nodes.push(<Link key={key++} href={match[6]} label={match[6]} />);
    } else if (depth === 0 && match[7] && HANDLES.has(match[7].toLowerCase())) {
      nodes.push(
        <span key={key++} className="rounded-sm bg-accent/10 px-1 font-semibold text-accent">
          @{match[7]}
        </span>,
      );
    } else if (depth > 0 && match[1]) {
      nodes.push(<Code key={key++}>{match[1]}</Code>);
    } else if (depth > 0 && match[2]) {
      nodes.push(
        <em key={key++} className="italic">
          {match[2]}
        </em>,
      );
    } else if (depth > 0 && match[3]) {
      nodes.push(<Link key={key++} href={match[3]} label={match[3]} />);
    } else {
      nodes.push(match[0]);
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function Code({ children }: { children: string }) {
  return <code className="rounded-sm bg-line px-1 py-0.5 font-mono text-xs">{children}</code>;
}

function Link({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="font-medium text-accent underline">
      {label}
    </a>
  );
}

export function MessageBody({ text }: { text: string }) {
  if (!text.trim()) return null;
  const lines = text.split("\n");
  return (
    <div className="wrap-anywhere text-sm leading-normal text-pretty">
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index > 0 ? <br /> : null}
          {line.length > 0 ? renderInline(line) : null}
        </Fragment>
      ))}
    </div>
  );
}