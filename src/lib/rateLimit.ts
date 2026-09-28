import { redis } from "@/lib/kv";

/**
 * Fixed-window counter in Redis. Returns true once `key` has been hit
 * more than `limit` times inside `windowSeconds`.
 *
 * The key is created with its TTL in the same round trip as the first
 * increment, so a crash can't leave a counter that never expires.
 * If Redis is down we let the request through rather than block visitors.
 */
export async function isRateLimited(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  try {
    const results = await redis
      .pipeline()
      .set(key, 0, "EX", windowSeconds, "NX")
      .incr(key)
      .exec();
    const count = Number(results?.[1]?.[1] ?? 0);
    return count > limit;
  } catch {
    return false;
  }
}
