import type { FastifyReply } from "fastify";
import { env } from "../config/env.js";

export const ACCESS_COOKIE = "nursenest_access";
export const REFRESH_COOKIE = "nursenest_refresh";

const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax" as const,
  path: "/",
  domain: env.cookieDomain === "localhost" ? undefined : env.cookieDomain,
};

export function setAuthCookies(reply: FastifyReply, accessToken: string, refreshToken: string): void {
  void reply.setCookie(ACCESS_COOKIE, accessToken, { ...cookieOptions, maxAge: 15 * 60 });
  void reply.setCookie(REFRESH_COOKIE, refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60,
  });
}

export function clearAuthCookies(reply: FastifyReply): void {
  void reply.clearCookie(ACCESS_COOKIE, cookieOptions);
  void reply.clearCookie(REFRESH_COOKIE, cookieOptions);
}
