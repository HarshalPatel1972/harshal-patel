import { beforeEach, describe, expect, it, vi } from "vitest";

const counts = new Map<string, number>();

vi.mock("@/lib/kv", () => ({
  redis: {
    pipeline: () => {
      let key = "";
      const chain = {
        set(k: string) {
          key = k;
          if (!counts.has(k)) counts.set(k, 0);
          return chain;
        },
        incr(k: string) {
          counts.set(k, (counts.get(k) ?? 0) + 1);
          return chain;
        },
        exec: async () => [
          [null, "OK"],
          [null, counts.get(key)],
        ],
      };
      return chain;
    },
  },
}));

import { isRateLimited } from "./rateLimit";

describe("isRateLimited", () => {
  beforeEach(() => counts.clear());

  it("allows up to the limit, then blocks", async () => {
    for (let i = 0; i < 3; i++) {
      expect(await isRateLimited("k", 3, 60)).toBe(false);
    }
    expect(await isRateLimited("k", 3, 60)).toBe(true);
  });

  it("counts each key separately", async () => {
    await isRateLimited("a", 1, 60);
    expect(await isRateLimited("a", 1, 60)).toBe(true);
    expect(await isRateLimited("b", 1, 60)).toBe(false);
  });
});
