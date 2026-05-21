import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { apiSuccess } from "@nursenest/types";
import { parseOrThrow, NotFoundError, paginationSchema } from "@nursenest/utils";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { userRepository } from "../repositories/user.repository.js";
import { bookingRepository } from "../repositories/booking.repository.js";
import { invoiceRepository } from "../repositories/invoice.repository.js";
import { nurseRepository } from "../repositories/nurse.repository.js";
import { toAuthUser, toBooking } from "../lib/mappers.js";
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
    const updated = await userRepository.updateActive(id, isActive);
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
}
