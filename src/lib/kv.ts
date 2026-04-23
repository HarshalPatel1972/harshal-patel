import Redis from 'ioredis';

/**
 * Universal Redis Client
 * Uses the standard REDIS_URL connection string.
 */
const redisUrl = process.env.REDIS_URL || process.env.STORAGE_KV_URL || '';

export const redis = new Redis(redisUrl, {
  // Ensure we don't crash on connection failure
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 3,
});

// Polyfill for the previous 'kv' variable name to avoid breaking the API
export const kv = {
  sadd: (key: string, value: string) => redis.sadd(key, value),
  scard: (key: string) => redis.scard(key),
  incr: (key: string) => redis.incr(key),
  get: (key: string) => redis.get(key),
  del: (key: string) => redis.del(key),
  set: (key: string, value: string) => redis.set(key, value),
  pipeline: () => redis.pipeline(),
};
