import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { apiSuccess } from "@nursenest/types";
import { parseOrThrow } from "@nursenest/utils";
import { prisma } from "@nursenest/db";
import { authenticate, requireRoles } from "../middleware/auth.js";

export async function contactRoutes(app: FastifyInstance) {
  app.post("/", { config: { rateLimit: { max: 5, timeWindow: "15 minutes" } } }, async (request, reply) => {
    const data = parseOrThrow(z.object({
      name: z.string().trim().min(2).max(120),
      email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
      message: z.string().trim().min(10).max(4000),
    }), request.body);
    await prisma.contactMessage.create({ data });
    return reply.status(201).send(apiSuccess({ message: "Your message has been saved for our care team. Thank you for reaching out." }));
  });
  app.get("/", { preHandler: [authenticate, requireRoles("ADMIN")] }, async () => {
    return apiSuccess(await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 }));
  });
}
