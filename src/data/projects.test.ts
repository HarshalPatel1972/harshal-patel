import { describe, expect, it } from "vitest";
import { projects } from "./projects";

const langs = Object.keys(projects) as (keyof typeof projects)[];

describe("projects data", () => {
  it("has every language in the same project order", () => {
    const slugs = projects.en.map((p) => p.slug);
    for (const lang of langs) {
      expect(projects[lang].map((p) => p.slug), lang).toEqual(slugs);
    }
  });

  it("shares link, colour, tags and screenshot across languages", () => {
    for (const lang of langs) {
      projects[lang].forEach((p, i) => {
        const base = projects.en[i];
        expect([p.link, p.color, p.tags, p.mobileScreenshot], `${lang}/${p.slug}`).toEqual(
          [base.link, base.color, base.tags, base.mobileScreenshot]
        );
      });
    }
  });

  it("never ships an empty title, description or specs list", () => {
    for (const lang of langs) {
      for (const p of projects[lang]) {
        expect(p.title.length, `${lang}/${p.slug} title`).toBeGreaterThan(0);
        expect(p.description.length, `${lang}/${p.slug} description`).toBeGreaterThan(0);
        expect(p.specs.length, `${lang}/${p.slug} specs`).toBeGreaterThan(0);
      }
    }
  });
});
