import { buildApp } from "./app.js";
import { env, assertProductionSecrets } from "./config/env.js";

async function main() {
  assertProductionSecrets();
  const app = await buildApp();
  await app.listen({ port: env.port, host: env.host });
  for (const signal of ["SIGTERM", "SIGINT"]) {
    process.once(signal, async () => {
      await app.close();
      process.exit(0);
    });
  }
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : "API startup failed"}\n`);
  process.exit(1);
});
