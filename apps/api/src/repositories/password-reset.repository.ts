import { getRedis } from "../lib/redis.js";

const RESET_PREFIX = "password-reset:";
const RESET_TTL = 60 * 60;

export const passwordResetRepository = {
  async store(token: string, userId: string): Promise<void> {
    await getRedis().set(`${RESET_PREFIX}${token}`, userId, "EX", RESET_TTL);
  },

  async getUserId(token: string): Promise<string | null> {
    return getRedis().get(`${RESET_PREFIX}${token}`);
  },

  async delete(token: string): Promise<void> {
    await getRedis().del(`${RESET_PREFIX}${token}`);
  },
};
