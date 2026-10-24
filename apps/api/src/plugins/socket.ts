import type { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import type { ServerToClientEvents, ClientToServerEvents } from "@nursenest/types";
import { verifyAccessToken } from "../lib/jwt.js";
import { setSocketServer, emitNurseLocation } from "../services/notification.service.js";
import { nurseRepository } from "../repositories/nurse.repository.js";
import { bookingRepository } from "../repositories/booking.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { env } from "../config/env.js";
import { createRedisClient } from "../lib/redis.js";
import { z } from "zod";

export async function registerSocket(app: FastifyInstance): Promise<void> {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(app.server, {
    cors: { origin: env.webOrigin, credentials: true },
    path: "/socket.io",
    maxHttpBufferSize: 16 * 1024,
  });
  const pub = env.redisUrl ? createRedisClient() : null;
  const sub = pub?.duplicate();
  if (pub && sub) {
    pub.on("error", error => app.log.error({ err: error }, "Redis adapter unavailable"));
    sub.on("error", error => app.log.error({ err: error }, "Redis subscriber unavailable"));
    io.adapter(createAdapter(pub, sub));
  }
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth["token"] as string | undefined;
      if (!token) throw new Error("Unauthorized");
      const payload = verifyAccessToken(token);
      const user = await userRepository.findById(payload.sub);
      if (!user?.isActive) throw new Error("Unauthorized");
      socket.data["userId"] = user.id;
      socket.data["role"] = user.role;
      socket.data["expiresAt"] = payload.exp ? payload.exp * 1000 : 0;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });
  io.on("connection", socket => {
    const userId = socket.data["userId"] as string;
    const role = socket.data["role"] as string;
    const timer = setTimeout(() => socket.disconnect(true), Math.max(0, (socket.data["expiresAt"] as number) - Date.now()));
    socket.once("disconnect", () => clearTimeout(timer));
    void socket.join(`user:${userId}`);
    socket.on("room:join", async payload => {
      try {
        const parsed = z.object({ roomId: z.string().max(200) }).safeParse(payload);
        if (!parsed.success) return;
        const roomId = parsed.data.roomId;
        let allowed = roomId === `user:${userId}`;
        if (roomId.startsWith("patient:")) {
          const patientId = roomId.slice(8);
          allowed = (role === "PATIENT" && patientId === userId) ||
            (role === "NURSE" && await bookingRepository.nurseHasPatientAccess(userId, patientId));
        } else if (roomId.startsWith("booking:")) {
          const booking = await bookingRepository.findById(roomId.slice(8));
          allowed = !!booking && ((role === "PATIENT" && booking.patientId === userId) ||
            (role === "NURSE" && booking.nurseId === userId));
        } else if (roomId.startsWith("nurse:")) {
          const nurseId = roomId.slice(6);
          allowed = (role === "NURSE" && nurseId === userId) ||
            (role === "PATIENT" && await bookingRepository.patientHasActiveNurse(userId, nurseId));
        }
        if (allowed) await socket.join(roomId);
      } catch (err) { app.log.warn({ err }, "Socket room authorization failed"); }
    });
    socket.on("room:leave", payload => {
      const parsed = z.object({ roomId: z.string().max(200) }).safeParse(payload);
      if (parsed.success && parsed.data.roomId !== `user:${userId}`) void socket.leave(parsed.data.roomId);
    });
    let lastLocation = 0;
    socket.on("nurse:location:update", async payload => {
      if (role !== "NURSE" || Date.now() - lastLocation < 5000) return;
      lastLocation = Date.now();
      const data = z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }).safeParse(payload);
      if (!data.success) return;
      try {
        const user = await userRepository.findById(userId);
        if (!user?.isActive) { socket.disconnect(true); return; }
        await nurseRepository.update(userId, { currentLat: data.data.lat, currentLng: data.data.lng });
        emitNurseLocation(userId, data.data.lat, data.data.lng);
      } catch (err) { app.log.error({ err }, "Location update failed"); }
    });
  });
  setSocketServer(io);
  app.decorate("io", io);
  app.addHook("onClose", async () => {
    await new Promise<void>(resolve => io.close(() => resolve()));
    await Promise.all([pub?.quit(), sub?.quit()]);
  });
}
declare module "fastify" {
  interface FastifyInstance {
    io: Server<ClientToServerEvents, ServerToClientEvents>;
  }
}
