#!/usr/bin/env node
/**
 * Walk every .html under public/ (and the site-absolute links declared in
 * src/data), extract href/src attributes, and fail on any internal reference
 * that does not resolve.
 *
 * Why: the CS2680 repo found and fixed this class of defect twice — a page
 * advertising a file that was not exported. The export asserts its manifest
 * from the inside; this checker re-checks it from the outside.
 *
 * SPA routes answer with the dist/404.html shell, not a file. The known route
 * prefixes are declared here once:
 *
 *   /courses/<slug>        is a route  (one path segment after the prefix)
 *   /courses/<slug>/files… is a file   (must exist under public/)
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(root, "public");
const DATA = join(root, "src", "data");

const SPA_ROUTES = ["/", "/identity", "/craft", "/archive", "/decks", "/courses"];
// /courses/<slug> is covered by the "/courses" prefix.

const EXTERNAL = /^(https?:|mailto:|data:|\/\/)/;

function* walk(dir, exts) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p, exts);
    else if (exts.some((e) => entry.name.endsWith(e))) yield p;
  }
}

/** A reference is a route if it equals a declared route, or extends one by
 *  exactly one path segment (a trailing slash is tolerated). A reference that
 *  ends in a file extension is never a route — routes in this app are
 *  extensionless, so /courses/ghost.html must resolve as a file. */
function isRoute(ref) {
  const clean = ref.split("#")[0].split("?")[0].replace(/\/+$/, "") || "/";
  if (/\.(html?|json|png|jpe?g|pdf|pptx|md|txt|mjs|css|js|ico|svg|webp|mp4)$/i.test(clean)) {
    return false;
  }
  return SPA_ROUTES.some((route) => {
    if (clean === route) return true;
    const rest = clean.slice(route.length);
    return (
      clean.startsWith(route) &&
      route !== "/" &&
      rest.startsWith("/") &&
      !rest.slice(1).includes("/")
    );
  });
}

function resolveRef(fromFile, ref) {
  const clean = ref.split("#")[0].split("?")[0];
  if (clean === "" || clean === "/") return { ok: true, kind: "route" };
  const target = clean.startsWith("/")
    ? join(PUBLIC, clean.replace(/^\//, ""))
    : resolve(dirname(fromFile), clean);
  if (existsSync(target) && statSync(target).isFile()) return { ok: true, kind: "file" };
  return { ok: false, target };
}

const broken = [];

// 1. every href/src inside every .html under public/
for (const file of walk(PUBLIC, [".html"])) {
  const html = readFileSync(file, "utf8");
  const attrs = html.matchAll(/\b(?:href|src)="([^"]+)"/g);
  for (const [, ref] of attrs) {
    if (EXTERNAL.test(ref) || ref.startsWith("#")) continue;
    // A ref containing quotes/plus/braces is a template fragment built by
    // inline JS, not a literal attribute — the study site's own link checker
    // covers those.
    if (/['"+\s<>{}]/.test(ref)) continue;
    if (isRoute(ref)) continue;
    const r = resolveRef(file, ref);
    if (!r.ok) broken.push(`${file}\n    ${ref}`);
  }
}

// 2. site-absolute internal links declared in the SPA data files
for (const file of walk(DATA, [".ts", ".tsx"])) {
  const code = readFileSync(file, "utf8");
  const literals = code.matchAll(/["'](\/[A-Za-z0-9\-._/]+)["']/g);
  for (const [, ref] of literals) {
    if (EXTERNAL.test(ref) || ref.startsWith("#")) continue;
    if (/\.(png|css|js|mjs|ts|tsx)$/.test(ref) && !ref.startsWith("/courses") && !ref.startsWith("/uploads") && !ref.startsWith("/decks") && !ref.startsWith("/archive"))
      continue; // source-internal paths, not site URLs
    if (isRoute(ref)) continue;
    const r = resolveRef(file, ref);
    if (!r.ok) broken.push(`${file}\n    ${ref}`);
  }
}

// 3. the manifests are the course page's data source — re-check them from
//    this side. The export script asserts them upstream; this is the other
//    side of the same invariant: a manifest may not advertise a file that
//    is not on disk, and file sizes must match.
const courseDirs = existsSync(join(PUBLIC, "courses"))
  ? readdirSync(join(PUBLIC, "courses"), { withFileTypes: true })
  : [];
for (const dir of courseDirs) {
  if (!dir.isDirectory()) continue;
  const manifestPath = join(PUBLIC, "courses", dir.name, "files", "manifest.json");
  if (!existsSync(manifestPath)) continue;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  for (const [group, entries] of Object.entries(manifest.groups ?? {})) {
    for (const entry of entries ?? []) {
      // posters are advertised for video rows regardless of where the video
      // itself lives — check them before any href-based skip
      if (entry.poster) {
        const poster = join(dirname(manifestPath), entry.poster);
        if (!existsSync(poster)) {
          broken.push(`${manifestPath}\n    ${entry.poster} (advertised as a poster, missing on disk)`);
        }
      }
      const href = entry.href ?? "";
      if (/^https?:\/\//.test(href)) continue; // a release asset is not a file here
      if (group === "videos") continue; // a placeholder href advertises no file
      const target = join(dirname(manifestPath), href);
      if (!existsSync(target) || !statSync(target).isFile()) {
        broken.push(`${manifestPath}\n    ${href} (advertised by the manifest, missing on disk)`);
      } else if (
        Number.isFinite(entry.bytes) &&
        // byte equality only for binary files: a Windows checkout with
        // core.autocrlf rewrites text files' line endings, so their on-disk
        // size legitimately differs from what the (LF) manifest recorded
        !/\.(md|txt|json|html?|css|js|mjs|ts|tsx|xml|svg|csv)$/i.test(href) &&
        statSync(target).size !== entry.bytes
      ) {
        broken.push(
          `${manifestPath}\n    ${href} is ${statSync(target).size} bytes, manifest says ${entry.bytes}`
        );
      }
    }
  }
}

if (broken.length > 0) {
  console.error(`check-links: ${broken.length} broken reference(s):\n`);
  for (const b of broken) console.error(`  ${b}\n`);
  process.exit(1);
}
console.log("check-links: all internal references resolve.");
