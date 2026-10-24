import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { apiSuccess } from "@nursenest/types";
import { parseOrThrow, AppError } from "@nursenest/utils";
import { createR2Client, createPresignedUploadUrl } from "@nursenest/utils";
import { authenticate } from "../middleware/auth.js";
import { env } from "../config/env.js";

export async function filesRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);

  app.post("/presigned-url", async (request, reply) => {
    if (env.isProduction) throw new AppError("Clinical attachments are disabled until private document access and retention controls are configured. Please use text visit notes.", 503);
    const { contentType, folder } = parseOrThrow(
      z.object({
        contentType: z.enum(["image/jpeg", "image/png", "application/pdf", "audio/webm"]),
        folder: z.enum(["notes", "documents", "audio"]).optional(),
      }),
      request.body,
    );

    if (!env.r2AccessKey || !env.r2SecretKey || !env.r2Bucket || !env.r2Endpoint) {
      throw new AppError("Secure file storage is not configured. Upload is unavailable.", 503);
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
    }, contentType, `${request.user!.sub}/${folder || "documents"}`);

    return reply.send(apiSuccess(result));
  });
}
