#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, existsSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const INCOMING = join(ROOT, "incoming");
const OUT_DIR = join(ROOT, "public", "decks");

function findSoffice() {
  const candidates = [
    "soffice",
    "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
    "C:\\Program Files\\LibreOffice\\program\\soffice.bin",
    "C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe",
    "C:\\Program Files (x86)\\LibreOffice\\program\\soffice.bin",
    "/usr/bin/soffice",
    "/usr/local/bin/soffice",
    "/opt/libreoffice/program/soffice",
  ];
  for (const c of candidates) {
    try {
      execFileSync(c, ["--version"], { stdio: "ignore", timeout: 15000 });
      return c;
    } catch {
      /* not found, try next */
    }
  }
  return null;
}

function main() {
  const args = process.argv.slice(2);
  const ext = (args.includes("--ext") && args[args.indexOf("--ext") + 1]) || "pptx";
  const slugFlag =
    (args.includes("--slug") && args[args.indexOf("--slug") + 1]) || null;

  const soffice = findSoffice();
  if (!soffice) {
    console.error(
      "LibreOffice not found. Install it at:\n" +
        "  C:\\Program Files\\LibreOffice\\program\\soffice.exe"
    );
    process.exit(1);
  }

  if (!existsSync(INCOMING)) {
    console.error(`input dir missing: ${INCOMING}`);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const sources = readdirSync(INCOMING).filter((f) => f.endsWith(`.${ext}`));
  const inputs = slugFlag
    ? sources.filter((f) => f === `${slugFlag}.${ext}`)
    : sources;

  if (inputs.length === 0) {
    console.error(`No *.${ext} files in ${INCOMING}. Drop a source file there first.`);
    process.exit(1);
  }

  for (const src of inputs) {
    const slug = slugFlag || basename(src, `.${ext}`);
    console.log(`converting ${src} -> ${slug}.pdf`);
    execFileSync(
      soffice,
      ["--headless", "--convert-to", "pdf", "--outdir", OUT_DIR, join(INCOMING, src)],
      { stdio: "inherit" },
    );
  }
  console.log("done.");
}

main();
