import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { apiSuccess } from "@nursenest/types";
import { parseOrThrow, NotFoundError, paginationSchema, ValidationError } from "@nursenest/utils";
import { revokeAllRefreshTokens } from "../lib/redis.js";
import { notifyUser } from "../services/notification.service.js";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { userRepository } from "../repositories/user.repository.js";
import { bookingRepository } from "../repositories/booking.repository.js";
import { invoiceRepository } from "../repositories/invoice.repository.js";
import { nurseRepository } from "../repositories/nurse.repository.js";
import { toAuthUser, toBooking, toNurseProfile } from "../lib/mappers.js";
import { Role, BookingStatus } from "@nursenest/db";

export async function adminRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);
  app.addHook("preHandler", requireRoles(Role.ADMIN));

  app.get("/stats", async (_request, reply) => {
    const [totalBookings, totalRevenue, activeNurses, totalPatients, bookingsToday] =
      await Promise.all([
        bookingRepository.countAll(),
        invoiceRepository.totalRevenue(),
        nurseRepository.countActive(),
        userRepository.countByRole(Role.PATIENT),
        bookingRepository.countToday(),
      ]);
    return reply.send(
      apiSuccess({
        totalBookings,
        totalRevenue,
        activeNurses,
        totalPatients,
        bookingsToday,
      }),
    );
  });
  app.get("/nurses", async () => apiSuccess((await nurseRepository.listAll()).map(toNurseProfile)));
  app.patch("/nurses/:id/verify", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { isVerified } = parseOrThrow(z.object({ isVerified: z.boolean() }), request.body);
    if (!await nurseRepository.findByUserId(id)) throw new NotFoundError("Nurse not found");
    const nurse = await nurseRepository.update(id, { isVerified, ...(!isVerified ? { isAvailable: false } : {}) });
    await notifyUser(id, "Credential review", isVerified ? "Your credentials have been approved. You may now make yourself available." : "Your profile is awaiting credential review.", "account");
    return reply.send(apiSuccess(toNurseProfile(nurse)));
  });

  app.get("/users", async (request, reply) => {
    const query = parseOrThrow(
      paginationSchema.extend({
        role: z.enum(["PATIENT", "NURSE", "ADMIN"]).optional(),
        search: z.string().optional(),
      }),
      request.query,
    );
    const [total, users] = await userRepository.listAll(query);
    return reply.send(
      apiSuccess({
        items: users.map(toAuthUser),
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      }),
    );
  });

  app.patch("/users/:id/status", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { isActive } = parseOrThrow(z.object({ isActive: z.boolean() }), request.body);
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    if (id === request.user!.sub && !isActive) throw new ValidationError("You cannot deactivate your own administrator account.");
    if (user.role === "ADMIN" && !isActive) throw new ValidationError("Administrator accounts require a separate access review.");
    const updated = await userRepository.updateActive(id, isActive);
    if (!isActive) await revokeAllRefreshTokens(id);
    if (!isActive) app.io.in(`user:${id}`).disconnectSockets(true);
    return reply.send(apiSuccess(toAuthUser(updated)));
  });

  app.get("/bookings", async (request, reply) => {
    const query = parseOrThrow(
      paginationSchema.extend({ status: z.nativeEnum(BookingStatus).optional() }),
      request.query,
    );
    const [total, bookings] = await bookingRepository.findAll(query);
    return reply.send(
      apiSuccess({
        items: bookings.map(toBooking),
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      }),
    );
  });
  app.patch("/bookings/:id/assign", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { nurseId } = parseOrThrow(z.object({ nurseId: z.string().min(1) }), request.body);
    if (!await bookingRepository.findById(id)) throw new NotFoundError("Booking not found");
    const booking = await bookingRepository.assign(id, nurseId);
    await notifyUser(nurseId, "Visit assigned", "An administrator assigned you a care visit.", "booking");
    await notifyUser(booking.patientId, "Nurse assigned", "A nurse has been assigned to your visit.", "booking");
    return reply.send(apiSuccess(toBooking(booking)));
  });
}
