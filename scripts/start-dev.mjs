#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { constants as osConstants } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const FIRST_PORT = 8080;
const LAST_PORT = 8199;
const RESERVED_PORT = 8081;

function candidatePorts() {
  const ports = new Set();
  const requested = Number(process.env.APP_PORT);
  if (
    Number.isInteger(requested) &&
    requested >= FIRST_PORT &&
    requested <= LAST_PORT &&
    requested !== RESERVED_PORT
  ) {
    ports.add(requested);
  }
  for (let port = FIRST_PORT; port <= LAST_PORT; port += 1) {
    if (port !== RESERVED_PORT) ports.add(port);
  }
  return [...ports];
}

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.listen({ host: "0.0.0.0", port, exclusive: true }, () => {
      server.close(() => resolve(true));
    });
  });
}

async function findAvailablePort() {
  for (const port of candidatePorts()) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No available dev port found between ${FIRST_PORT} and ${LAST_PORT} (8081 is reserved).`);
}

async function main() {
  const port = await findAvailablePort();
  console.log(`[dev] using port ${port}`);

  const child = spawn(
    process.execPath,
    ["scripts/with-app-env.mjs", "vite", "dev", "--host", "0.0.0.0"],
    {
      cwd: ROOT,
      env: { ...process.env, APP_PORT: String(port) },
      stdio: "inherit",
    },
  );

  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
    process.on(signal, () => child.kill(signal));
  }
  child.on("error", (error) => {
    console.error(`[dev] failed to start Vite: ${error.message}`);
    process.exitCode = 1;
  });
  child.on("exit", (code, signal) => {
    const signalNumber = signal ? osConstants.signals[signal] : undefined;
    process.exitCode = signalNumber ? 128 + signalNumber : (code ?? 1);
  });
}

main().catch((error) => {
  console.error(`[dev] ${error.message}`);
  process.exitCode = 1;
});
