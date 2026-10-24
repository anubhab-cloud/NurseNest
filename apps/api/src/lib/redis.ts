import { Redis, type RedisOptions } from "ioredis";
import { env } from "../config/env.js";
import { prisma } from "@nursenest/db";
import { createHash } from "node:crypto";

// Sessions use durable PostgreSQL, not a process-local Redis mock.
// Redis is optional and used only for Socket.IO cross-instance delivery.
export function createRedisClient(options: RedisOptions = {}): Redis {
  if (!env.redisUrl) throw new Error("REDIS_URL is not configured.");
  return new Redis(env.redisUrl, { maxRetriesPerRequest: 2, connectTimeout: 5000, ...options });
}
const digest = (key: string) => createHash("sha256").update(key).digest("hex");
export const tokenStore = {
  async set(key: string, value: string, ttl: number): Promise<void> {
    await prisma.sessionToken.upsert({
      where: { key: digest(key) },
      create: { key: digest(key), value, expiresAt: new Date(Date.now() + ttl * 1000) },
      update: { value, expiresAt: new Date(Date.now() + ttl * 1000) },
    });
  },
  async get(key: string): Promise<string | null> {
    const token = await prisma.sessionToken.findUnique({ where: { key: digest(key) } });
    return token && token.expiresAt.getTime() > Date.now() ? token.value : null;
  },
  async consume(key: string): Promise<string | null> {
    // deleteMany provides atomic one-time consumption, including concurrent reset requests.
    const token = await prisma.sessionToken.findUnique({ where: { key: digest(key) } });
    if (!token || token.expiresAt.getTime() <= Date.now()) return null;
    const consumed = await prisma.sessionToken.deleteMany({ where: { key: digest(key), expiresAt: { gt: new Date() } } });
    return consumed.count === 1 ? token.value : null;
  },
  async delete(key: string): Promise<void> {
    await prisma.sessionToken.deleteMany({ where: { key: digest(key) } });
  },
};
export const REFRESH_TTL_SECONDS = 30 * 24 * 60 * 60;
export const refreshKey = (userId: string, tokenId: string) => `refresh:${userId}:${tokenId}`;
export async function storeRefreshToken(userId: string, tokenId: string): Promise<void> {
  await tokenStore.set(refreshKey(userId, tokenId), userId, REFRESH_TTL_SECONDS);
}
export async function revokeRefreshToken(userId: string, tokenId: string): Promise<void> {
  await tokenStore.delete(refreshKey(userId, tokenId));
}
export async function isRefreshTokenValid(userId: string, tokenId: string): Promise<boolean> {
  return (await tokenStore.get(refreshKey(userId, tokenId))) === userId;
}
export async function revokeAllRefreshTokens(userId: string): Promise<void> {
  await prisma.sessionToken.deleteMany({ where: { value: userId } });
}
