#!/usr/bin/env node
/**
 * Fail the build when the entry chunk or a route chunk grows past the budget
 * recorded in docs/superpowers/specs/2026-11-02-mobile-performance-design.md.
 *
 * Why a build-time check rather than a Playwright one: the size of
 * `dist/assets/index-*.js` is what a phone parses before first paint, and it is
 * deterministic — no CDN, no gzip negotiation, no dev-server module graph to
 * confuse the measurement.
 *
 * Budgets (minified bytes on disk):
 *   entry  <= 300 kB   (739.80 kB before #11 split pdf.js out of the entry)
 *   any other chunk that is imported by the entry (i.e. not lazy) is by
 *   definition part of the entry and is covered by the rule above.
 */

import { readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = join(root, "dist", "assets");
const ENTRY_BUDGET_KB = Number(process.env.ENTRY_BUDGET_KB ?? 300);

// Vite reports chunk sizes in kB = 1000 bytes; keep the same unit so the
// budget in the spec and this check cannot drift apart.
const kb = (bytes) => Math.round((bytes / 1000) * 100) / 100;

let files;
try {
  files = readdirSync(ASSETS);
} catch {
  console.error("check-budget: dist/assets is missing; run `vite build` first.");
  process.exit(1);
}

const entries = files.filter((name) => /^index-.*\.js$/.test(name));
if (entries.length !== 1) {
  console.error(`check-budget: expected one entry chunk, found ${entries.length}: ${entries.join(", ")}`);
  process.exit(1);
}

const entry = entries[0];
const entryKB = kb(statSync(join(ASSETS, entry)).size);
const ok = entryKB <= ENTRY_BUDGET_KB;

console.log(
  `check-budget: entry ${entry} = ${entryKB} kB (budget ${ENTRY_BUDGET_KB} kB) ${ok ? "ok" : "OVER"}`,
);

if (!ok) {
  console.error(
    "check-budget: the entry chunk grew past its budget. Move something into a " +
      "lazy() route or raise ENTRY_BUDGET_KB deliberately, with a measured reason.",
  );
  process.exit(1);
}
