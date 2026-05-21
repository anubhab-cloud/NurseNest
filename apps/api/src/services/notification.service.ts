import type { Server } from "socket.io";
import type { ServerToClientEvents, ClientToServerEvents } from "@nursenest/types";
import { notificationRepository } from "../repositories/notification.repository.js";
import { getRedis } from "../lib/redis.js";

type IoServer = Server<ClientToServerEvents, ServerToClientEvents>;

let io: IoServer | null = null;

export function setSocketServer(server: IoServer): void {
  io = server;
}

export async function notifyUser(
  userId: string,
  title: string,
  body: string,
  type: string,
): Promise<void> {
  await notificationRepository.create({ userId, title, body, type });
  io?.to(`user:${userId}`).emit("notification:new", { title, body, type });
}

export function emitVitalsUpdate(
  patientId: string,
  payload: {
    heartRate: number;
    spo2: number;
    bp: { systolic: number; diastolic: number };
    temp: number;
    recordedAt: string;
  },
): void {
  io?.to(`patient:${patientId}`).emit("vitals:update", { patientId, ...payload });
  void getRedis().publish(`vitals:${patientId}`, JSON.stringify({ patientId, ...payload }));
}

export function emitBookingStatus(bookingId: string, status: string, message: string): void {
  const payload = { bookingId, status, message };
  io?.to(`booking:${bookingId}`).emit("booking:status", payload);
  void getRedis().publish(`booking:${bookingId}`, JSON.stringify(payload));
}

export function emitNurseLocation(nurseId: string, lat: number, lng: number, eta?: number): void {
  const payload = { nurseId, lat, lng, eta };
  io?.to(`nurse:${nurseId}`).emit("nurse:location", payload);
  void getRedis().publish(`location:${nurseId}`, JSON.stringify(payload));
}

export function emitCriticalAlert(patientId: string, message: string, type: string): void {
  io?.to(`patient:${patientId}`).emit("alert:critical", { patientId, message, type });
}
