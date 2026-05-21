import { z } from "zod";
import { ValidationError } from "./errors.js";

export function parseOrThrow<T>(schema: z.ZodType<T, any, any>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    throw new ValidationError(message);
  }
  return result.data;
}

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8).max(128);
export const cuidSchema = z.string().min(1);
