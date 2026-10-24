import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "@nursenest/db";
import { buildApp } from "../src/app.js";

if (process.env["NODE_ENV"] === "production") throw new Error("Smoke checks must never run against production.");
const app = await buildApp();
const run = `smoke-${randomUUID()}`;
const password = randomUUID() + "Aa1!";
const created: string[] = [];
let checks = 0;
async function call(method: "GET" | "POST" | "PATCH" | "DELETE", url: string, token?: string, payload?: unknown, status = 200) {
  const res = await app.inject({ method, url: `/api/v1${url}`, headers: token ? { authorization: `Bearer ${token}` } : {}, payload });
  assert.equal(res.statusCode, status, `${method} ${url}: ${res.body}`);
  checks++;
  return res.json().data;
}
try {
  const patient = await call("POST", "/auth/register", undefined, { role: "PATIENT", email: `${run}@example.test`, password, fullName: "Integration Patient", dateOfBirth: "1990-01-01" }, 201);
  patient.id = patient.user.id;
  created.push(patient.id);
  const outsider = await call("POST", "/auth/register", undefined, { role: "PATIENT", email: `${run}-other@example.test`, password, fullName: "Other Patient", dateOfBirth: "1990-01-01" }, 201);
  outsider.id = outsider.user.id;
  created.push(outsider.id);
  const nurse = await call("POST", "/auth/register", undefined, { role: "NURSE", email: `${run}-nurse@example.test`, password, fullName: "Integration Nurse", certificationNumber: "TEST-ONLY", yearsExp: 1, specializations: ["Elder Care"] }, 201);
  nurse.id = nurse.user.id;
  created.push(nurse.id);
  const p = await call("POST", "/auth/login", undefined, { email: `${run}@example.test`, password });
  const n = await call("POST", "/auth/login", undefined, { email: `${run}-nurse@example.test`, password });
  const o = await call("POST", "/auth/login", undefined, { email: `${run}-other@example.test`, password });
  await call("GET", "/admin/stats", p.accessToken, undefined, 403);
  await call("GET", "/patients/me", undefined, undefined, 401);
  await call("PATCH", "/nurses/me/availability", n.accessToken, { isAvailable: true }, 403);
  const services = await call("GET", "/services");
  assert.ok(services.length > 0, "Seed the catalog before running checks");
  const input = { serviceId: services[0].id, nurseId: nurse.id, scheduledAt: new Date(Date.now() + 86400000).toISOString() };
  await call("POST", "/bookings", p.accessToken, input, 400);
  await prisma.nurseProfile.update({ where: { userId: nurse.id }, data: { isVerified: true, isAvailable: true } });
  await call("POST", "/bookings", p.accessToken, { ...input, scheduledAt: "invalid" }, 400);
  await call("POST", "/bookings", p.accessToken, { ...input, scheduledAt: "2020-01-01T00:00:00Z" }, 400);
  const booking = await call("POST", "/bookings", p.accessToken, input, 201);
  assert.equal((await prisma.invoice.findUniqueOrThrow({ where: { bookingId: booking.id } })).amount, booking.totalAmount);
  await call("POST", "/bookings", p.accessToken, input, 409);
  await call("GET", `/chat/${booking.id}`, o.accessToken, undefined, 403);
  await call("GET", `/vitals/${patient.id}`, n.accessToken, undefined, 403);
  await call("POST", `/chat/${booking.id}`, p.accessToken, { body: "Test message" }, 201);
  const thread = await call("GET", `/chat/${booking.id}`, n.accessToken);
  assert.equal(thread.messages.length, 1);
  await call("PATCH", `/bookings/${booking.id}/status`, n.accessToken, { status: "COMPLETED" }, 409);
  await call("PATCH", `/bookings/${booking.id}/status`, n.accessToken, { status: "CONFIRMED" });
  await call("GET", `/vitals/${patient.id}`, n.accessToken);
  await call("PATCH", `/bookings/${booking.id}/status`, n.accessToken, { status: "IN_PROGRESS" });
  await call("POST", `/nurse/notes/${booking.id}`, n.accessToken, { observations: "Test observation only." });
  await call("PATCH", `/bookings/${booking.id}/status`, n.accessToken, { status: "PENDING" }, 400);
  await call("DELETE", `/bookings/${booking.id}`, p.accessToken, undefined, 409);
  await call("POST", `/bookings/${booking.id}/review`, p.accessToken, { rating: 5, comment: "Test only" }, 201);
  await call("POST", `/bookings/${booking.id}/review`, p.accessToken, { rating: 5 }, 409);
  assert.equal((await call("GET", "/patients/me/notes", p.accessToken)).length, 1);
  assert.equal((await call("GET", "/patients/me/invoices", p.accessToken)).length, 1);
  if (!process.env["RAZORPAY_KEY_SECRET"]) {
    await call("POST", "/payments/create-order", p.accessToken, { bookingId: booking.id }, 503);
    await call("POST", "/payments/verify", p.accessToken, { bookingId: booking.id, razorpay_order_id: "order_fake", razorpay_payment_id: "pay_fake", razorpay_signature: "mock" }, 503);
  }
  await call("GET", "/contact", p.accessToken, undefined, 403);
  const denied = await app.inject({ method: "POST", url: "/api/v1/contact", headers: { origin: "https://attacker.invalid" }, payload: { name: "Test", email: "test@example.test", message: "This should not be saved" } });
  assert.equal(denied.statusCode, 403); checks++;
  const admin = await prisma.user.update({ where: { id: outsider.id }, data: { role: "ADMIN" } });
  // Existing tokens use the current database role, not a stale role claim.
  await call("GET", "/admin/stats", o.accessToken);
  await call("PATCH", `/admin/users/${admin.id}/status`, o.accessToken, { isActive: false }, 400);
  await prisma.user.update({ where: { id: patient.id }, data: { isActive: false } });
  await call("GET", "/patients/me", p.accessToken, undefined, 401);
  process.stdout.write(`PASS: ${checks} API checks including booking transitions, privacy, duplicate scheduling, payments failing closed and role access.\n`);
} finally {
  // Remove only records owned by this isolated run; never touch real accounts.
  await prisma.$transaction(async tx => {
    const bookings = await tx.booking.findMany({ where: { patientId: { in: created } }, select: { id: true } });
    const ids = bookings.map(b => b.id);
    await tx.chatMessage.deleteMany({ where: { bookingId: { in: ids } } });
    await tx.review.deleteMany({ where: { bookingId: { in: ids } } });
    await tx.visitNote.deleteMany({ where: { bookingId: { in: ids } } });
    await tx.invoice.deleteMany({ where: { bookingId: { in: ids } } });
    await tx.vitalRecord.deleteMany({ where: { patientId: { in: created } } });
    await tx.booking.deleteMany({ where: { id: { in: ids } } });
    await tx.notification.deleteMany({ where: { userId: { in: created } } });
    await tx.sessionToken.deleteMany({ where: { value: { in: created } } });
    await tx.patientProfile.deleteMany({ where: { userId: { in: created } } });
    await tx.nurseProfile.deleteMany({ where: { userId: { in: created } } });
    await tx.user.deleteMany({ where: { id: { in: created } } });
  });
  await app.close();
}
