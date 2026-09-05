#!/usr/bin/env node
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, readdirSync, existsSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const INCOMING = join(ROOT, "incoming");
const OUT_DIR = join(ROOT, "public", "decks");

const PROBE_TIMEOUT_MS = 15000;

// Run `candidate --version` and return true only if it responds quickly with a
// zero exit code. Runs the child detached so that on timeout we can kill the
// whole process tree (the "soffice.exe" launcher spawns a "soffice.bin" child);
// killing only the direct child would orphan that grandchild across runs.
function probeCandidate(candidate) {
  return new Promise((resolve) => {
    // On Windows `spawn` cannot resolve a backslash absolute path ("soffice.exe"
    // with an ENOENT), whereas `execFileSync` can; normalize to forward slashes
    // for spawning only. The returned candidate string (as documented) is left
    // untouched.
    const cmd =
      process.platform === "win32" ? candidate.replace(/\\/g, "/") : candidate;
    let child;
    let killed = false;
    try {
      child = spawn(cmd, ["--version"], { stdio: "ignore" });
    } catch {
      resolve(false);
      return;
    }
    const timer = setTimeout(() => {
      killed = true;
      if (child.pid == null) {
        resolve(false);
        return;
      }
      if (process.platform === "win32") {
        // Kill the whole process tree (the "soffice.exe" launcher spawns a
        // "soffice.bin" child). Detached process-groups are avoided here
        // because detached spawning itself caused the probe to hang under
        // Git Bash; taskkill /T walks the tree without it.
        try {
          execFileSync("taskkill", ["/T", "/F", "/PID", String(child.pid)], {
            stdio: "ignore",
          });
        } catch {
          /* child already gone */
        }
      } else {
        try {
          process.kill(child.pid, "SIGKILL");
        } catch {
          /* child already gone */
        }
      }
    }, PROBE_TIMEOUT_MS);
    child.once("exit", (code) => {
      clearTimeout(timer);
      resolve(!killed && code === 0);
    });
    child.once("error", () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
}

// Normalize an auto-derived slug to be URL-safe: lowercase, collapse any run of
// characters that are not URL-safe (spaces, punctuation, etc.) into a dash, and
// trim leading/trailing dashes. `--slug`-provided slugs are author-controlled and
// are NOT normalized.
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function findSoffice() {
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
    if (await probeCandidate(c)) return c;
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const ext = (args.includes("--ext") && args[args.indexOf("--ext") + 1]) || "pptx";
  const slugFlag =
    (args.includes("--slug") && args[args.indexOf("--slug") + 1]) || null;

  const soffice = await findSoffice();
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
    const slug = slugFlag || slugify(basename(src, `.${ext}`));
    console.log(`converting ${src} -> ${slug}.pdf`);
    execFileSync(
      soffice,
      ["--headless", "--convert-to", "pdf", "--outdir", OUT_DIR, join(INCOMING, src)],
      { stdio: "inherit" },
    );
  }
  console.log("done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
