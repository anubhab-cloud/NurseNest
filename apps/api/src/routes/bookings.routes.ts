import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { apiSuccess } from "@nursenest/types";
import {
  parseOrThrow,
  NotFoundError,
  ForbiddenError,
  ValidationError,
} from "@nursenest/utils";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { bookingRepository } from "../repositories/booking.repository.js";
import { serviceRepository } from "../repositories/service.repository.js";
import { invoiceRepository } from "../repositories/invoice.repository.js";
import { toBooking } from "../lib/mappers.js";
import { emitBookingStatus, notifyUser } from "../services/notification.service.js";
import { Role, BookingStatus } from "@nursenest/db";

const createBookingSchema = z.object({
  serviceId: z.string(),
  nurseId: z.string().optional(),
  scheduledAt: z.string(),
  notes: z.string().optional(),
});

const statusSchema = z.object({
  status: z.enum(["CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

export async function bookingsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);

  app.post("/", { preHandler: [requireRoles(Role.PATIENT)] }, async (request, reply) => {
    const data = parseOrThrow(createBookingSchema, request.body);
    const service = await serviceRepository.findById(data.serviceId);
    if (!service) throw new NotFoundError("Service not found");

    const booking = await bookingRepository.create({
      patientId: request.user!.sub,
      nurseId: data.nurseId,
      serviceId: data.serviceId,
      scheduledAt: new Date(data.scheduledAt),
      notes: data.notes,
      totalAmount: service.pricePerVisit,
    });
    await invoiceRepository.create(booking.id, booking.totalAmount);
    if (data.nurseId) {
      const nurseUser = await import("../repositories/user.repository.js").then((m) =>
        m.userRepository.findById(data.nurseId!),
      );
      if (nurseUser) {
        await notifyUser(nurseUser.id, "New Booking", "You have a new booking request", "booking");
      }
    }
    return reply.status(201).send(apiSuccess(toBooking(booking)));
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new NotFoundError("Booking not found");
    await assertBookingAccess(request.user!, booking);
    return reply.send(apiSuccess(toBooking(booking)));
  });

  app.patch("/:id/status", { preHandler: [requireRoles(Role.NURSE, Role.ADMIN)] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = parseOrThrow(statusSchema, request.body);
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new NotFoundError("Booking not found");

    if (request.user!.role === Role.NURSE && booking.nurseId !== request.user!.sub) {
      throw new ForbiddenError("Not assigned to this booking");
    }

    const updated = await bookingRepository.updateStatus(id, status as BookingStatus);
    const message = `Booking status updated to ${status}`;
    emitBookingStatus(id, status, message);
    await notifyUser(booking.patientId, "Booking Update", message, "booking");
    return reply.send(apiSuccess(toBooking(updated)));
  });

  app.delete("/:id", { preHandler: [requireRoles(Role.PATIENT)] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const booking = await bookingRepository.findById(id);
    if (!booking) throw new NotFoundError("Booking not found");
    if (booking.patientId !== request.user!.sub) {
      throw new ForbiddenError();
    }

    const hoursUntil = (booking.scheduledAt.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil < 2) {
      throw new ValidationError("Cannot cancel within 2 hours of scheduled time");
    }

    const cancelled = await bookingRepository.cancel(id);
    emitBookingStatus(id, "CANCELLED", "Booking cancelled by patient");
    return reply.send(apiSuccess(toBooking(cancelled)));
  });
}

async function assertBookingAccess(
  user: { sub: string; role: string },
  booking: { patientId: string; nurseId: string | null },
): Promise<void> {
  if (user.role === Role.ADMIN) return;
  if (user.role === Role.PATIENT && booking.patientId === user.sub) return;
  if (user.role === Role.NURSE && booking.nurseId === user.sub) return;
  throw new ForbiddenError();
}
