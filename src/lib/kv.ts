import { createClient } from '@vercel/kv';

/**
 * High-Fidelity KV Client
 * Configured to handle both Custom Prefix and Default Vercel KV naming.
 */
export const kv = createClient({
  url: process.env.STORAGE_KV_REST_API_URL || process.env.KV_REST_API_URL || '',
  token: process.env.STORAGE_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN || '',
});
