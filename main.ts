import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Your Agent in One Emoji — entry for Muse, Jinz's personal AI agent.
// The chosen glyph: 🧩
// Muse takes scattered pieces — code, games, videos, bounty entries,
// scheduled jobs — and assembles them into finished working products,
// end to end, in the background while Jinz sleeps.

const EMOJI = "🧩";

// Runtime validation: the entry must be exactly one emoji glyph,
// 1–16 characters, and not only whitespace (the competition gate).
const chars = [...EMOJI];
if (chars.length < 1 || chars.length > 16) {
  throw new Error(`entry must be 1-16 characters, got ${chars.length}`);
}
if (EMOJI.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (chars.length !== 1 || !/^\p{Extended_Pictographic}$/u.test(EMOJI)) {
  throw new Error("entry must be exactly one emoji glyph");
}

// Guard: a single code point can still hide a composite glyph. A variation
// selector (U+FE0F), a zero-width joiner (U+200D), a skin-tone modifier
// (U+1F3FB–U+1F3FF) or a keycap (U+20E3) would turn the entry into a joined
// or styled sequence rather than one standalone pictograph — e.g. "👩‍💻"
// counts as several code points, and "☀️" is a base glyph plus VS16. The
// competition asks for one emoji, so reject any such sequence outright.
// Intl.Segmenter counts grapheme clusters, which is the correct unit here:
// a ZWJ family emoji is one visual cluster but several pictographs.
const clusters = [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(EMOJI)];
if (clusters.length !== 1) {
  throw new Error(`entry must be a single grapheme cluster, got ${clusters.length}`);
}
if (/[\uFE0F\u200D\u20E3\u{1F3FB}-\u{1F3FF}]/u.test(EMOJI)) {
  throw new Error("entry must not contain a variation selector, ZWJ, keycap, or modifier");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), EMOJI + "\n", "utf8");
