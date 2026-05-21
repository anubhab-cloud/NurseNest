import { buildApp } from "./app.js";
import { env, assertProductionSecrets } from "./config/env.js";

async function main() {
  assertProductionSecrets();
  const app = await buildApp();
  await app.listen({ port: env.port, host: env.host });
  console.log(`API listening on http://${env.host}:${env.port}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
