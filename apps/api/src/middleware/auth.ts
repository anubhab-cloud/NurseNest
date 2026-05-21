import type { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError, ForbiddenError } from "@nursenest/utils";
import { verifyAccessToken, type AccessTokenPayload } from "../lib/jwt.js";
import { userRepository } from "../repositories/user.repository.js";
import type { Role } from "@nursenest/types";

declare module "fastify" {
  interface FastifyRequest {
    user?: AccessTokenPayload & { isActive: boolean };
  }
}

const ACCESS_COOKIE = "nursenest_access";

export async function authenticate(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const header = request.headers.authorization;
  const cookieToken = request.cookies[ACCESS_COOKIE];
  const token = header?.startsWith("Bearer ") ? header.slice(7) : cookieToken;

  if (!token) {
    throw new UnauthorizedError("Authentication required");
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await userRepository.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedError("Account inactive or not found");
    }
    request.user = { ...payload, isActive: user.isActive };
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

export function requireRoles(...roles: Role[]) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      throw new UnauthorizedError();
    }
    if (!roles.includes(request.user.role)) {
      throw new ForbiddenError("Insufficient permissions");
    }
  };
}
