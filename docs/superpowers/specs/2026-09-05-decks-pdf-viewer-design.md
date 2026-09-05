# Decks Volume — PPTX→PDF + pdf.js Reader

Date: 2026-09-05
Status: Approved
Author: Hang Yu + Claude

## Problem

The user has a batch of `.pptx` decks (mostly exported/generated from YouTube and
Bilibili videos). They want them viewable on this site — visually pleasing, no
backend — with the ability to **download** each deck.

Decks were described as **mostly real text slides**. Viewing is a
**visual read-through** (navigate pages), not text-in-DOM search/select.
New decks are added by **committing converted files to the repo** (static
GitHub Pages — no server-side processing at request time). The feature lives as a
**new volume in the Library** (the 4th field-manual cover on the shelf).

## Decision: render engine

**Path A — LibreOffice → PDF → `pdf.js`.** Chosen over a pure-browser PPTX
DOM renderer because:

- **Fidelity.** LibreOffice renders each slide exactly as authored. DOM-based
  renderers (pptxjs-style) break on gradients, autoshapes, animations, and
  free-form layouts — risky for decks that contain video stills.
- **Download for free.** The converted PDF *is* the artifact served by the
  Download button. No extra work.
- **Crispness.** Vector PDF stays sharp at any zoom.
- **Simpler, deterministic.** No fragile client-side OOXML parsing.

**Cost:** one-time LibreOffice install (free, ~500MB) and a local build step.
There is no faithful pure-JS PPTX→PDF converter — every npm package that
claims one shells out to LibreOffice.

## Architecture

### 1. Conversion pipeline (manual, at author time)

`scripts/convert-decks.mjs` — run locally by the site author:

- Reads `incoming/*.pptx` (gitignored).
- For each file, runs LibreOffice headless:
  `soffice --headless --convert-to pdf --outdir public/decks <file>`.
- Renames the output to a stable slug supplied by the author
  (`--slug <name>`), defaulting to the source filename's basename.
- Errors with a friendly message if LibreOffice is not installed or
  `incoming/` has no `.pptx` files. Non-zero exit; nothing partial is kept.
- `incoming/` never enters git. Only `public/decks/<slug>.pdf` is committed.

Author workflow to add a deck:
1. Install LibreOffice once.
2. `incoming/new-deck.pptx` + run `node scripts/convert-decks.mjs --slug new-deck`.
3. Add one `Deck` object to `src/data/decks.ts`.
4. `git add` the PDF, `git push`.

### 2. Data model — `src/data/decks.ts`

```ts
export type Deck = {
  slug: string;        // URL-safe id, matches the PDF filename
  title: string;
  year: string;        // "2026"
  date: string;        // ISO "2026-09-05"
  source?: string;     // e.g. "YouTube · 3Blue1Brown"
  sourceUrl?: string;  // optional external link
  pdf: string;         // "/decks/<slug>.pdf"
  description: string; // one or two lines shown on the shelf card
  color?: string;      // optional accent, else derive from cover palette
};

export const DECKS: Deck[] = [ /* one entry per deck */ ];
```

### 3. Library integration

- Add manual id `"decks"` to the `ManualId` union in `src/data/manuals.ts`
  and append a 4th `Manual` entry ("Field Manual · IV" / coverTitle "Decks").
  Its `actions` link to `/decks`.
- `src/pages/Library.tsx`: when `openId === "decks"`, render a `DeckShelf`
  component in place of the text `DetailPanel`. Everything else (topbar,
  parallax, close button, QR share, blossoms) is reused unchanged.

### 4. Routes — `src/App.tsx`

- `/decks` → `<Library openId="decks" />`
- `/decks/:slug` → `<DeckReader />` (full-screen reader)

### 5. Components

**`src/components/DeckShelf.tsx`** — the volume's detail view. Lists `DECKS`
as cards: auto thumbnail (first page rendered from the PDF), title, source,
date, `Download PDF` pill, and an `Open` action that navigates to
`/decks/:slug`. Reuses existing `pill` / `kicker` / card language.

**`src/components/DeckReader.tsx`** — the full-screen reader:

- `pdfjs-dist`: `getDocument(url).promise`, render pages to `<canvas>`.
- Centered page, scales to fit viewport; vector-crisp on zoom.
- Prev/next buttons + arrow/space keyboard navigation.
- Page indicator (`12 / 34`) and clickable thumbnail strip.
- `Download PDF` pill → the converted PDF.
- Back control returns to `/decks`.
- Respects `prefers-reduced-motion`.
- Lazy-loaded via `React.lazy` so it doesn't inflate the initial bundle.

### 6. Styles

`src/styles/decks.css`, imported in `main.tsx`. Reuses CSS custom properties
and existing components from `field-manuals.css` / `site.css`
(`--cover-color`, `pill`, `icon-button`, kicker, parallax vars). Matches the
shelf's visual language; not a separate visual theme.

### 7. Dependency

Add `pdfjs-dist` to `package.json` dependencies. Worker imported via
`pdfjs-dist/build/pdf.worker.min.mjs?url` (Vite asset) so it bundles cleanly
for GitHub Pages.

### 8. Out of scope

- No slide-per-image generation (would lose vector crispness and add files).
- No in-browser `.pptx` rendering (rejected — fidelity).
- No text-in-DOM / slide content search (user wants a visual read-through).
- No auto-YouTube/Bilibili metadata fetch (source is entered by hand per deck).

## Error handling

- Convert script: no LibreOffice → clear message with install instruction;
  no `*.pptx` in `incoming/` → clear message; non-zero exit either way.
- Reader: failed PDF load → inline "Could not open this deck" message with a
  retry + Download link, never a white screen.

## Accessibility

- Reader canvas pages: `aria-label` describing current page; controls are real
  buttons with labels; keyboard nav documented via `aria-keyshortcuts`.
- Reduced-motion respected; focus management on open/close mirrors the Library
  detail pattern (focus the close/back control after a delay).

## Testing / verification

- `tsc --noEmit` (build) clean.
- Manual click-through in the browser after `npm run build`:
  1. Shelf shows the Decks cover; open it.
  2. Deck list renders; thumbnails load.
  3. Open a deck → first page renders; arrows/keys advance; indicator updates.
  4. Download pill fetches the PDF.
  5. Back returns to the shelf; close returns to the gallery.
- Convert script smoke-tested against one real `.pptx`.

## Open questions / risks

- LibreOffice fidelity on a deck relying on embedded fonts or complex masters
  is usually fine for text decks but is the one place to visually verify the
  first deck before committing to the whole batch.
- PDF size: keep an eye on `public/decks/` total vs GitHub Pages limits
  (~100MB soft cap); text decks are normally well under this.
