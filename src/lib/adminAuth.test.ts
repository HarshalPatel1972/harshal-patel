import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isAdminRequest } from "./adminAuth";

const req = (auth?: string) =>
  new Request("http://localhost/api/feedback", {
    method: "DELETE",
    headers: auth === undefined ? {} : { Authorization: auth },
  });

describe("isAdminRequest", () => {
  const original = process.env.ADMIN_SECRET_KEY;

  beforeEach(() => {
    process.env.ADMIN_SECRET_KEY = "s3cret";
  });

  afterEach(() => {
    if (original === undefined) delete process.env.ADMIN_SECRET_KEY;
    else process.env.ADMIN_SECRET_KEY = original;
  });

  it("accepts the right bearer token", () => {
    expect(isAdminRequest(req("Bearer s3cret"))).toBe(true);
  });

  it("rejects a wrong token", () => {
    expect(isAdminRequest(req("Bearer nope"))).toBe(false);
  });

  it("rejects a request with no Authorization header", () => {
    expect(isAdminRequest(req())).toBe(false);
  });

  it("fails closed when ADMIN_SECRET_KEY isn't set", () => {
    delete process.env.ADMIN_SECRET_KEY;
    expect(isAdminRequest(req())).toBe(false);
    expect(isAdminRequest(req("Bearer "))).toBe(false);
  });
});
