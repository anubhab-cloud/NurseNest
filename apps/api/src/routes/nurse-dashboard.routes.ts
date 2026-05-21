import type { FastifyInstance } from "fastify";
import { apiSuccess } from "@nursenest/types";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { bookingRepository } from "../repositories/booking.repository.js";
import { vitalRepository } from "../repositories/vital.repository.js";
import { visitNoteRepository } from "../repositories/visit-note.repository.js";
import { patientRepository } from "../repositories/patient.repository.js";
import { invoiceRepository } from "../repositories/invoice.repository.js";
import { nurseRepository } from "../repositories/nurse.repository.js";
import { toBooking, toVital, toVisitNote, toPatientProfile, toInvoice, toNurseProfile } from "../lib/mappers.js";
import { parseOrThrow, ForbiddenError, NotFoundError } from "@nursenest/utils";
import { z } from "zod";
import { Role, BookingStatus } from "@nursenest/db";

const visitNoteSchema = z.object({
  observations: z.string().min(1),
  medications: z.string().optional(),
  nextVisitDate: z.string().optional(),
  attachmentUrls: z.array(z.string()).optional(),
});

export async function nurseDashboardRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);
  app.addHook("preHandler", requireRoles(Role.NURSE));

  app.get("/me", async (request, reply) => {
    const profile = await nurseRepository.findByUserId(request.user!.sub);
    if (!profile) throw new NotFoundError("Nurse profile not found");
    return reply.send(apiSuccess(toNurseProfile(profile)));
  });

  app.get("/me/bookings", async (request, reply) => {
    const bookings = await bookingRepository.findByNurse(request.user!.sub);
    return reply.send(apiSuccess(bookings.map(toBooking)));
  });

  app.get("/me/patients", async (request, reply) => {
    const bookings = await bookingRepository.findByNurse(request.user!.sub);
    const patientIds = new Set<string>();
    for (const b of bookings) {
      if (["CONFIRMED", "IN_PROGRESS", "COMPLETED"].includes(b.status)) {
        patientIds.add(b.patientId);
      }
    }
    const patients = await Promise.all(
      [...patientIds].map((id) => patientRepository.findByUserId(id)),
    );
    return reply.send(apiSuccess(patients.filter(Boolean).map((p) => toPatientProfile(p!))));
  });

  app.get("/patients/:patientId", async (request, reply) => {
    const { patientId } = request.params as { patientId: string };
    const hasAccess = await bookingRepository.nurseHasPatientAccess(request.user!.sub, patientId);
    if (!hasAccess) throw new ForbiddenError();
    const profile = await patientRepository.findByUserId(patientId);
    if (!profile) throw new NotFoundError("Patient not found");
    const [vitalsCount, vitals] = await vitalRepository.findByPatient(patientId, undefined, undefined, 1, 10);
    const notes = await visitNoteRepository.findByPatient(patientId);
    return reply.send(
      apiSuccess({
        profile: toPatientProfile(profile),
        vitals: vitals.map(toVital),
        visitNotes: notes.map(toVisitNote),
      }),
    );
  });

  app.post("/notes/:bookingId", async (request, reply) => {
    const { bookingId } = request.params as { bookingId: string };
    const data = parseOrThrow(visitNoteSchema, request.body);
    const booking = await bookingRepository.findById(bookingId);
    if (!booking || booking.nurseId !== request.user!.sub) {
      throw new ForbiddenError();
    }
    const note = await visitNoteRepository.upsert({
      bookingId,
      nurseId: request.user!.sub,
      observations: data.observations,
      medications: data.medications,
      nextVisitDate: data.nextVisitDate ? new Date(data.nextVisitDate) : undefined,
      attachmentUrls: data.attachmentUrls,
    });
    if (booking.status !== BookingStatus.COMPLETED) {
      await bookingRepository.updateStatus(bookingId, BookingStatus.COMPLETED);
    }
    return reply.send(apiSuccess(toVisitNote(note)));
  });

  app.get("/me/invoices", async (request, reply) => {
    const invoices = await invoiceRepository.findByNurse(request.user!.sub);
    return reply.send(apiSuccess(invoices.map(toInvoice)));
  });
}
