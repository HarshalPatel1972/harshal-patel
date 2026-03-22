import { createClient } from '@vercel/kv';

/**
 * High-Fidelity KV Client
 * Configured specifically for the STORAGE_ prefix assigned in Vercel.
 */
export const kv = createClient({
  url: process.env.STORAGE_KV_REST_API_URL!,
  token: process.env.STORAGE_KV_REST_API_TOKEN!,
});
