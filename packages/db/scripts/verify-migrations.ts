import { PrismaClient } from "@prisma/client";
import { readdir, readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
if (process.env["NODE_ENV"] === "production") throw new Error("Never run migration verification against production.");
const prisma = new PrismaClient();
const name = "verify_" + randomUUID().replaceAll("-", "");
const base = new URL("../prisma/migrations/", import.meta.url);
try {
  await prisma.$transaction(async tx => {
    await tx.$executeRawUnsafe(`CREATE SCHEMA "${name}"`);
    await tx.$executeRawUnsafe(`SET LOCAL search_path TO "${name}"`);
    for (const dir of (await readdir(base, { withFileTypes: true })).filter(d => d.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
      const sql = await readFile(new URL(`${dir.name}/migration.sql`, base), "utf8");
      for (const statement of sql.split(";").map(s => s.trim()).filter(Boolean)) await tx.$executeRawUnsafe(statement);
    }
    await tx.$executeRawUnsafe(`DROP SCHEMA "${name}" CASCADE`);
  }, { timeout: 30000 });
  process.stdout.write("PASS: Migration history applies cleanly in an isolated temporary schema.\n");
} finally { await prisma.$disconnect(); }
