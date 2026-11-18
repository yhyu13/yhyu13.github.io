#!/usr/bin/env node
/**
 * Bake share metadata into the built site.
 *
 * Crawlers (WeChat, Slack, Twitter, iMessage) never run JavaScript, so a title
 * set at runtime is invisible to them and a pasted link shows up as a bare URL.
 * This step writes, for every shareable route:
 *
 *   - a static HTML shell at `dist/<path>/index.html` carrying title,
 *     description and Open Graph / Twitter Card tags (the SPA still boots from
 *     the same module script, so the page behaves identically for a human);
 *   - or, where a hand-written page already exists under /labs/, the same tags
 *     injected into that page without touching its markup.
 *
 * Also emits `dist/share-manifest.json`, which `scripts/gen-og.py` reads.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const require = createRequire(join(root, "package.json"));
const esbuild = require("esbuild");

const DIST = join(root, "dist");
const SITE = "https://yhyu13.github.io";

async function loadInventory() {
  const result = await esbuild.build({
    entryPoints: [join(root, "src/data/share.ts")],
    bundle: true,
    format: "esm",
    platform: "node",
    write: false,
    jsx: "automatic",
    // React is bundled in: a data: URL module cannot resolve bare specifiers,
    // and this bundle only ever runs inside this build step.
    logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  const url = `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
  const mod = await import(url);
  return mod.SHARE_ENTRIES;
}

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function metaBlock(entry) {
  const url = `${SITE}${entry.path}`;
  const tags = [
    `<meta name="description" content="${escapeAttr(entry.description)}" />`,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="Hang Yu" />`,
    `<meta property="og:title" content="${escapeAttr(entry.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(entry.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    entry.image ? `<meta property="og:image" content="${escapeAttr(entry.image)}" />` : "",
    entry.image ? `<meta property="og:image:width" content="1200" />` : "",
    entry.image ? `<meta property="og:image:height" content="630" />` : "",
    `<meta name="twitter:card" content="${entry.image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${escapeAttr(entry.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(entry.description)}" />`,
    entry.image ? `<meta name="twitter:image" content="${escapeAttr(entry.image)}" />` : "",
  ];
  return tags.filter(Boolean).join("\n    ");
}

/**
 * Put the title and the meta block into an existing document. Works for both
 * the SPA shell and the hand-written /labs pages.
 */
function inject(html, entry) {
  const title = `${entry.title} · Hang Yu`;
  let out = html
    .replace(/<meta name="description"[^>]*>\s*/g, "")
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`);

  if (!/<title>/.test(out)) {
    out = out.replace(/<head([^>]*)>/i, `<head$1><title>${escapeAttr(title)}</title>`);
  }

  const block = metaBlock(entry);
  if (/<\/head>/i.test(out)) {
    out = out.replace(/<\/head>/i, `    ${block}\n  </head>`);
  } else {
    out = `${block}\n${out}`;
  }
  return out;
}

function main() {
  const shellTemplate = readFileSync(join(DIST, "index.html"), "utf8");

  return loadInventory().then((entries) => {
    writeFileSync(join(DIST, "share-manifest.json"), JSON.stringify(entries, null, 1));

    let shells = 0;
    let tagged = 0;
    for (const entry of entries) {
      if (entry.path === "/") continue;
      const file = join(DIST, entry.path.replace(/^\//, ""), "index.html");
      const exists = existsSync(file);
      const current = exists ? readFileSync(file, "utf8") : shellTemplate;
      // A page that ships its own bundle comes from public/ (the /labs demos);
      // keep its markup and just add the tags.
      const isShell = !exists || current.includes("/assets/index-");
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, inject(current, entry));
      if (isShell) shells += 1;
      else tagged += 1;
    }

    console.log(`share-pages: ${shells} route shells, ${tagged} static pages tagged`);
    if (!existsSync(join(DIST, "og"))) {
      console.warn("share-pages: dist/og missing — run python scripts/gen-og.py");
    }
  });
}

main().catch((error) => {
  console.error("share-pages failed:", error.message);
  process.exit(1);
});
