import { describe, expect, it } from "vitest";
import { MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH, parseFeedback } from "./feedbackValidation";

const valid = {
  id: "abc1234",
  type: "SUBMIT REVIEW",
  message: "  nice site  ",
  userName: " Swift-Echo ",
  color: "#D63031",
};

describe("parseFeedback", () => {
  it("accepts a normal entry and trims text", () => {
    const r = parseFeedback(valid);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value).toMatchObject({
        id: "abc1234",
        message: "nice site",
        userName: "Swift-Echo",
        color: "#D63031",
        status: null,
      });
    }
  });

  it("derives status from the type instead of trusting the client", () => {
    const bug = parseFeedback({ ...valid, type: "REPORT A BUG", status: "RESOLVED" });
    const feature = parseFeedback({ ...valid, type: "REQUEST FEATURE" });
    expect(bug.ok && bug.value.status).toBe("PENDING");
    expect(feature.ok && feature.value.status).toBe("PENDING");
  });

  it("rejects unknown types and non-object bodies", () => {
    expect(parseFeedback({ ...valid, type: "SPAM" }).ok).toBe(false);
    expect(parseFeedback(null).ok).toBe(false);
    expect(parseFeedback("hello").ok).toBe(false);
  });

  it("rejects empty and oversized message or name", () => {
    expect(parseFeedback({ ...valid, message: "   " }).ok).toBe(false);
    expect(parseFeedback({ ...valid, message: "x".repeat(MAX_MESSAGE_LENGTH + 1) }).ok).toBe(false);
    expect(parseFeedback({ ...valid, userName: "" }).ok).toBe(false);
    expect(parseFeedback({ ...valid, userName: "n".repeat(MAX_NAME_LENGTH + 1) }).ok).toBe(false);
  });

  it("swaps a bad id or colour for safe values", () => {
    const r = parseFeedback({ ...valid, id: "../../etc", color: "red; background:url(x)" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.id).not.toBe("../../etc");
      expect(r.value.id.length).toBeGreaterThan(0);
      expect(r.value.color).toBeNull();
    }
  });
});
