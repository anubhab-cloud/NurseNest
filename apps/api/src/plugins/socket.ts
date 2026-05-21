import type { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";
import type { ServerToClientEvents, ClientToServerEvents } from "@nursenest/types";
import { verifyAccessToken } from "../lib/jwt.js";
import { setSocketServer } from "../services/notification.service.js";
import { nurseRepository } from "../repositories/nurse.repository.js";
import { emitNurseLocation } from "../services/notification.service.js";
import { env } from "../config/env.js";
import { getRedis, createRedisClient, isRedisMock } from "../lib/redis.js";

export async function registerSocket(app: FastifyInstance): Promise<void> {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(app.server, {
    cors: { origin: env.webOrigin, credentials: true },
    path: "/socket.io",
  });

  const pub = createRedisClient();
  const sub = pub.duplicate();
  if (!isRedisMock()) {
    io.adapter(createAdapter(pub, sub));
  }

  const redisSub = getRedis().duplicate();
  redisSub.psubscribe("vitals:*", "location:*", "booking:*");
  redisSub.on("pmessage", (_pattern: string, channel: string, message: string) => {
    try {
      const payload = JSON.parse(message) as Record<string, unknown>;
      if (channel.startsWith("vitals:")) {
        const patientId = channel.replace("vitals:", "");
        io.to(`patient:${patientId}`).emit("vitals:update", payload as unknown as Parameters<ServerToClientEvents["vitals:update"]>[0]);
      } else if (channel.startsWith("location:")) {
        const nurseId = channel.replace("location:", "");
        io.to(`nurse:${nurseId}`).emit("nurse:location", payload as unknown as Parameters<ServerToClientEvents["nurse:location"]>[0]);
      } else if (channel.startsWith("booking:")) {
        const bookingId = channel.replace("booking:", "");
        io.to(`booking:${bookingId}`).emit("booking:status", payload as unknown as Parameters<ServerToClientEvents["booking:status"]>[0]);
      }
    } catch {
      /* ignore malformed */
    }
  });

  io.use((socket, next) => {
    const token =
      (socket.handshake.auth["token"] as string | undefined) ??
      (socket.handshake.headers.authorization?.replace("Bearer ", "") ?? undefined);
    if (!token) {
      next(new Error("Unauthorized"));
      return;
    }
    try {
      const payload = verifyAccessToken(token);
      socket.data["userId"] = payload.sub;
      socket.data["role"] = payload.role;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data["userId"] as string;
    const role = socket.data["role"] as string;
    void socket.join(`user:${userId}`);

    socket.on("room:join", ({ roomId }) => {
      void socket.join(roomId);
    });

    socket.on("room:leave", ({ roomId }) => {
      void socket.leave(roomId);
    });

    socket.on("nurse:location:update", async ({ lat, lng }) => {
      if (role !== "NURSE") return;
      await nurseRepository.update(userId, { currentLat: lat, currentLng: lng });
      emitNurseLocation(userId, lat, lng);
    });
  });

  setSocketServer(io);
  app.decorate("io", io);
}

declare module "fastify" {
  interface FastifyInstance {
    io: Server<ClientToServerEvents, ServerToClientEvents>;
  }
}
