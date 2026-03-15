/**
 * 📸 Portfolio Project Screenshot Generator
 * -----------------------------------------
 * Generates crisp 2x WebP screenshots for every project.
 * Output lands in: public/screenshots/
 *
 * Usage:
 *   node screenshot.mjs
 *
 * Install deps first:
 *   npm install puppeteer sharp
 */

import puppeteer from "puppeteer";
import sharp from "sharp";
import fs from "fs";
import path from "path";

// ─────────────────────────────────────────
// 🔧 CONFIG — edit this section only
// ─────────────────────────────────────────

const VIEWPORT = {
  width: 1920,
  height: 1080,
  deviceScaleFactor: 2, // 2x = retina quality → outputs 3840×2160 then scaled back
};

const WAIT_STRATEGY = "networkidle2"; // waits until network is mostly quiet

const OUTPUT_DIR = "./public/screenshots"; // relative to your Next.js root
const OUTPUT_FORMAT = "webp"; // webp = smaller size, better quality than png
const OUTPUT_QUALITY = 92; // 0-100, 92 is visually lossless

// ─────────────────────────────────────────
// 📋 YOUR PROJECTS — add yours here
// ─────────────────────────────────────────

const projects = [
  {
    slug: "aero",
    url: "https://github.com/HarshalPatel1972/aero",
  },
  {
    slug: "rift",
    url: "https://github.com/HarshalPatel1972/rift",
  },
  {
    slug: "momentum",
    url: "https://github.com/HarshalPatel1972/momentum",
  },
  {
    slug: "gosync",
    url: "https://github.com/HarshalPatel1972/gosync",
  },
  {
    slug: "velocity",
    url: "https://github.com/HarshalPatel1972/velocity",
  },
  {
    slug: "win-light",
    url: "https://github.com/HarshalPatel1972/win-light",
  },
  {
    slug: "a1-tantra",
    url: "https://a1-tantra.vercel.app/",
  },
];

// ─────────────────────────────────────────
// 🚀 SCRIPT — no need to edit below this
// ─────────────────────────────────────────

async function takeScreenshot(page, project) {
  console.log(`  → Navigating to ${project.url}`);

  await page.goto(project.url, {
    waitUntil: WAIT_STRATEGY,
    timeout: 30000,
  });

  // Extra wait for JS-heavy sites (React, Vue etc.)
  await new Promise((r) => setTimeout(r, 1500));

  const rawBuffer = await page.screenshot({
    type: "png", // always capture as PNG first, convert later with sharp
    clip: {
      x: 0,
      y: 0,
      width: VIEWPORT.width,
      height: VIEWPORT.height,
    },
  });

  return rawBuffer;
}

async function processAndSave(rawBuffer, slug) {
  const outputPath = path.join(OUTPUT_DIR, `${slug}.${OUTPUT_FORMAT}`);

  await sharp(rawBuffer)
    .resize(VIEWPORT.width, VIEWPORT.height) // scale back to 1x display size
    .webp({ quality: OUTPUT_QUALITY })
    .toFile(outputPath);

  const stats = fs.statSync(outputPath);
  const sizeKB = (stats.size / 1024).toFixed(1);
  console.log(`  ✅ Saved → ${outputPath} (${sizeKB} KB)`);
}

async function run() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output dir: ${OUTPUT_DIR}\n`);
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const page = await browser.newPage();

  await page.setViewport(VIEWPORT);

  // Pretend to be a real browser — some sites block headless agents
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  console.log(`🚀 Starting screenshots for ${projects.length} project(s)...\n`);

  const results = { success: [], failed: [] };

  for (const project of projects) {
    console.log(`📸 [${project.slug}]`);
    try {
      const rawBuffer = await takeScreenshot(page, project);
      await processAndSave(rawBuffer, project.slug);
      results.success.push(project.slug);
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
      results.failed.push({ slug: project.slug, reason: err.message });
    }
    console.log("");
  }

  await browser.close();

  // ── Summary ──
  console.log("─────────────────────────────────");
  console.log(`✅ Done: ${results.success.length} succeeded`);
  if (results.failed.length > 0) {
    console.log(`❌ Failed: ${results.failed.length}`);
    results.failed.forEach((f) => console.log(`   • ${f.slug}: ${f.reason}`));
  }
  console.log(`\n📂 Screenshots are in: ${OUTPUT_DIR}`);
  console.log(
    `   Reference them in your code as: /screenshots/<slug>.webp`
  );
}

run();
