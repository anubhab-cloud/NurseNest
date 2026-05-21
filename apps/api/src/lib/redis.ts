import { Redis } from "ioredis";
import { env } from "../config/env.js";
import { EventEmitter } from "events";
import net from "net";

const globalBus = new EventEmitter();

export class MockRedis extends EventEmitter {
  private store = new Map<string, string>();

  constructor() {
    super();
    // Forward pub/sub messages from the shared bus to this subscriber instance
    const onPMessage = (pattern: string, channel: string, message: string) => {
      this.emit("pmessage", pattern, channel, message);
    };
    const onMessage = (channel: string, message: string) => {
      this.emit("message", channel, message);
    };

    globalBus.on("pmessage", onPMessage);
    globalBus.on("message", onMessage);

    // Clean up event listeners on disconnect/quit to avoid memory leaks
    this.once("end", () => {
      globalBus.off("pmessage", onPMessage);
      globalBus.off("message", onMessage);
    });

    setTimeout(() => {
      this.emit("connect");
      this.emit("ready");
    }, 0);
  }

  async set(key: string, value: string, ...args: any[]): Promise<"OK"> {
    this.store.set(key, value);
    return "OK";
  }

  async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }

  async del(...keys: string[]): Promise<number> {
    let deleted = 0;
    for (const key of keys) {
      if (this.store.delete(key)) {
        deleted++;
      }
    }
    return deleted;
  }

  async keys(pattern: string): Promise<string[]> {
    const regexStr = "^" + pattern.replace(/\*/g, ".*") + "$";
    const regex = new RegExp(regexStr);
    const results: string[] = [];
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        results.push(key);
      }
    }
    return results;
  }

  duplicate(): MockRedis {
    const dup = new MockRedis();
    dup.store = this.store; // share the key-value store
    return dup;
  }

  async publish(channel: string, message: string): Promise<number> {
    globalBus.emit("message", channel, message);
    globalBus.emit("pmessage", "", channel, message);
    return 1;
  }

  async psubscribe(...patterns: string[]): Promise<string[]> {
    return patterns;
  }

  async subscribe(...channels: string[]): Promise<string[]> {
    return channels;
  }

  async quit(): Promise<"OK"> {
    this.emit("end");
    return "OK";
  }

  async disconnect(): Promise<void> {
    this.emit("end");
  }
}

let redis: Redis | null = null;
let useMock = false;

export function setUseMockRedis(val: boolean): void {
  useMock = val;
}

export function isRedisMock(): boolean {
  return useMock;
}

export function createRedisClient(options?: any): Redis {
  if (useMock) {
    return new MockRedis() as unknown as Redis;
  }
  return new Redis(env.redisUrl, { maxRetriesPerRequest: 3, ...options });
}

export function getRedis(): Redis {
  if (!redis) {
    redis = createRedisClient();
  }
  return redis;
}

export function checkRedisConnection(urlStr: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const url = new URL(urlStr);
      const port = parseInt(url.port || "6379");
      const host = url.hostname || "localhost";
      const socket = net.createConnection({ port, host, timeout: 500 });
      socket.on("connect", () => {
        socket.destroy();
        resolve(true);
      });
      socket.on("error", () => {
        socket.destroy();
        resolve(false);
      });
      socket.on("timeout", () => {
        socket.destroy();
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}

export const REFRESH_TTL_SECONDS = 30 * 24 * 60 * 60;

export function refreshKey(userId: string, tokenId: string): string {
  return `refresh:${userId}:${tokenId}`;
}

export async function storeRefreshToken(userId: string, tokenId: string): Promise<void> {
  const client = getRedis();
  await client.set(refreshKey(userId, tokenId), "1", "EX", REFRESH_TTL_SECONDS);
}

export async function revokeRefreshToken(userId: string, tokenId: string): Promise<void> {
  const client = getRedis();
  await client.del(refreshKey(userId, tokenId));
}

export async function isRefreshTokenValid(userId: string, tokenId: string): Promise<boolean> {
  const client = getRedis();
  const value = await client.get(refreshKey(userId, tokenId));
  return value === "1";
}

export async function revokeAllRefreshTokens(userId: string): Promise<void> {
  const client = getRedis();
  const keys = await client.keys(`refresh:${userId}:*`);
  if (keys.length > 0) {
    await client.del(...keys);
  }
}

