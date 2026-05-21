import type { FastifyInstance } from "fastify";
import { apiSuccess } from "@nursenest/types";
import { serviceRepository } from "../repositories/service.repository.js";
import { toService } from "../lib/mappers.js";

export async function servicesRoutes(app: FastifyInstance): Promise<void> {
  app.get("/", async (_request, reply) => {
    const services = await serviceRepository.findAll();
    return reply.send(apiSuccess(services.map(toService)));
  });
}
