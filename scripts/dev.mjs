import { spawn } from "node:child_process";

const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";

const backend = spawn(`${npmCmd} run dev --workspace=backend`, {
  stdio: "inherit",
  shell: true,
});

const frontend = spawn(`${npmCmd} run dev --workspace=frontend`, {
  stdio: "inherit",
  shell: true,
});

function cleanup() {
  if (backend && !backend.killed) {
    try {
      backend.kill("SIGTERM");
    } catch {}
  }
  if (frontend && !frontend.killed) {
    try {
      frontend.kill("SIGTERM");
    } catch {}
  }
}

process.on("SIGINT", () => {
  cleanup();
  process.exit(0);
});

process.on("SIGTERM", () => {
  cleanup();
  process.exit(0);
});

backend.on("exit", (code) => {
  if (code && code !== 0) {
    console.error(`Backend process exited with code ${code}`);
  }
});

frontend.on("exit", (code) => {
  if (code && code !== 0) {
    console.error(`Frontend process exited with code ${code}`);
  }
});

