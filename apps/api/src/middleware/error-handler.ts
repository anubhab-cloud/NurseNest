import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "@nursenest/utils";
import { apiFailure } from "@nursenest/types";

export function errorHandler(
  error: FastifyError | AppError | Error,
  _request: FastifyRequest,
  reply: FastifyReply,
): void {
  if (error instanceof AppError) {
    void reply.status(error.statusCode).send(apiFailure(error.message));
    return;
  }

  const statusCode = "statusCode" in error && typeof error.statusCode === "number" ? error.statusCode : 500;
  const message = statusCode < 500 ? error.message : "Internal server error";
  void reply.status(statusCode).send(apiFailure(message));
}
