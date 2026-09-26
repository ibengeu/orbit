// Only http(s) addresses become links. Other schemes never enter a draft.
export function markdownLink(label: string, url: string): { markdown: string } | { error: string } {
  const href = url.trim();
  if (!/^https?:\/\//i.test(href) || /[\s)]/.test(href)) {
    return { error: "Use an http or https address." };
  }
  const text = label.trim().replace(/[[\]]/g, "") || href;
  return { markdown: `[${text}](${href})` };
}

export function workspaceNameError(name: string, existingNames: string[]): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Name the workspace first.";
  const taken = existingNames.some((item) => item.trim().toLowerCase() === trimmed.toLowerCase());
  if (taken) return "That workspace already exists.";
  return null;
}
