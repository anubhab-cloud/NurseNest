import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { apiSuccess } from "@nursenest/types";
import { parseOrThrow, NotFoundError, ForbiddenError } from "@nursenest/utils";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { nurseRepository } from "../repositories/nurse.repository.js";
import { reviewRepository } from "../repositories/review.repository.js";
import { toNurseProfile, toReview } from "../lib/mappers.js";
import { emitNurseLocation } from "../services/notification.service.js";
import { Role } from "@nursenest/db";

export async function nursesRoutes(app: FastifyInstance): Promise<void> {
  app.get("/available", async (request, reply) => {
    const query = request.query as { lat?: string; lng?: string; date?: string; serviceId?: string };
    const nurses = await nurseRepository.findAvailable({
      lat: query.lat ? Number(query.lat) : undefined,
      lng: query.lng ? Number(query.lng) : undefined,
      serviceId: query.serviceId,
      date: query.date ? new Date(query.date) : undefined,
    });
    return reply.send(apiSuccess(nurses.map(n => ({ ...toNurseProfile(n), currentLat: null, currentLng: null, certificationNumber: "" }))));
  });

  app.get("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const nurse = await nurseRepository.findById(id);
    if (!nurse || !nurse.isVerified || !nurse.user.isActive) throw new NotFoundError("Nurse not found");
    return reply.send(apiSuccess({ ...toNurseProfile(nurse), currentLat: null, currentLng: null, certificationNumber: "" }));
  });

  app.get("/:id/reviews", async (request, reply) => {
    const { id } = request.params as { id: string };
    const reviews = await reviewRepository.findByNurse(id);
    return reply.send(apiSuccess(reviews.map(toReview)));
  });

  app.register(async (protectedApp) => {
    protectedApp.addHook("preHandler", authenticate);
    protectedApp.addHook("preHandler", requireRoles(Role.NURSE));

    protectedApp.patch("/me/availability", async (request, reply) => {
      const { isAvailable } = parseOrThrow(z.object({ isAvailable: z.boolean() }), request.body);
      const nurse = await nurseRepository.findByUserId(request.user!.sub);
      if (isAvailable && !nurse?.isVerified) throw new ForbiddenError("Your credentials must be reviewed by an administrator first.");
      const updated = await nurseRepository.update(request.user!.sub, { isAvailable });
      return reply.send(apiSuccess(toNurseProfile(updated)));
    });

    protectedApp.patch("/me/location", async (request, reply) => {
      const { lat, lng } = parseOrThrow(
        z.object({ lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180) }),
        request.body,
      );
      const updated = await nurseRepository.update(request.user!.sub, {
        currentLat: lat,
        currentLng: lng,
      });
      emitNurseLocation(request.user!.sub, lat, lng);
      return reply.send(apiSuccess(toNurseProfile(updated)));
    });
  });
}
