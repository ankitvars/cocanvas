import { createClient } from 'redis';
import { env } from '../config/env.js';
import { logger } from '../observability/logger.js';

export const redis = createClient({
  url: env.REDIS_URL,
});

redis.on('error', (err) => {
  logger.error('Redis client error:', err);
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

// We'll connect asynchronously in the main entry file
export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}
