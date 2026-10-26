/**
 * check-links.mjs - broken-link checker for the CS2680 study site.
 *
 *   node check-links.mjs
 *
 * For every `decks/<deck>.html#/N` deep link on the two new pages and on the
 * index, it checks that
 *   1. the deck file exists, and
 *   2. that deck has at least N slides,
 * and it checks every other relative link on those pages resolves to a file
 * that exists.  Exit code 1 if anything is broken.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SLIDE_COUNT = 212;

const slideCount = (deckFile) => {
  const html = fs.readFileSync(path.join(HERE, 'decks', deckFile), 'utf8');
  return (html.match(/<section class="slide/g) || []).length;
};

const PAGES = ['index.html', 'concepts.html', 'search.html'];

let checked = 0;
const broken = [];
const seen = new Set();

for (const page of PAGES) {
  const file = path.join(HERE, page);
  const html = fs.readFileSync(file, 'utf8');
  // only real markup links: ignore anything inside <script> or <style>
  const markup = html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '');
  const links = [...markup.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

  for (const href of links) {
    if (/^(https?:|mailto:|#(?!\/))/.test(href)) continue; // external or pure anchor
    checked += 1;

    const key = `${page} -> ${href}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const [rel, hash] = href.split('#');
    const target = path.join(HERE, rel);

    if (!fs.existsSync(target)) {
      broken.push(`${key}  -> file does not exist`);
      continue;
    }

    if (hash && /^\/\d+$/.test(hash)) {
      const n = Number(hash.slice(1));
      const count = slideCount(path.basename(rel));
      if (n < 1 || n > count) {
        broken.push(`${key}  -> deck has ${count} slides, link points at slide ${n}`);
      }
    }
  }
}

/* the search index carries its own deep links; check those too */
const idxPath = path.join(HERE, 'search-index.json');
if (fs.existsSync(idxPath)) {
  const idx = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
  for (const s of idx.slides) {
    checked += 1;
    const count = slideCount(`${s.d}.html`);
    if (s.n < 1 || s.n > count) {
      broken.push(`search-index.json -> decks/${s.d}.html#/${s.n}  -> deck has ${count} slides`);
    }
  }
  for (const d of idx.docs) {
    checked += 1;
    const target = path.join(HERE, d.h);
    if (!fs.existsSync(target)) broken.push(`search-index.json -> ${d.h}  -> file does not exist`);
  }
}

console.log(`checked ${checked} link(s) across ${PAGES.length} page(s) plus the search index`);
console.log(`broken links: ${broken.length}`);
for (const b of broken) console.log(`  ${b}`);
if (broken.length) process.exitCode = 1;
