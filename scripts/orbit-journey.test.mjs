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
  page.setDefaultTimeout(4000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
    await page.locator("#composer").waitFor();
    await page.getByRole("button", { name: "Lumen", exact: true }).click();

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
    await page.locator("#composer").waitFor();
    await page.getByRole("button", { name: "Lumen", exact: true }).click();
    await page.getByRole("button", { name: "Search #general" }).click();
    await page.getByRole("combobox").fill("research notes");

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
    await page.locator("#composer").waitFor();
    await page.getByRole("button", { name: "Lumen", exact: true }).click();
    await page.getByRole("navigation", { name: "Sidebar" }).getByRole("button", { name: /Search/ }).click();
    await page.getByRole("combobox").fill("Mina");
    await page.getByRole("option", { name: /Mina Brooks/ }).first().click();

    assert.equal(await page.locator("#conversation-title").innerText(), "Mina Brooks");
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
  page.setDefaultTimeout(4000);
  try {
    await page.goto(`http://127.0.0.1:${serverPort}/`, { waitUntil: "domcontentloaded" });
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
