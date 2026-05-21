import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { apiSuccess } from "@nursenest/types";
import { parseOrThrow, ForbiddenError, NotFoundError, paginationSchema } from "@nursenest/utils";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { vitalRepository } from "../repositories/vital.repository.js";
import { bookingRepository } from "../repositories/booking.repository.js";
import { toVital } from "../lib/mappers.js";
import { emitVitalsUpdate, emitCriticalAlert } from "../services/notification.service.js";
import { sendCriticalSms } from "../services/sms.service.js";
import { patientRepository } from "../repositories/patient.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { Role } from "@nursenest/db";

const createVitalSchema = z.object({
  patientId: z.string(),
  heartRate: z.number().int().min(30).max(220),
  systolic: z.number().int().min(60).max(250),
  diastolic: z.number().int().min(40).max(150),
  spo2: z.number().int().min(50).max(100),
  temperature: z.number().min(34).max(42),
});

export async function vitalsRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);

  app.post("/", {
    preHandler: [requireRoles(Role.NURSE)],
    config: { rateLimit: { max: 120, timeWindow: "1 minute" } },
  }, async (request, reply) => {
    const data = parseOrThrow(createVitalSchema, request.body);
    const hasAccess = await bookingRepository.nurseHasPatientAccess(request.user!.sub, data.patientId);
    if (!hasAccess) throw new ForbiddenError("Patient not assigned to you");

    const vital = await vitalRepository.create({
      ...data,
      nurseId: request.user!.sub,
    });

    const recordedAt = vital.recordedAt.toISOString();
    emitVitalsUpdate(data.patientId, {
      heartRate: vital.heartRate,
      spo2: vital.spo2,
      bp: { systolic: vital.systolic, diastolic: vital.diastolic },
      temp: vital.temperature,
      recordedAt,
    });

    if (vital.spo2 < 90 || vital.heartRate > 120 || vital.heartRate < 50) {
      const message = `Critical vitals: SpO2 ${vital.spo2}%, HR ${vital.heartRate}`;
      emitCriticalAlert(data.patientId, message, "vitals");
      const patient = await patientRepository.findByUserId(data.patientId);
      if (patient?.emergencyContact) {
        await sendCriticalSms(patient.emergencyContact, message);
      }
    }

    return reply.status(201).send(apiSuccess(toVital(vital)));
  });

  app.get("/:patientId", async (request, reply) => {
    const { patientId } = request.params as { patientId: string };
    const query = parseOrThrow(paginationSchema, request.query);

    if (request.user!.role === Role.PATIENT && request.user!.sub !== patientId) {
      throw new ForbiddenError();
    }
    if (request.user!.role === Role.NURSE) {
      const hasAccess = await bookingRepository.nurseHasPatientAccess(request.user!.sub, patientId);
      if (!hasAccess) throw new ForbiddenError();
    }

    const [total, items] = await vitalRepository.findByPatient(
      patientId,
      undefined,
      undefined,
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
}
