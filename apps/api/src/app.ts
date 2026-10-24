import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import * as Sentry from "@sentry/node";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { authRoutes } from "./routes/auth.routes.js";
import { patientsRoutes } from "./routes/patients.routes.js";
import { nursesRoutes } from "./routes/nurses.routes.js";
import { bookingsRoutes } from "./routes/bookings.routes.js";
import { vitalsRoutes } from "./routes/vitals.routes.js";
import { paymentsRoutes } from "./routes/payments.routes.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { filesRoutes } from "./routes/files.routes.js";
import { servicesRoutes } from "./routes/services.routes.js";
import { nurseDashboardRoutes } from "./routes/nurse-dashboard.routes.js";
import { registerSocket } from "./plugins/socket.js";
import { prisma } from "@nursenest/db";
import { chatRoutes } from "./routes/chat.routes.js";
import { contactRoutes } from "./routes/contact.routes.js";
import { webhooksRoutes } from "./routes/webhooks.routes.js";
import { ForbiddenError } from "@nursenest/utils";

export async function buildApp() {
  if (env.sentryDsn) {
    Sentry.init({ dsn: env.sentryDsn, environment: env.nodeEnv });
  }

  const app = Fastify({
    logger: { level: env.isProduction ? "info" : "debug", redact: ["req.headers.authorization", "req.headers.cookie", "res.headers.set-cookie"] },
    bodyLimit: 64 * 1024,
    trustProxy: "loopback",
  });

  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, {
    origin: env.webOrigin,
    credentials: true,
  });
  await app.register(cookie);
  app.addHook("onRequest", async request => {
    if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return;
    const origin = request.headers.origin;
    if (origin && env.webOrigin && origin !== env.webOrigin) throw new ForbiddenError("Origin not allowed");
    if (request.headers["sec-fetch-site"] === "cross-site") throw new ForbiddenError("Cross-site request rejected");
  });
  await app.register(rateLimit, {
    max: 300,
    timeWindow: "1 minute",
    keyGenerator: (request) => request.user?.sub ?? request.ip,
  });

  app.setErrorHandler(errorHandler);

  app.get("/health", async () => ({ ok: true }));
  app.get("/api/healthz", async (_request, reply) => {
    await prisma.$queryRaw`SELECT 1`;
    return reply.send({ status: "ok" });
  });

  await app.register(
    async (api) => {
      await api.register(authRoutes, { prefix: "/auth" });
      await api.register(patientsRoutes, { prefix: "/patients" });
      await api.register(nursesRoutes, { prefix: "/nurses" });
      await api.register(bookingsRoutes, { prefix: "/bookings" });
      await api.register(vitalsRoutes, { prefix: "/vitals" });
      await api.register(paymentsRoutes, { prefix: "/payments" });
      await api.register(adminRoutes, { prefix: "/admin" });
      await api.register(filesRoutes, { prefix: "/files" });
      await api.register(servicesRoutes, { prefix: "/services" });
      await api.register(nurseDashboardRoutes, { prefix: "/nurse" });
      await api.register(chatRoutes, { prefix: "/chat" });
      await api.register(contactRoutes, { prefix: "/contact" });
      await api.register(webhooksRoutes, { prefix: "/webhooks" });
    },
    { prefix: "/api/v1" },
  );

  await registerSocket(app);
  const cleanup = setInterval(() => {
    void prisma.sessionToken.deleteMany({ where: { expiresAt: { lt: new Date() } } })
      .catch(err => app.log.error({ err }, "Session expiry cleanup failed"));
  }, 60 * 60 * 1000);
  cleanup.unref();
  app.addHook("onClose", async () => { clearInterval(cleanup); await prisma.$disconnect(); });

  return app;
}
