import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const preferredPort = 8094;
let serverPort = preferredPort;
let devProcess;
let serverOutput = "";
let browser;

before(async () => {
  devProcess = spawn("npm", ["run", "dev"], {
    cwd: root,
    env: { ...process.env, APP_PORT: String(preferredPort) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  devProcess.stdout.on("data", (chunk) => {
    serverOutput += chunk.toString();
    const port = serverOutput.match(/\[dev\] using port (\d+)/)?.[1];
    if (port) serverPort = Number(port);
  });
  devProcess.stderr.on("data", (chunk) => {
    serverOutput += chunk.toString();
  });

  await waitForServer();
  browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
});

after(async () => {
  await browser?.close();
  if (!devProcess || devProcess.exitCode !== null) return;
  devProcess.kill("SIGTERM");
  await Promise.race([once(devProcess, "exit"), delay(3000)]);
});

test("Lumen opens and remains selected after refresh", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.locator("#composer").waitFor();
    await page.getByRole("button", { name: "Lumen", exact: true }).click();
    await page.waitForFunction(async () => Boolean((await (await fetch("/api/v1/conversations/lumen-general/read-state")).json()).lastReadAt));

    const sidebar = page.getByRole("navigation", { name: "Sidebar" });
    await sidebar.getByRole("button", { name: "Lumen", exact: true }).waitFor();
    assert.equal(await page.title(), "#general · Lumen");
    assert.match(await page.locator("body").innerText(), /A quiet second workspace, so switching is real\./);

    await page.reload({ waitUntil: "domcontentloaded" });
    await sidebar.getByRole("button", { name: "Lumen", exact: true }).waitFor();
    assert.equal(await page.title(), "#general · Lumen");
    assert.match(await page.locator("body").innerText(), /A quiet second workspace, so switching is real\./);
  } finally {
    await context.close();
  }
});

test("scoped search returns messages from the active workspace", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.locator("#composer").waitFor();
    await page.getByRole("button", { name: "Lumen", exact: true }).click();
    await page.getByRole("button", { name: "Search #general" }).click();
    await page.getByRole("combobox").fill("research notes");
    await page.waitForFunction(() => document.querySelector("[cmdk-list]")?.textContent?.includes("research notes out of Orbit"));
    const results = await page.locator("[cmdk-list]").innerText();
    assert.match(results, /research notes out of Orbit/);
    await page.getByRole("button", { name: "Search all of Lumen" }).waitFor();
  } finally {
    await context.close();
  }
});

test("selecting a person without a DM opens a new direct conversation", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.locator("#composer").waitFor();
    await page.getByRole("button", { name: "Lumen", exact: true }).click();
    await page.getByRole("navigation", { name: "Sidebar" }).getByRole("button", { name: /Search/ }).click();
    await page.getByRole("combobox").fill("Mina");
    await page.getByRole("option", { name: /Mina Brooks/ }).first().click();

    await page.getByText("Mina Brooks", { exact: true }).first().waitFor();
    await page.waitForFunction(() => document.querySelector("#conversation-title")?.textContent === "Mina Brooks");
    assert.equal(await page.locator("#conversation-title").innerText(), "Mina Brooks");
    const dmResources = await page.request.get(`http://127.0.0.1:${serverPort}/api/v1/workspaces/lumen/conversations`);
    assert.ok((await dmResources.json()).data.some((item) => item.kind === "dm" && item.participantIds.includes("mina")));
    await page.reload({ waitUntil: "domcontentloaded" });
    assert.equal(await page.locator("#conversation-title").innerText(), "Mina Brooks");
    assert.match(await page.locator("nav[aria-label='Sidebar']").innerText(), /Mina Brooks/);
  } finally {
    await context.close();
  }
});

test("creating a workspace opens it and keeps it after refresh", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.locator("#composer").waitFor();
    await page.evaluate(() => localStorage.removeItem("orbit:v1"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("#composer").waitFor();

    const rail = page.getByRole("navigation", { name: "Workspaces" });
    await rail.getByRole("button", { name: "Add a workspace" }).click();
    const dialog = page.getByRole("dialog", { name: "Create a workspace" });
    await dialog.waitFor();
    await dialog.getByRole("button", { name: "Create workspace" }).click();
    assert.match(await dialog.innerText(), /Name the workspace first/);

    await page.locator("#workspace-name").fill("Orbit");
    await dialog.getByRole("button", { name: "Create workspace" }).click();
    assert.match(await dialog.innerText(), /That workspace already exists/);

    await page.locator("#workspace-name").fill("Northstar");
    await dialog.getByRole("button", { name: "Create workspace" }).click();
    await dialog.waitFor({ state: "hidden" });
    const persisted = await page.request.get(`http://127.0.0.1:${serverPort}/api/v1/workspaces`);
    assert.ok((await persisted.json()).data.some((workspace) => workspace.name === "Northstar"));
    assert.equal(await page.locator("#conversation-title").innerText(), "general");
    assert.equal(await page.title(), "#general · Northstar");
    assert.match(await page.locator("body").innerText(), /Home for Northstar/);

    await page.reload({ waitUntil: "domcontentloaded" });
    await rail.getByRole("button", { name: "Northstar", exact: true }).waitFor();
    assert.equal(await page.title(), "#general · Northstar");
    assert.equal(await page.locator("#conversation-title").innerText(), "general");
  } finally {
    await context.close();
  }
});

test("a link inserted with no selection is visible in the transcript", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(4000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.locator("#composer").waitFor();
    await page.getByRole("button", { name: "Insert link" }).click();
    await page.locator("#general-link").fill("javascript:alert(1)");
    await page.getByRole("button", { name: "Insert", exact: true }).click();
    assert.match(await page.locator("body").innerText(), /Use an http or https address/);
    assert.equal(await page.locator("#composer").inputValue(), "");

    await page.locator("#general-link").fill("https://example.com/orbit-checklist");
    await page.getByRole("button", { name: "Insert", exact: true }).click();
    await page.locator("#composer").press("Enter");
    const link = page.locator("a[href='https://example.com/orbit-checklist']");
    await link.waitFor();
    assert.equal(await link.innerText(), "https://example.com/orbit-checklist");
  } finally {
    await context.close();
  }
});

test("search names the open workspace and saved messages stay clickable", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.locator("#composer").waitFor();
    await page.getByRole("button", { name: "Lumen", exact: true }).click();
    await page.getByRole("navigation", { name: "Sidebar" }).getByRole("button", { name: /Search/ }).click();
    assert.equal(await page.getByRole("combobox").getAttribute("placeholder"), "Search Lumen");
    await page.keyboard.press("Escape");

    await page.getByRole("navigation", { name: "Workspaces" }).getByRole("button", { name: "Orbit", exact: true }).click();
    const article = page.locator("#msg-gen-checklist");
    await article.scrollIntoViewIfNeeded();
    await article.hover();
    await article.getByRole("button", { name: "Save for later" }).click();
    await page.getByRole("navigation", { name: "Sidebar" }).getByRole("button", { name: "Later", exact: true }).click();
    assert.match(await page.getByRole("region", { name: "Later" }).innerText(), /checklist in #product/);
  } finally {
    await context.close();
  }
});

test("the demo transcript sends a message through the API and restores it after reload", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.locator("#composer").waitFor();
    const message = `API round trip ${Date.now()}`;
    await page.locator("#composer").fill(message);
    await page.locator("#composer").press("Enter");
    await page.waitForFunction(async (body) => {
      const response = await fetch("/api/v1/conversations/general/messages");
      if (!response.ok) return false;
      const collection = await response.json();
      return collection.data.some((item) => item.body === body);
    }, message);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByText(message).waitFor();
  } finally {
    await context.close();
  }
});

test("an attached file can be downloaded after the page reloads", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.locator("#composer").waitFor();
    const message = `File round trip ${Date.now()}`;
    await page.locator('input[type="file"]').setInputFiles({ name: "orbit-note.txt", mimeType: "text/plain", buffer: Buffer.from("persistent file") });
    await page.locator("#composer").fill(message);
    await page.locator("#composer").press("Enter");
    await page.waitForFunction(async (body) => {
      const response = await fetch("/api/v1/conversations/general/messages");
      const collection = await response.json();
      return collection.data.some((item) => item.body === body && item.attachments?.length === 1);
    }, message);
    await page.reload({ waitUntil: "domcontentloaded" });
    const file = page.getByText("orbit-note.txt").last().locator("..");
    await file.getByRole("button", { name: "Open" }).waitFor();
    const [download] = await Promise.all([page.waitForEvent("download"), file.getByRole("button", { name: "Open" }).click()]);
    assert.equal(download.suggestedFilename(), "orbit-note.txt");
  } finally {
    await context.close();
  }
});

test("a failed send restores the draft and reports the failure", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.locator("#composer").waitFor();
    await page.route("**/api/v1/conversations/general/messages", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      return route.fulfill({ status: 503, contentType: "application/problem+json", body: JSON.stringify({ type: "about:blank", title: "Unavailable", status: 503, detail: "Unavailable" }) });
    });
    await page.locator("#composer").fill("Please keep this draft");
    await page.locator("#composer").press("Enter");
    await page.getByText("Could not send the message. Try again.").waitFor();
    assert.equal(await page.locator("#composer").inputValue(), "Please keep this draft");
  } finally {
    await context.close();
  }
});

test("another account does not receive cached messages, workspaces, or drafts", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.addInitScript(() => {
    const firstAccountCache = JSON.stringify({
      drafts: { general: "First account private draft" },
      extraWorkspaces: [{ id: "first-private", name: "First account private workspace", initials: "FP" }],
      createdMessages: [{ id: "first-private-message", conversationId: "general", authorId: "u_me", body: "First account private message", createdAt: new Date().toISOString(), reactions: [] }],
    });
    localStorage.setItem("orbit:v1", firstAccountCache);
    localStorage.setItem("orbit:v1:first-account", firstAccountCache);
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.route("**/api/v1/me/profile", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ userId: "second-account", presence: "online", status: "" }) }));
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.locator("#composer").waitFor();
    const visible = await page.locator("body").innerText();
    assert.doesNotMatch(visible, /First account private message|First account private workspace/);
    assert.equal(await page.locator("#composer").inputValue(), "");
  } finally {
    await context.close();
  }
});

test("the verified user keeps a local draft after reload", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.locator("#composer").waitFor();
    await page.locator("#composer").fill("A private local draft");
    await page.waitForFunction(() => Boolean(localStorage.getItem("orbit:v1:public-demo")));
    await page.reload({ waitUntil: "domcontentloaded" });
    assert.equal(await page.locator("#composer").inputValue(), "A private local draft");
  } finally {
    await context.close();
  }
});

test("workspace loading reports an API failure and retries", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  let fail = true;
  await page.route("**/api/v1/workspaces", async (route) => {
    if (!fail || route.request().method() !== "GET") return route.continue();
    return route.fulfill({ status: 503, contentType: "application/problem+json", body: JSON.stringify({ type: "about:blank", title: "Unavailable", status: 503, detail: "Unavailable" }) });
  });
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.getByRole("alert").getByText(/Could not load the workspace/).waitFor();
    fail = false;
    await page.getByRole("button", { name: "Try again" }).click();
    await page.locator("#composer").waitFor();
  } finally {
    await context.close();
  }
});

test("the message composer enforces the API body limit", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.locator("#composer").fill("x".repeat(4001));
    assert.equal((await page.locator("#composer").inputValue()).length, 4000);
  } finally {
    await context.close();
  }
});

test("a thread reply persists with its parent message", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    const parent = page.locator("#msg-gen-checklist");
    await parent.scrollIntoViewIfNeeded();
    await parent.hover();
    await parent.getByRole("button", { name: "Reply in thread" }).click();
    const reply = `Thread reply ${Date.now()}`;
    await page.locator("#thread-composer").fill(reply);
    await page.locator("#thread-composer").press("Enter");
    await page.waitForFunction(async (text) => (await (await fetch("/api/v1/conversations/general/messages")).json()).data.some((item) => item.body === text && item.parentId === "gen-checklist"), reply);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator("#msg-gen-checklist").getByRole("button", { name: /reply/ }).click();
    await page.getByText(reply).waitFor();
  } finally {
    await context.close();
  }
});

test("message controls persist reaction, edit, deletion, and restore", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    const original = `Mutation test ${Date.now()}`;
    await page.locator("#composer").fill(original);
    await page.locator("#composer").press("Enter");
    const id = await page.waitForFunction(async (body) => {
      const data = await (await fetch("/api/v1/conversations/general/messages")).json();
      return data.data.find((item) => item.body === body)?.id || false;
    }, original).then((handle) => handle.jsonValue());
    const article = page.locator(`#msg-${id}`);
    await article.hover();
    await article.getByRole("button", { name: "React", exact: true }).click();
    await page.getByRole("button", { name: "React with 👍" }).click();
    await page.waitForFunction(async (messageId) => (await (await fetch(`/api/v1/messages/${messageId}`)).json()).reactions.some((item) => item.emoji === "👍"), id);
    await article.getByRole("button", { name: /Remove your reaction/ }).click();
    await page.waitForFunction(async (messageId) => !(await (await fetch(`/api/v1/messages/${messageId}`)).json()).reactions.some((item) => item.emoji === "👍"), id);
    await article.hover();
    await article.getByRole("button", { name: "Save for later" }).click();
    await page.waitForFunction(async (messageId) => (await (await fetch("/api/v1/me/saved-messages")).json()).data.some((item) => item.messageId === messageId), id);
    await article.hover();
    await article.getByRole("button", { name: "Remove from Later" }).click();
    await page.waitForFunction(async (messageId) => !(await (await fetch("/api/v1/me/saved-messages")).json()).data.some((item) => item.messageId === messageId), id);
    await article.hover();
    await article.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    await page.getByRole("textbox", { name: "Edit message" }).fill("Edited on server");
    await page.getByRole("textbox", { name: "Edit message" }).press("Enter");
    await page.waitForFunction(async (messageId) => (await (await fetch(`/api/v1/messages/${messageId}`)).json()).body === "Edited on server", id);
    await article.hover();
    await article.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await page.waitForFunction(async (messageId) => Boolean((await (await fetch(`/api/v1/messages/${messageId}`)).json()).deletedAt), id);
    await page.getByRole("button", { name: "Undo" }).click();
    await page.waitForFunction(async (messageId) => !(await (await fetch(`/api/v1/messages/${messageId}`)).json()).deletedAt, id);
  } finally {
    await context.close();
  }
});

test("immediate undo waits for deletion and remains restored after reload", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  let releaseDelete = () => {};
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    const body = `Rapid undo ${Date.now()}`;
    await page.locator("#composer").fill(body);
    await page.locator("#composer").press("Enter");
    const id = await page.waitForFunction(async (text) => {
      const data = await (await fetch("/api/v1/conversations/general/messages")).json();
      return data.data.find((item) => item.body === text)?.id || false;
    }, body).then((handle) => handle.jsonValue());
    let signalDelete;
    const deletionStarted = new Promise((resolve) => { signalDelete = resolve; });
    const deleteGate = new Promise((resolve) => { releaseDelete = resolve; });
    let restoreRequests = 0;
    await page.route(`**/api/v1/messages/${id}`, async (route) => {
      if (route.request().method() === "DELETE") {
        signalDelete();
        await deleteGate;
      }
      if (route.request().method() === "PATCH") restoreRequests += 1;
      await route.continue();
    });
    const article = page.locator(`#msg-${id}`);
    await article.hover();
    await article.getByRole("button", { name: "More actions" }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await deletionStarted;
    await page.getByRole("button", { name: "Undo" }).click();
    await page.waitForTimeout(150);
    assert.equal(restoreRequests, 0);
    const restored = page.waitForResponse((response) => response.url().endsWith(`/api/v1/messages/${id}`) && response.request().method() === "PATCH");
    releaseDelete();
    await restored;
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByText(body).waitFor();
  } finally {
    releaseDelete();
    await context.close();
  }
});

test("profile and preference controls persist through the API", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    const profileButton = page.getByRole("navigation", { name: "Workspaces" }).getByRole("button", { name: "Your profile" });
    await profileButton.click();
    await page.getByRole("menuitemradio", { name: "Away" }).click();
    await page.waitForFunction(async () => (await (await fetch("/api/v1/me/profile")).json()).presence === "away");
    await profileButton.click();
    await page.getByRole("menuitem", { name: "Set a status" }).click();
    await page.getByRole("textbox", { name: "Status" }).fill("Reviewing APIs");
    await page.getByRole("button", { name: "Save status" }).click();
    await page.waitForFunction(async () => (await (await fetch("/api/v1/me/profile")).json()).status === "Reviewing APIs");
    await profileButton.click();
    await page.getByRole("menuitem", { name: "Preferences" }).click();
    await page.getByRole("checkbox", { name: "Always show message times" }).check();
    await page.waitForFunction(async () => (await (await fetch("/api/v1/me/preferences")).json()).alwaysShowTime === true);
    await page.reload({ waitUntil: "domcontentloaded" });
    await profileButton.click();
    await page.getByRole("menuitemradio", { name: "Away" }).waitFor();
  } finally {
    await context.close();
  }
});

test("resetting the local view keeps server messages", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on("dialog", (dialog) => dialog.accept());
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.locator("#composer").waitFor();
    const body = `Keep server message ${Date.now()}`;
    await page.locator("#composer").fill(body);
    await page.locator("#composer").press("Enter");
    await page.waitForFunction(async (text) => (await (await fetch("/api/v1/conversations/general/messages")).json()).data.some((item) => item.body === text), body);
    await page.getByRole("navigation", { name: "Workspaces" }).getByRole("button", { name: "Your profile" }).click();
    await page.getByRole("menuitem", { name: "Reset local view" }).click();
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByText(body).waitFor();
  } finally {
    await context.close();
  }
});

test("a voice call records lobby and ended states on the server", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.waitForFunction(async () => (await fetch("/api/v1/workspaces/orbit")).ok);
    await page.getByRole("navigation", { name: "Sidebar" }).getByRole("button", { name: /Priya/ }).first().click();
    const createdCall = page.waitForResponse((response) => response.url().includes("/calls") && response.request().method() === "POST");
    await page.getByRole("button", { name: /Voice call with/ }).click();
    const callId = (await (await createdCall).json()).id;
    const dialog = page.getByRole("dialog", { name: /Voice/ });
    await dialog.waitFor();
    const lobby = await page.request.get(`http://127.0.0.1:${serverPort}/api/v1/calls/${callId}`);
    assert.equal((await lobby.json()).status, "lobby");
    await dialog.getByRole("button", { name: "Cancel" }).last().click();
    await dialog.waitFor({ state: "hidden" });
    const ended = await page.request.get(`http://127.0.0.1:${serverPort}/api/v1/calls/${callId}`);
    assert.equal((await ended.json()).status, "ended");
    const nextCall = page.waitForResponse((response) => response.url().includes("/calls") && response.request().method() === "POST");
    await page.getByRole("button", { name: /Voice call with/ }).click();
    const activeId = (await (await nextCall).json()).id;
    const nextDialog = page.getByRole("dialog", { name: /Voice/ });
    await nextDialog.getByRole("button", { name: "Join demo call" }).click();
    await nextDialog.getByRole("button", { name: "Join without microphone" }).click();
    await nextDialog.getByRole("button", { name: "End call" }).waitFor();
    const active = await page.request.get(`http://127.0.0.1:${serverPort}/api/v1/calls/${activeId}`);
    assert.equal((await active.json()).status, "active");
    await nextDialog.getByRole("button", { name: "End call" }).click();
    await nextDialog.waitFor({ state: "hidden" });
    const completed = await page.request.get(`http://127.0.0.1:${serverPort}/api/v1/calls/${activeId}`);
    assert.equal((await completed.json()).status, "ended");
    await page.evaluate(() => localStorage.removeItem("orbit:v1"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("navigation", { name: "Sidebar" }).getByRole("button", { name: /Priya/ }).first().click();
    await page.getByText(/Voice call ended/).last().waitFor();
  } finally {
    await context.close();
  }
});

test("pagehide ends an active call with a navigation-safe request", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.getByRole("navigation", { name: "Sidebar" }).getByRole("button", { name: /Priya/ }).first().click();
    const createdCall = page.waitForResponse((response) => response.url().includes("/calls") && response.request().method() === "POST");
    await page.getByRole("button", { name: /Voice call with/ }).click();
    const callId = (await (await createdCall).json()).id;
    const dialog = page.getByRole("dialog", { name: /Voice/ });
    await dialog.getByRole("button", { name: "Join demo call" }).click();
    await dialog.getByRole("button", { name: "Join without microphone" }).click();
    await dialog.getByRole("button", { name: "End call" }).waitFor();
    await page.evaluate(() => {
      const originalFetch = window.fetch.bind(window);
      window.__callTerminationFetches = [];
      window.fetch = (input, init) => {
        if (String(input).includes("/api/v1/calls/") && init?.method === "PATCH") {
          window.__callTerminationFetches.push({ keepalive: Boolean(init.keepalive) });
          if (!init.keepalive) return Promise.reject(new Error("A normal fetch was cancelled by navigation"));
        }
        return originalFetch(input, init);
      };
      window.dispatchEvent(new Event("pagehide"));
    });
    await page.waitForFunction(() => window.__callTerminationFetches.length > 0);
    assert.equal(await page.evaluate(() => window.__callTerminationFetches[0].keepalive), true);
    await page.waitForFunction(async (id) => (await (await fetch(`/api/v1/calls/${id}`)).json()).status === "ended", callId);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByText(/Voice call ended/).last().waitFor();
  } finally {
    await context.close();
  }
});

test("a cancelled pagehide request is retried after reload", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.getByRole("navigation", { name: "Sidebar" }).getByRole("button", { name: /Priya/ }).first().click();
    const createdCall = page.waitForResponse((response) => response.url().includes("/calls") && response.request().method() === "POST");
    await page.getByRole("button", { name: /Voice call with/ }).click();
    const callId = (await (await createdCall).json()).id;
    const dialog = page.getByRole("dialog", { name: /Voice/ });
    await dialog.getByRole("button", { name: "Join demo call" }).click();
    await dialog.getByRole("button", { name: "Join without microphone" }).click();
    await dialog.getByRole("button", { name: "End call" }).waitFor();
    await page.evaluate(() => {
      const originalFetch = window.fetch.bind(window);
      window.fetch = (input, init) => String(input).includes("/api/v1/calls/") && init?.method === "PATCH"
        ? Promise.reject(new Error("Navigation cancelled the request"))
        : originalFetch(input, init);
      window.dispatchEvent(new Event("pagehide"));
    });
    const stillActive = await page.request.get(`http://127.0.0.1:${serverPort}/api/v1/calls/${callId}`);
    assert.equal((await stillActive.json()).status, "active");
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(async (id) => (await (await fetch(`/api/v1/calls/${id}`)).json()).status === "ended", callId);
  } finally {
    await context.close();
  }
});

test("a video demo call can join without unavailable devices", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.waitForFunction(async () => (await fetch("/api/v1/workspaces/orbit")).ok);
    await page.getByRole("navigation", { name: "Sidebar" }).getByRole("button", { name: /Priya/ }).first().click();
    const createdCall = page.waitForResponse((response) => response.url().includes("/calls") && response.request().method() === "POST");
    await page.getByRole("button", { name: /Video call with/ }).click();
    const callId = (await (await createdCall).json()).id;
    const dialog = page.getByRole("dialog", { name: /Video/ });
    await dialog.getByRole("button", { name: "Join demo call" }).click();
    await dialog.getByRole("button", { name: "Join without microphone" }).click();
    await dialog.getByRole("button", { name: "End call" }).waitFor();
    const active = await page.request.get(`http://127.0.0.1:${serverPort}/api/v1/calls/${callId}`);
    assert.equal((await active.json()).status, "active");
    await dialog.getByRole("button", { name: "End call" }).click();
  } finally {
    await context.close();
  }
});

test("creating a channel persists the server conversation resource", async () => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Continue to demo" }).click();
    await page.waitForFunction(async () => (await fetch("/api/v1/workspaces/orbit")).ok);
    await page.getByRole("button", { name: "Add to Channels" }).click();
    const dialog = page.getByRole("dialog", { name: "Create a channel" });
    await dialog.getByLabel("Channel name").fill("api-review");
    await dialog.getByLabel("Description").fill("Review the API");
    await dialog.getByRole("button", { name: "Create channel" }).click();
    await dialog.waitFor({ state: "hidden" });
    const response = await page.request.get(`http://127.0.0.1:${serverPort}/api/v1/workspaces/orbit/conversations`);
    assert.ok((await response.json()).data.some((item) => item.name === "api-review"));
  } finally {
    await context.close();
  }
});

async function waitForServer() {
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    if (devProcess.exitCode !== null) throw new Error(`Dev server exited early: ${serverOutput}`);
    try {
      const response = await fetch(`http://127.0.0.1:${serverPort}/__app-env`);
      if (response.ok) return;
    } catch {
      // The listener can start after the wrapper prints its chosen port.
    }
    await delay(200);
  }
  throw new Error(`Dev server did not become ready: ${serverOutput}`);
}

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}
