import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "@nursenest/db";
if (process.env["NODE_ENV"] === "production") throw new Error("Never run session checks against production.");
const email = `session-${randomUUID()}@example.test`;
const password = randomUUID() + "Aa1!";
const origin = process.env["SMOKE_WEB_ORIGIN"] || "http://localhost:80";
const cookies = new Map<string, string>();
let id: string | undefined;
function collect(response: Response) {
  for (const cookie of response.headers.getSetCookie()) {
    const pair = cookie.split(";")[0]!;
    const split = pair.indexOf("=");
    cookies.set(pair.slice(0, split), pair.slice(split + 1));
  }
}
function cookieHeader() { return [...cookies].map(([key, value]) => `${key}=${value}`).join("; "); }
try {
  const registered = await fetch("http://127.0.0.1:8080/api/v1/auth/register", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role: "PATIENT", fullName: "Session Test", dateOfBirth: "1990-01-01" }),
  });
  assert.equal(registered.status, 201);
  id = (await registered.json()).data.user.id;
  const csrf = await fetch(`${origin}/api/auth/csrf`);
  collect(csrf);
  const { csrfToken } = await csrf.json();
  const callback = await fetch(`${origin}/api/auth/callback/credentials`, {
    method: "POST", redirect: "manual",
    headers: { Cookie: cookieHeader(), "Content-Type": "application/x-www-form-urlencoded", "X-Auth-Return-Redirect": "1" },
    body: new URLSearchParams({ csrfToken, email, password, callbackUrl: `${origin}/dashboard/patient` }),
  });
  collect(callback);
  assert.equal(callback.status, 200);
  const session = await fetch(`${origin}/api/auth/session`, { headers: { Cookie: cookieHeader() } });
  collect(session);
  const body = await session.json();
  assert.equal(body.user?.id, id, "NextAuth credentials session must contain the correct user");
  assert.equal(body.user?.role, "PATIENT");
  const protectedApi = await fetch(`${origin}/api/v1/patients/me`, { headers: { Cookie: cookieHeader() } });
  assert.equal(protectedApi.status, 200, "Next middleware must forward the session access token");
  const forbidden = await fetch(`${origin}/api/v1/admin/stats`, { headers: { Cookie: cookieHeader() } });
  assert.equal(forbidden.status, 403);
  const dashboard = await fetch(`${origin}/dashboard/patient`, { headers: { Cookie: cookieHeader() } });
  assert.equal(dashboard.status, 200);
  const anon = await fetch(`${origin}/api/v1/patients/me`);
  assert.equal(anon.status, 401);
  const csrfOut = await fetch(`${origin}/api/auth/csrf`, { headers: { Cookie: cookieHeader() } });
  collect(csrfOut);
  const out = await fetch(`${origin}/api/auth/signout`, {
    method: "POST", headers: { Cookie: cookieHeader(), "Content-Type": "application/x-www-form-urlencoded", "X-Auth-Return-Redirect": "1" },
    body: new URLSearchParams({ csrfToken: (await csrfOut.json()).csrfToken, callbackUrl: `${origin}/login` }),
  });
  assert.equal(out.status, 200);
  assert.equal(await prisma.sessionToken.count({ where: { value: id } }), 0, "Sign-out must revoke the refresh session");
  process.stdout.write("PASS: NextAuth login, session, authenticated API forwarding, role restriction, dashboard response and logout revocation.\n");
} finally {
  if (id) {
    await prisma.sessionToken.deleteMany({ where: { value: id } });
    await prisma.patientProfile.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });
  }
  await prisma.$disconnect();
}
