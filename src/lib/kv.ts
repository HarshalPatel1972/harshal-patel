import Redis from 'ioredis';

/**
 * Universal Redis Client
 * Uses the standard REDIS_URL connection string.
 */
const redisUrl = process.env.REDIS_URL || process.env.STORAGE_KV_URL || '';

// Keep one client across dev hot reloads, otherwise every save opens a new
// connection and the old ones pile up.
const globalForRedis = globalThis as unknown as { __redis?: Redis };

export const redis =
  globalForRedis.__redis ??
  new Redis(redisUrl, {
    // Don't open a socket at import time (next build imports this module and
    // would try localhost:6379); connect on the first command instead.
    lazyConnect: true,
    // Ensure we don't crash on connection failure
    retryStrategy: (times) => Math.min(times * 50, 2000),
    maxRetriesPerRequest: 3,
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.__redis = redis;

// Without a listener ioredis logs every failed attempt as "Unhandled error event"
if (redis.listenerCount("error") === 0) {
  redis.on("error", (err) => {
    console.error("[redis]", err.message);
  });
}

// Polyfill for the previous 'kv' variable name to avoid breaking the API
export const kv = {
  sadd: (key: string, value: string) => redis.sadd(key, value),
  scard: (key: string) => redis.scard(key),
  incr: (key: string) => redis.incr(key),
  get: (key: string) => redis.get(key),
  del: (key: string) => redis.del(key),
  set: (key: string, value: string) => redis.set(key, value),
};
