import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { apiSuccess } from "@nursenest/types";
import { parseOrThrow, NotFoundError, paginationSchema } from "@nursenest/utils";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { patientRepository } from "../repositories/patient.repository.js";
import { vitalRepository } from "../repositories/vital.repository.js";
import { bookingRepository } from "../repositories/booking.repository.js";
import { notificationRepository } from "../repositories/notification.repository.js";
import { toPatientProfile, toVital, toBooking, toNotification } from "../lib/mappers.js";
import { Role } from "@nursenest/db";

const updatePatientSchema = z.object({
  fullName: z.string().min(2).optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  emergencyContact: z.string().optional(),
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export async function patientsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);
  app.addHook("preHandler", requireRoles(Role.PATIENT));

  app.get("/me", async (request, reply) => {
    const profile = await patientRepository.findByUserId(request.user!.sub);
    if (!profile) throw new NotFoundError("Patient profile not found");
    return reply.send(apiSuccess(toPatientProfile(profile)));
  });

  app.patch("/me", async (request, reply) => {
    const data = parseOrThrow(updatePatientSchema, request.body);
    const { allergies, dateOfBirth, ...rest } = data;
    const updated = await patientRepository.update(request.user!.sub, {
      ...rest,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      allergies: allergies ? allergies.join(",") : undefined,
    });
    return reply.send(apiSuccess(toPatientProfile(updated)));
  });

  app.get("/me/vitals", async (request, reply) => {
    const query = parseOrThrow(
      paginationSchema.extend({
        from: z.string().optional(),
        to: z.string().optional(),
      }),
      request.query,
    );
    const [total, items] = await vitalRepository.findByPatient(
      request.user!.sub,
      query.from ? new Date(query.from) : undefined,
      query.to ? new Date(query.to) : undefined,
      query.page,
      query.limit,
    );
    return reply.send(
      apiSuccess({
        items: items.map(toVital),
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      }),
    );
  });

  app.get("/me/bookings", async (request, reply) => {
    const bookings = await bookingRepository.findByPatient(request.user!.sub);
    return reply.send(apiSuccess(bookings.map(toBooking)));
  });

  app.get("/me/notifications", async (request, reply) => {
    const notifications = await notificationRepository.findByUser(request.user!.sub);
    return reply.send(apiSuccess(notifications.map(toNotification)));
  });
}
