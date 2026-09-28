export const FEEDBACK_TYPES = ["SUBMIT REVIEW", "REPORT A BUG", "REQUEST FEATURE"] as const;
export type FeedbackType = (typeof FEEDBACK_TYPES)[number];

export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_NAME_LENGTH = 40;

export interface CleanFeedback {
  id: string;
  type: FeedbackType;
  message: string;
  userName: string;
  color: string | null;
  status: "PENDING" | null;
}

export type FeedbackResult =
  | { ok: true; value: CleanFeedback }
  | { ok: false; error: string };

const ID_PATTERN = /^[A-Za-z0-9_-]{1,32}$/;
const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

/**
 * Turns an untrusted POST body into a row we're happy to insert.
 * Only id, type, message, userName and color come from the client;
 * status is derived from the type and the timestamp is set by the caller.
 */
export function parseFeedback(body: unknown): FeedbackResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body" };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.type !== "string" || !FEEDBACK_TYPES.includes(b.type as FeedbackType)) {
    return { ok: false, error: "Unknown feedback type" };
  }
  const type = b.type as FeedbackType;

  const message = typeof b.message === "string" ? b.message.trim() : "";
  if (!message) return { ok: false, error: "Message is required" };
  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters)` };
  }

  const userName = typeof b.userName === "string" ? b.userName.trim() : "";
  if (!userName) return { ok: false, error: "Name is required" };
  if (userName.length > MAX_NAME_LENGTH) {
    return { ok: false, error: `Name is too long (max ${MAX_NAME_LENGTH} characters)` };
  }

  const id =
    typeof b.id === "string" && ID_PATTERN.test(b.id) ? b.id : crypto.randomUUID();
  const color = typeof b.color === "string" && HEX_COLOR.test(b.color) ? b.color : null;
  const status = type === "SUBMIT REVIEW" ? null : "PENDING";

  return { ok: true, value: { id, type, message, userName, color, status } };
}
