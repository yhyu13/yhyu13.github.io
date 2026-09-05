# Decks PDF Viewer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 4th "Decks" volume to the Library that lists PPTX-converted PDFs and lets visitors read each one in a full-screen, keyboard-navigable reader with download.

**Architecture:** PPTX decks are converted locally (LibreOffice headless) into PDFs committed under `public/decks/`. The reader renders those PDFs client-side with `pdfjs-dist` (canvas, vector-crisp). `/decks` shows the volume (DeckShelf); `/decks/:slug` shows one deck (DeckReader). The 4th cover is a regular `Manual` so it drops onto the existing shelf untouched.

**Tech Stack:** Vite 7 + React 19 + react-router 7, `pdfjs-dist@6.3.289`, LibreOffice (local, one-time install at `C:\Program Files\LibreOffice\program\soffice.exe` — **not on PATH**), Node ESM scripts.

**Spec:** [docs/superpowers/specs/2026-09-05-decks-pdf-viewer-design.md](docs/superpowers/specs/2026-09-05-decks-pdf-viewer-design.md)

## Global Constraints

- `pdfjs-dist` pinned to `6.3.289` (exact-ish; `^6.3.289`).
- LibreOffice binary is NOT on PATH. Script must probe, in order: `soffice` on PATH, then `C:\Program Files\LibreOffice\program\soffice.exe`, then `C:\Program Files (x86)\LibreOffice\program\soffice.exe`.
- `incoming/` is gitignored; only `public/decks/*.pdf` is committed. GitHub Pages is static — no server-side processing.
- Deck `slug` must be URL-safe and identical to the PDF filename stub (`/decks/<slug>.pdf`).
- Reuse existing classes/vars: `pill`, `kicker`, `icon-button`, `topbar`, `brand`, `nav-actions`, `close-button`, `detail-title`, `detail-description`, `detail-scroll`, `doc-section`, CSS vars `--ink`, `--cover-color`, `--cover-ink`. Do NOT introduce a separate visual theme.
- Respect `prefers-reduced-motion`. Focus the back/close control after a short delay on reader open. Bound imports (`React.lazy`) so the reader/shelf do not inflate the initial bundle.
- Every task ends with `npm run build` (which runs `tsc --noEmit`) being clean.

---

### Task 1: Add `pdfjs-dist` dependency

**Files:**
- Modify: `package.json` (dependencies)

**Interfaces:**
- Produces: `pdfjs-dist` importable in later tasks (used via `getDocument`, `GlobalWorkerOptions`, `PDFDocumentProxy`).

- [ ] **Step 1: Install dependency**

Run: `npm install pdfjs-dist@6.3.289`

- [ ] **Step 2: Verify version is present**

Run: `grep -E "pdfjs-dist" package.json`
Expected: `"pdfjs-dist": "^6.3.289"` (or `6.3.289` exact).

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: tsc + vite succeed.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add pdfjs-dist for deck reader"
```

---

### Task 2: Convert script + gitignore + pipeline smoke test

**Files:**
- Create: `scripts/convert-decks.mjs`
- Create: `incoming/smoke.txt`
- Modify: `.gitignore` (add `incoming/`)

**Interfaces:**
- Produces: PDFs in `public/decks/<slug>.pdf`. Later decks data references these paths. The script exposes a CLI: `node scripts/convert-decks.mjs [--ext pptx] [--slug <name>]`.

- [ ] **Step 1: Write the convert script**

```javascript
#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, existsSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), "..");
const INCOMING = join(ROOT, "incoming");
const OUT_DIR = join(ROOT, "public", "decks");

function findSoffice() {
  const candidates = [
    "soffice",
    "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
    "C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe",
    "/usr/bin/soffice",
    "/usr/local/bin/soffice",
    "/opt/libreoffice/program/soffice",
  ];
  for (const c of candidates) {
    try {
      execFileSync(c, ["--version"], { stdio: "ignore" });
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
```

- [ ] **Step 2: Lint-check the script parses**

Run: `node --check scripts/convert-decks.mjs`
Expected: no error (confirms the template has no undeclared-assignment slip).

- [ ] **Step 3: Add gitignore entry**

Append to `.gitignore`:
```
incoming/
```

- [ ] **Step 4: Create a smoke source**

Create `incoming/smoke.txt` containing a few lines of text. LibreOffice converts plain text to PDF, giving us a real PDF to test the reader without any PPTX yet.

- [ ] **Step 5: Run the script**

Run: `node scripts/convert-decks.mjs --ext txt`
Expected: `public/decks/smoke.pdf` is produced.

- [ ] **Step 6: Verify the PDF exists**

Run: `ls -la public/decks/`
Expected: `smoke.pdf` present.

- [ ] **Step 7: Commit**

```bash
git add scripts/convert-decks.mjs .gitignore incoming/smoke.txt public/decks/smoke.pdf
git commit -m "feat: add PPTX->PDF convert script and pipeline smoke test"
```

---

### Task 3: Shared pdf.js helper

**Files:**
- Create: `src/lib/pdf.ts`

**Interfaces:**
- Consumes: `pdfjs-dist` (from Task 1).
- Produces:
  - `loadPdf(url: string): Promise<PDFDocumentProxy>`
  - `renderPage(pdf: PDFDocumentProxy, pageNumber: number, canvas: HTMLCanvasElement, maxWidth?: number): Promise<PageViewport>`
  - `getNumPages(pdf: PDFDocumentProxy): number` (thin wrapper over `pdf.numPages`)

- [ ] **Step 1: Write the helper**

```ts
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerUrl;

export function loadPdf(url: string): Promise<PDFDocumentProxy> {
  return getDocument(url).promise;
}

export function getNumPages(pdf: PDFDocumentProxy): number {
  return pdf.numPages;
}

export async function renderPage(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  maxWidth?: number,
) {
  const page = await pdf.getPage(pageNumber);
  const base = page.getViewport({ scale: 1 });
  const target = maxWidth ? Math.min(maxWidth, base.width) : base.width;
  const viewport = page.getViewport({ scale: target / base.width });
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  await page.render({ canvasContext: ctx, viewport }).promise;
  return viewport;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: tsc + vite succeed (confirms the `?url` worker import resolves).

- [ ] **Step 3: Commit**

```bash
git add src/lib/pdf.ts
git commit -m "feat: add shared pdf.js load/render helper"
```

---

### Task 4: Deck data model + seed entry

**Files:**
- Create: `src/data/decks.ts`

**Interfaces:**
- Produces:
  - `type Deck = { slug; title; year; date; source?; sourceUrl?; pdf; description; color? }`
  - `DECKS: Deck[]`
  - `getDeck(slug: string | undefined): Deck | undefined`

- [ ] **Step 1: Write the data module**

```ts
export type Deck = {
  slug: string;
  title: string;
  year: string;
  date: string; // ISO 2026-09-05
  source?: string;
  sourceUrl?: string;
  pdf: string; // "/decks/<slug>.pdf"
  description: string;
  color?: string;
};

export const DECKS: Deck[] = [
  {
    slug: "smoke",
    title: "Pipeline smoke deck",
    year: "2026",
    date: "2026-09-05",
    source: "generated placeholder",
    pdf: "/decks/smoke.pdf",
    description: "A generated placeholder deck used to exercise the reader before real decks are added.",
  },
];

export function getDeck(slug: string | undefined): Deck | undefined {
  return DECKS.find((deck) => deck.slug === slug);
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/data/decks.ts
git commit -m "feat: add deck data model and seed entry"
```

---

### Task 5: DeckReader component

**Files:**
- Create: `src/components/DeckReader.tsx`

**Interfaces:**
- Consumes: `getDeck`, `loadPdf`, `getNumPages`, `renderPage`.
- Produces: `<DeckReader />` exported; reads `:slug` via `useParams`. Renders at `/decks/:slug`. Uses `.pill` for Download and `.icon-button` for controls.

- [ ] **Step 1: Write the reader**

```tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { getDeck } from "../data/decks";
import { getNumPages, loadPdf, renderPage } from "../lib/pdf";

export function DeckReader() {
  const { slug } = useParams();
  const deck = slug ? getDeck(slug) : undefined;
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [num, setNum] = useState(0);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!deck) {
      setError("Unknown deck.");
      return;
    }
    let cancelled = false;
    setError("");
    loadPdf(deck.pdf)
      .then((doc) => {
        if (cancelled) return;
        setPdf(doc);
        setNum(getNumPages(doc));
      })
      .catch(() => {
        if (!cancelled) setError("Could not open this deck.");
      });
    return () => {
      cancelled = true;
    };
  }, [deck]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    let cancelled = false;
    renderPage(pdf, page, canvasRef.current).catch(() => {
      if (!cancelled) setError("Could not render this page.");
    });
    return () => {
      cancelled = true;
    };
  }, [pdf, page]);

  useEffect(() => {
    const timer = window.setTimeout(() => backRef.current?.focus(), 500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setPage((p) => Math.min(num, p + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setPage((p) => Math.max(1, p - 1));
      } else if (e.key === "Escape") {
        window.history.back();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [num]);

  const pageNumbers = useMemo(() => Array.from({ length: num }, (_, i) => i + 1), [num]);

  if (!deck) {
    return (
      <main className="stage">
        <header className="topbar"><Link className="brand" to="/decks">Decks</Link></header>
        <p className="detail-title">Deck not found.</p>
      </main>
    );
  }

  return (
    <main className="stage deck-reader" data-mode="detail">
      <header className="topbar">
        <Link className="brand" to="/decks" ref={backRef}>Decks</Link>
        <div className="nav-actions">
          <a className="pill" href={deck.pdf} download>Download PDF</a>
          <Link className="icon-button" to="/decks" aria-label="Back to decks">×</Link>
        </div>
      </header>

      <div className="reader-stage">
        <button className="reader-arrow reader-prev" type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</button>
        <div className="reader-page">
          <canvas ref={canvasRef} className="reader-canvas" aria-label={`Slide ${page} of ${num}`} />
          {error ? <p className="qr-error">{error}</p> : null}
        </div>
        <button className="reader-arrow reader-next" type="button" aria-label="Next page" disabled={page >= num} onClick={() => setPage((p) => Math.min(num, p + 1))}>›</button>
      </div>

      <footer className="reader-foot">
        <span className="reader-count">{page} / {num}</span>
        <div className="thumb-strip" role="list" aria-label="Slides">
          {pageNumbers.map((n) => (
            <Thumb key={n} pdf={pdf} n={n} active={n === page} scale={0.18} onPick={() => setPage(n)} />
          ))}
        </div>
      </footer>
    </main>
  );
}

function Thumb({ pdf, n, active, scale, onPick }: { pdf: PDFDocumentProxy | null; n: number; active: boolean; scale: number; onPick: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!pdf || !ref.current) return;
    let cancelled = false;
    pdf.getPage(n)
      .then((pg) => {
        if (cancelled || !ref.current) return;
        const vp = pg.getViewport({ scale });
        ref.current.width = Math.floor(vp.width);
        ref.current.height = Math.floor(vp.height);
        return pg.render({ canvasContext: ref.current.getContext("2d")!, viewport: vp }).promise;
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [pdf, n, scale]);
  return (
    <button className={`thumb${active ? " active" : ""}`} type="button" onClick={onPick} aria-label={`Go to slide ${n}`} aria-current={active ? "true" : undefined}>
      <canvas ref={ref} />
    </button>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean. (Component isn't routed yet, so it's only type-checked — that's the point.)

- [ ] **Step 3: Commit**

```bash
git add src/components/DeckReader.tsx
git commit -m "feat: add DeckReader page component"
```

---

### Task 6: DeckShelf component

**Files:**
- Create: `src/components/DeckShelf.tsx`

**Interfaces:**
- Consumes: `DECKS`, `loadPdf`, `renderPage`.
- Produces: `<DeckShelf />` (no props). Renders inside the Library detail area when `openId === "decks"`. Cards link to `/decks/:slug`, include a `Download PDF` link and an auto first-page thumbnail.

- [ ] **Step 1: Write the shelf**

```tsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { DECKS, type Deck } from "../data/decks";
import { loadPdf, renderPage } from "../lib/pdf";

export function DeckShelf() {
  return (
    <section className="deck-shelf" aria-label="Decks">
      <h2 className="detail-title">Decks</h2>
      <p className="detail-description">
        Slide decks, mostly adapted from YouTube and Bilibili. Open to read, or download the PDF.
      </p>
      <div className="deck-grid">
        {DECKS.map((deck) => <DeckCard key={deck.slug} deck={deck} />)}
      </div>
    </section>
  );
}

function DeckCard({ deck }: { deck: Deck }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const didLoad = useRef(false);
  useEffect(() => {
    if (didLoad.current) return;
    didLoad.current = true;
    let cancelled = false;
    loadPdf(deck.pdf)
      .then((pdf) => {
        if (cancelled || !canvasRef.current) return;
        return renderPage(pdf, 1, canvasRef.current, 210).catch(() => {});
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [deck.pdf]);

  return (
    <article className="deck-card">
      <Link className="deck-cover" to={`/decks/${deck.slug}`} aria-label={`Open ${deck.title}`}>
        <canvas ref={canvasRef} className="deck-thumb" />
      </Link>
      <div className="deck-card-body">
        <p className="kicker">{deck.date}</p>
        <h3 className="deck-card-title">{deck.title}</h3>
        <p className="deck-card-desc">{deck.description}</p>
        {deck.source ? <p className="deck-card-source">{deck.source}</p> : null}
        <div className="action-rail">
          <Link className="pill" to={`/decks/${deck.slug}`}>Read</Link>
          <a className="pill" href={deck.pdf} download>Download PDF</a>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/DeckShelf.tsx
git commit -m "feat: add DeckShelf volume listing"
```

---

### Task 7: Decks stylesheet + import

**Files:**
- Create: `src/styles/decks.css`
- Modify: `src/main.tsx` (import it after `site.css`)

**Interfaces:**
- Produces: `.deck-reader`, `.reader-stage`, `.reader-arrow`, `.reader-page`, `.reader-canvas`, `.reader-foot`, `.reader-count`, `.thumb-strip`, `.thumb`, `.deck-shelf`, `.deck-grid`, `.deck-card`, `.deck-cover`, `.deck-thumb`, `.deck-card-title`, `.deck-card-desc`, `.deck-card-source`. Reuses existing pill/kicker/topbar vars.

- [ ] **Step 1: Write the stylesheet**

```css
/* Decks volume — reuses field-manuals tokens */
.deck-shelf { padding: 40px 24px 96px; }
.deck-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 24px;
  margin-top: 28px;
}
.deck-card {
  border: 1px solid rgba(234, 223, 199, 0.12);
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
}
.deck-cover { display: block; aspect-ratio: 4 / 3; background: #201d16; }
.deck-thumb { width: 100%; height: 100%; object-fit: contain; }
.deck-card-body { padding: 16px 18px 20px; }
.deck-card-title { font-size: 1.05rem; margin: 2px 0 6px; }
.deck-card-desc { color: var(--ink-soft); font-size: 0.86rem; line-height: 1.5; }
.deck-card-source { color: var(--ink-soft); font-size: 0.78rem; letter-spacing: 0.02em; }
.deck-card-body .action-rail { margin-top: 16px; }
.deck-card-body .pill { margin-right: 8px; }

/* Reader */
.deck-reader { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.reader-stage {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 16px;
  padding: 16px; min-height: 0;
}
.reader-page { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.reader-canvas { max-width: 100%; max-height: 100%; box-shadow: 0 18px 60px rgba(0,0,0,0.5); }
.reader-arrow {
  font-size: 2rem; color: var(--ink-soft); background: transparent; border: 0; cursor: pointer;
  padding: 8px 12px; border-radius: 10px;
}
.reader-arrow:disabled { opacity: 0.25; cursor: default; }
.reader-arrow:not(:disabled):hover { color: var(--ink); }
.reader-foot { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 8px 16px 20px; }
.reader-count { font-variant-numeric: tabular-nums; color: var(--ink-soft); font-size: 0.82rem; }
.thumb-strip { display: flex; gap: 8px; overflow-x: auto; max-width: 100%; padding-bottom: 6px; }
.thumb {
  border: 2px solid transparent; border-radius: 6px; background: transparent; padding: 0; cursor: pointer;
}
.thumb canvas { display: block; width: 96px; height: auto; opacity: 0.7; border-radius: 4px; }
.thumb.active { border-color: var(--ink); }
.thumb.active canvas { opacity: 1; }
```

Then in `src/main.tsx`, add after the existing imports:

```ts
import "./styles/decks.css";
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/styles/decks.css src/main.tsx
git commit -m "feat: add decks stylesheet"
```

---

### Task 8: Add the "Decks" Manual + routes + Library wiring

**Files:**
- Modify: `src/data/manuals.ts` (`ManualId` union; append a `Manual`)
- Modify: `src/App.tsx` (routes `/decks` and `/decks/:slug`)
- Modify: `src/pages/Library.tsx` (lazy-import `DeckShelf`; render it when `openId === "decks"` in place of `DetailPanel`)

**Interfaces:**
- Consumes: `DeckShelf` (Task 6), `DeckReader` (Task 5).
- Produces: `/decks` and `/decks/:slug` routable; the 4th shelf cover appears automatically.

- [ ] **Step 1: Extend the ManualId union + add a Manual**

In `src/data/manuals.ts`, change `ManualId` to:

```ts
export type ManualId = "identity" | "craft" | "archive" | "decks";
```

Then append to `MANUALS` (before the closing `];`):

```ts
{
  id: "decks",
  kicker: "Field Manual · IV",
  coverTitle: "Decks",
  subtitle: "Slides read aloud",
  footer: "YouTube · Bilibili · 躬行",
  coverColor: "#4f5b4a",
  coverInk: "#26301f",
  year: "2026",
  description:
    "Slide decks, mostly adapted from YouTube and Bilibili videos. Each opens in a reader you can page through and download as a PDF.",
  stepsLabel: "How to read this volume",
  steps: [
    {
      title: "Open a deck",
      body: "Each handbook is a PDF of the original slides. Arrow keys page through; select thumbnails to jump.",
    },
    {
      title: "Download to keep",
      body: "Every deck ships with its PDF as a standalone file. Save it, or read on the shelf.",
    },
  ],
  excerptLabel: "Source",
  excerpt: "Deck → PDF → download, no rebuild needed",
  reviewLabel: "Before you leave",
  review: "If a deck does not open on this shelf, it is not yet a deck.",
  actions: [{ label: "Browse decks", href: "/decks" }],
},
```

- [ ] **Step 2: Wire routes**

In `src/App.tsx`, add the import and routes after the archive routes:

```tsx
import { DeckReader } from "./components/DeckReader";
// ...
<Route path="/decks" element={<Library openId="decks" />} />
<Route path="/decks/:slug" element={<DeckReader />} />
```

- [ ] **Step 3: Render DeckShelf in Library**

In `src/pages/Library.tsx`, add a lazy import near the top:

```tsx
const DeckShelf = lazy(() => import("../components/DeckShelf"));
```

Replace the single `DetailPanel` usage:

```tsx
{openId === "decks" ? (
  <Suspense fallback={null}>
    <DeckShelf />
  </Suspense>
) : (
  <DetailPanel manual={selected} />
)}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: clean. The 4th cover appears on the gallery, `/decks` shows the shelf, `/decks/smoke` opens the reader.

- [ ] **Step 5: Commit**

```bash
git add src/data/manuals.ts src/App.tsx src/pages/Library.tsx
git commit -m "feat: add Decks volume, routes, and Library wiring"
```

---

### Task 9: Production verification

**Files:** (none; verification only)

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 2: Serve and click through**

Run: `npm run preview`
Then in a browser verify:
1. Gallery shows a 4th "Decks" cover; clicking it → `/decks`.
2. Shelf lists the `smoke` deck; first-page thumbnail renders.
3. Open `/decks/smoke` → first page renders; ‹ › and arrow keys advance; page count updates.
4. `Download PDF` fetches `/decks/smoke.pdf` (browser downloads).
5. Back → `/decks`; `×`/Escape returns to gallery.

- [ ] **Step 3: Note the real-deck path**

Replace `incoming/smoke.txt` with a real `.pptx`, run `node scripts/convert-decks.mjs --ext pptx --slug <name>`, then add its `Deck` object in `src/data/decks.ts`. Visually confirm LibreOffice fidelity on the first real deck before converting the whole batch.

---

## Self-Review Checklist

- **Spec coverage:** pipeline (Task 2), decks data (Task 4), manual/volume (Task 8), shelf (Task 6), reader (Task 5), pdf.js dep (Task 1), styles (Task 7), verification (Task 9). Covered.
- **Placeholders:** none — every code block is concrete.
- **Type consistency:** `Deck` (Task 4) matches `DeckCard` usage (Task 6); `loadPdf`/`renderPage`/`getNumPages` (Task 3) match their call sites (Tasks 5, 6); `ManualId` union includes `"decks"` (Task 8) matching `openId` routing.
- **Scope:** single feature, one plan.
