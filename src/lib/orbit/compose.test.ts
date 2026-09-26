import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { markdownLink, workspaceNameError } from "./compose.ts";

describe("markdownLink", () => {
  it("uses the address as the label when no text is selected", () => {
    assert.deepEqual(markdownLink("", "https://example.com/orbit-checklist"), {
      markdown: "[https://example.com/orbit-checklist](https://example.com/orbit-checklist)",
    });
  });

  it("wraps selected text and rejects non-http addresses", () => {
    assert.deepEqual(markdownLink("launch checklist", "https://example.com/orbit-checklist"), {
      markdown: "[launch checklist](https://example.com/orbit-checklist)",
    });
    assert.deepEqual(markdownLink("", "javascript:alert(1)"), {
      error: "Use an http or https address.",
    });
    assert.deepEqual(markdownLink("notes", "notes.txt"), {
      error: "Use an http or https address.",
    });
  });
});

describe("workspaceNameError", () => {
  it("requires a name and rejects a workspace that already exists", () => {
    assert.equal(workspaceNameError("   ", ["Orbit"]), "Name the workspace first.");
    assert.equal(workspaceNameError(" orbit ", ["Orbit", "Lumen"]), "That workspace already exists.");
    assert.equal(workspaceNameError("Northstar", ["Orbit", "Lumen"]), null);
  });
});
