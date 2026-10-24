import { spawn } from "node:child_process";

// Reuse the project's established session secret without exposing it to the browser.
const authSecret = process.env.AUTH_SECRET || process.env.SESSION_SECRET;
if (!authSecret) throw new Error("AUTH_SECRET or SESSION_SECRET must be configured.");
const port = process.env.PORT || "3000";
const child = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", process.argv.includes("--production") ? "start" : "dev", "-H", "0.0.0.0", "-p", port],
  { stdio: "inherit", env: { ...process.env, AUTH_SECRET: authSecret, AUTH_TRUST_HOST: "true" } },
);
for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, () => child.kill(signal));
child.on("exit", code => process.exit(code ?? 1));
