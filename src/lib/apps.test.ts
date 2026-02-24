import { describe, it, expect } from "bun:test";
import { APPS } from "./apps";

describe("APPS Constant Validation", () => {
  it("should be defined and an array", () => {
    expect(APPS).toBeDefined();
    expect(Array.isArray(APPS)).toBe(true);
  });

  it("should not be empty", () => {
    expect(APPS.length).toBeGreaterThan(0);
  });

  it("should have required properties for each app", () => {
    APPS.forEach((app) => {
      expect(app).toHaveProperty("name");
      expect(app).toHaveProperty("color");
      expect(app).toHaveProperty("hex");
      expect(app).toHaveProperty("icon");
    });
  });

  it("should have valid data types", () => {
    APPS.forEach((app) => {
      expect(typeof app.name).toBe("string");
      expect(typeof app.color).toBe("string");
      expect(typeof app.hex).toBe("string");
      // icon is a component, so it's a function or object (React component)
      const isIconValid = typeof app.icon === 'function' || typeof app.icon === 'object';
      expect(isIconValid).toBe(true);
    });
  });

  it("should have valid hex color codes", () => {
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
    APPS.forEach((app) => {
      expect(app.hex).toMatch(hexRegex);
    });
  });

  it("should have unique app names", () => {
    const names = APPS.map((app) => app.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });
});
