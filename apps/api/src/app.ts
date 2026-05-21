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
import { checkRedisConnection, setUseMockRedis } from "./lib/redis.js";

export async function buildApp() {
  // Pre-check if a real Redis server is running locally
  const isRedisAlive = await checkRedisConnection(env.redisUrl);
  if (!isRedisAlive) {
    console.warn(`[Redis] ⚠️ Connection to ${env.redisUrl} failed. Enabling in-memory Redis mock for local development.`);
    setUseMockRedis(true);
  }

  if (env.sentryDsn) {
    Sentry.init({ dsn: env.sentryDsn, environment: env.nodeEnv });
  }

  const app = Fastify({ logger: env.nodeEnv === "development" });

  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, {
    origin: env.webOrigin,
    credentials: true,
  });
  await app.register(cookie);
  await app.register(rateLimit, {
    max: 300,
    timeWindow: "1 minute",
    keyGenerator: (request) => request.user?.sub ?? request.ip,
  });

  app.setErrorHandler(errorHandler);

  app.get("/health", async () => ({ ok: true }));

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
    },
    { prefix: "/api/v1" },
  );

  await registerSocket(app);

  return app;
}
