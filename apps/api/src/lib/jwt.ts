import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import type { Role } from "@nursenest/types";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: Role;
  type: "access";
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
  type: "refresh";
}

const ACCESS_EXPIRY = "15m";
const REFRESH_EXPIRY = "30d";

export function signAccessToken(payload: Omit<AccessTokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: "access" }, env.jwtAccessSecret, { expiresIn: ACCESS_EXPIRY });
}

export function signRefreshToken(userId: string): { token: string; tokenId: string } {
  const tokenId = randomUUID();
  const token = jwt.sign({ sub: userId, tokenId, type: "refresh" }, env.jwtRefreshSecret, {
    expiresIn: REFRESH_EXPIRY,
  });
  return { token, tokenId };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
  if (decoded.type !== "access") {
    throw new Error("Invalid token type");
  }
  return decoded;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.jwtRefreshSecret) as RefreshTokenPayload;
  if (decoded.type !== "refresh") {
    throw new Error("Invalid token type");
  }
  return decoded;
}
