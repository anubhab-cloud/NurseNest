import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { apiSuccess } from "@nursenest/types";
import { parseOrThrow, ValidationError } from "@nursenest/utils";
import { createR2Client, createPresignedUploadUrl } from "@nursenest/utils";
import { authenticate } from "../middleware/auth.js";
import { env } from "../config/env.js";

export async function filesRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);

  app.post("/presigned-url", async (request, reply) => {
    const { contentType, folder } = parseOrThrow(
      z.object({
        contentType: z.string().min(1),
        folder: z.string().optional(),
      }),
      request.body,
    );

    if (!env.r2AccessKey || !env.r2SecretKey || !env.r2Bucket || !env.r2Endpoint) {
      const key = `local/${Date.now()}-${request.user!.sub}`;
      return reply.send(
        apiSuccess({
          uploadUrl: `${env.webOrigin}/api/v1/files/mock-upload?key=${key}`,
          publicUrl: `${env.webOrigin}/uploads/${key}`,
          key,
        }),
      );
    }

    const client = createR2Client({
      accessKeyId: env.r2AccessKey,
      secretAccessKey: env.r2SecretKey,
      bucket: env.r2Bucket,
      endpoint: env.r2Endpoint,
      publicBaseUrl: env.r2PublicUrl || undefined,
    });

    const result = await createPresignedUploadUrl(client, {
      accessKeyId: env.r2AccessKey,
      secretAccessKey: env.r2SecretKey,
      bucket: env.r2Bucket,
      endpoint: env.r2Endpoint,
      publicBaseUrl: env.r2PublicUrl || undefined,
    }, contentType, folder);

    return reply.send(apiSuccess(result));
  });
}
