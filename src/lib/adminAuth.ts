import crypto from "crypto";

/**
 * Checks the Bearer token on a request against ADMIN_SECRET_KEY.
 * Fails closed: if the env var isn't set, nobody is an admin.
 */
export function isAdminRequest(req: Request): boolean {
  const expected = process.env.ADMIN_SECRET_KEY;
  if (!expected) return false;

  const header = req.headers.get("Authorization") ?? "";
  const provided = header.replace(/^Bearer\s+/i, "");

  // Hash both sides so timingSafeEqual gets equal-length buffers.
  const a = crypto.createHash("sha256").update(provided).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}
