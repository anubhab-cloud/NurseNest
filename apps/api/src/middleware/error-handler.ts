import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "@nursenest/utils";
import { apiFailure } from "@nursenest/types";

export function errorHandler(
  error: FastifyError | AppError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  if ("code" in error && error.code === "P2002") {
    void reply.status(409).send(apiFailure("This record already exists."));
    return;
  }
  if ("code" in error && error.code === "P2025") {
    void reply.status(404).send(apiFailure("Record not found or no longer available."));
    return;
  }
  if (error instanceof AppError) {
    void reply.status(error.statusCode).send(apiFailure(error.message));
    return;
  }

  const statusCode = "statusCode" in error && typeof error.statusCode === "number" ? error.statusCode : 500;
  if (statusCode >= 500) request.log.error({ err: error }, "Request failed");
  const message = statusCode < 500 ? error.message : "Internal server error";
  void reply.status(statusCode).send(apiFailure(message));
}
