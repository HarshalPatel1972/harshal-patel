/**
 * Version 2 UI/UX Color Palette
 *
 * Why these 19 specifically?
 * - Foundations (5) give you a full depth stack — not just one "dark" but five distinct layers of dark that create visual hierarchy without noise.
 * - Neutrals (3) are subtly blue-tinted, not gray — keeping things alive in a dark theme.
 * - Accents (6) cover every functional state (primary, hover, info, warning, success, error) but in non-generic tones — Iris over blue, Petal Flame over pink.
 * - Atmospheric (5) are purely expressive — for gradients, glows, and the kind of micro-detail that makes a portfolio feel premium.
 */
export const COLORS_V2 = {
  // Foundations (Backgrounds & Surfaces)
  // These never fight for attention — they set the stage.
  foundations: {
    abyss: "#08080E",       // Root/html background (01)
    void: "#111118",        // Page canvas (02)
    obsidian: "#1A1A27",    // Cards, modals, panels (03)
    graphiteInk: "#242436", // Elevated surfaces, nav (04)
    storm: "#2E2E45",       // Borders, dividers, input frames (05)
  },

  // Typography & Neutrals
  // Readable, layered, never flat.
  neutrals: {
    stellarWhite: "#F2F2FA", // Primary headings (06)
    silverMist: "#C4C4D8",   // Body text, descriptions (07)
    twilightDust: "#7A7A96", // Muted labels, timestamps (08)
  },

  // Signature Accents
  // The soul of your palette — identity-defining.
  accents: {
    iris: "#8B5CF6",        // Primary CTA, active links (09)
    petalFlame: "#F472B6",  // Hover states, highlights (10)
    arcticPulse: "#06B6D4", // Tags, skill chips, badges (11)
    emberGlow: "#F97316",   // Warmth, warnings, timeline (12)
    surge: "#10B981",       // Success states, live dots (13)
    crimsonCore: "#EF4444", // Errors, bold emphasis (14)
  },

  // Atmospheric Highlights
  // Gradients, glows, and micro-detail magic.
  atmospheric: {
    aurora: "#C084FC",      // Gradient starts, hero glow (15)
    glacial: "#67E8F9",     // Gradient tails, icon shimmer (16)
    lantern: "#FDE68A",     // Stars, sparkle details, gold hints (17)
    circuit: "#A3E635",     // Code callouts, tech badges (18)
    duskHorizon: "#FB923C", // Scroll progress bar, warm CTA (19)
  }
} as const;
