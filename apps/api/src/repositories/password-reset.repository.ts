import { tokenStore } from "../lib/redis.js";

const RESET_PREFIX = "password-reset:";
const RESET_TTL = 60 * 60;

export const passwordResetRepository = {
  async store(token: string, userId: string): Promise<void> {
    await tokenStore.set(`${RESET_PREFIX}${token}`, userId, RESET_TTL);
  },

  async getUserId(token: string): Promise<string | null> {
    return tokenStore.consume(`${RESET_PREFIX}${token}`);
  },

  async delete(token: string): Promise<void> {
    await tokenStore.delete(`${RESET_PREFIX}${token}`);
  },
};
