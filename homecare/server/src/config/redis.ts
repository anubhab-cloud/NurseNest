import Redis from 'ioredis';
import { config } from './env';

const redisClient = new Redis(config.redis.url, {
  maxRetriesPerRequest: 3,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on('connect', () => {
  console.log('[Redis] Connected successfully');
});

redisClient.on('error', (err: Error) => {
  console.error('[Redis] Connection error:', err.message);
});

export default redisClient;
