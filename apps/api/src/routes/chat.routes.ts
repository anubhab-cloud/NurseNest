import type { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { apiSuccess } from "@nursenest/types";
import { ForbiddenError, NotFoundError, parseOrThrow, ValidationError } from "@nursenest/utils";
import { authenticate } from "../middleware/auth.js";
import { bookingRepository } from "../repositories/booking.repository.js";
import { chatRepository } from "../repositories/chat.repository.js";

async function accessibleBooking(request: FastifyRequest) {
  const { bookingId } = request.params as { bookingId: string };
  const booking = await bookingRepository.findById(bookingId);
  if (!booking) throw new NotFoundError("Booking not found");
  const user = request.user!;
  if (!((user.role === "PATIENT" && user.sub === booking.patientId) ||
    (user.role === "NURSE" && user.sub === booking.nurseId))) throw new ForbiddenError("This conversation is private.");
  return booking;
}
export async function chatRoutes(app: FastifyInstance) {
  app.addHook("preHandler", authenticate);
  app.get("/:bookingId", async request => {
    const booking = await accessibleBooking(request);
    return apiSuccess({ messages: await chatRepository.list(booking.id) });
  });
  app.post("/:bookingId", { config: { rateLimit: { max: 30, timeWindow: "1 minute" } } }, async (request, reply) => {
    const booking = await accessibleBooking(request);
    if (booking.status === "CANCELLED") throw new ValidationError("This booking has been cancelled. Its conversation is read-only.");
    const { body } = parseOrThrow(z.object({ body: z.string().trim().min(1).max(4000) }), request.body);
    const message = await chatRepository.create(booking.id, request.user!.sub, body);
    return reply.status(201).send(apiSuccess(message));
  });
}
