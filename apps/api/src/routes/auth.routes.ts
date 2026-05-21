import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { apiSuccess, apiFailure } from "@nursenest/types";
import { parseOrThrow, ConflictError, UnauthorizedError, NotFoundError } from "@nursenest/utils";
import {
  loginSchema,
  registerPatientSchema,
  registerNurseSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema.js";
import { userRepository } from "../repositories/user.repository.js";
import { patientRepository } from "../repositories/patient.repository.js";
import { nurseRepository } from "../repositories/nurse.repository.js";
import { passwordResetRepository } from "../repositories/password-reset.repository.js";
import { hashPassword, verifyPassword } from "../lib/password.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt.js";
import { storeRefreshToken, revokeRefreshToken, isRefreshTokenValid } from "../lib/redis.js";
import { setAuthCookies, clearAuthCookies, REFRESH_COOKIE } from "../lib/cookies.js";
import { toAuthUser } from "../lib/mappers.js";
import { sendPasswordResetEmail } from "../services/email.service.js";
import { env } from "../config/env.js";
import { Role } from "@nursenest/db";

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/register", async (request, reply) => {
    const body = request.body as Record<string, unknown>;
    const role = body["role"] as string;

    if (role === Role.NURSE) {
      const data = parseOrThrow(registerNurseSchema, body);
      const existing = await userRepository.findByEmail(data.email);
      if (existing) throw new ConflictError("Email already registered");

      const passwordHash = await hashPassword(data.password);
      const user = await userRepository.create({
        email: data.email,
        passwordHash,
        role: Role.NURSE,
        phone: data.phone,
      });
      await nurseRepository.create({
        userId: user.id,
        fullName: data.fullName,
        certificationNumber: data.certificationNumber,
        specializations: data.specializations,
        yearsExp: data.yearsExp,
      });
      return reply.status(201).send(apiSuccess({ user: toAuthUser(user) }));
    }

    const data = parseOrThrow(registerPatientSchema, body);
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new ConflictError("Email already registered");

    const passwordHash = await hashPassword(data.password);
    const user = await userRepository.create({
      email: data.email,
      passwordHash,
      role: Role.PATIENT,
      phone: data.phone,
    });
    await patientRepository.create({
      userId: user.id,
      fullName: data.fullName,
      dateOfBirth: new Date(data.dateOfBirth),
      bloodGroup: data.bloodGroup,
      allergies: data.allergies,
      emergencyContact: data.emergencyContact,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
    });
    return reply.status(201).send(apiSuccess({ user: toAuthUser(user) }));
  });

  app.post("/login", { config: { rateLimit: { max: 5, timeWindow: "15 minutes" } } }, async (request, reply) => {
    const data = parseOrThrow(loginSchema, request.body);
    const user = await userRepository.findByEmail(data.email);
    if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
      throw new UnauthorizedError("Invalid email or password");
    }
    if (!user.isActive) {
      throw new UnauthorizedError("Account is deactivated");
    }

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const { token: refreshToken, tokenId } = signRefreshToken(user.id);
    await storeRefreshToken(user.id, tokenId);
    setAuthCookies(reply, accessToken, refreshToken);

    return reply.send(
      apiSuccess({
        user: toAuthUser(user),
        accessToken,
      }),
    );
  });

  app.post("/logout", async (request, reply) => {
    const refreshToken = request.cookies[REFRESH_COOKIE];
    if (refreshToken) {
      try {
        const payload = verifyRefreshToken(refreshToken);
        await revokeRefreshToken(payload.sub, payload.tokenId);
      } catch {
        /* ignore invalid refresh */
      }
    }
    clearAuthCookies(reply);
    return reply.send(apiSuccess({ ok: true }));
  });

  app.post("/refresh", async (request, reply) => {
    const refreshToken = request.cookies[REFRESH_COOKIE];
    if (!refreshToken) {
      return reply.status(401).send(apiFailure("Refresh token missing"));
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      const valid = await isRefreshTokenValid(payload.sub, payload.tokenId);
      if (!valid) throw new UnauthorizedError("Refresh token revoked");

      const user = await userRepository.findById(payload.sub);
      if (!user || !user.isActive) throw new UnauthorizedError();

      const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
      setAuthCookies(reply, accessToken, refreshToken);
      return reply.send(apiSuccess({ accessToken, user: toAuthUser(user) }));
    } catch {
      clearAuthCookies(reply);
      return reply.status(401).send(apiFailure("Invalid refresh token"));
    }
  });

  app.post("/forgot-password", async (request, reply) => {
    const { email } = parseOrThrow(forgotPasswordSchema, request.body);
    const user = await userRepository.findByEmail(email);
    if (user) {
      const token = randomUUID();
      await passwordResetRepository.store(token, user.id);
      const resetUrl = `${env.webOrigin}/reset-password?token=${token}`;
      await sendPasswordResetEmail(user.email, resetUrl);
    }
    return reply.send(apiSuccess({ message: "If the email exists, a reset link was sent" }));
  });

  app.post("/reset-password", async (request, reply) => {
    const { token, password } = parseOrThrow(resetPasswordSchema, request.body);
    const userId = await passwordResetRepository.getUserId(token);
    if (!userId) throw new NotFoundError("Invalid or expired reset token");

    const passwordHash = await hashPassword(password);
    await userRepository.updatePassword(userId, passwordHash);
    await passwordResetRepository.delete(token);
    return reply.send(apiSuccess({ message: "Password updated" }));
  });
}
