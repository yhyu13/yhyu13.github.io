# Mobile first-load performance for the Field Manuals SPA

Date: 2026-11-02
Status: Draft for review
Author: Hang Yu
Refs: [#11](https://github.com/yhyu13/yhyu13.github.io/issues/11),
[#4](https://github.com/yhyu13/yhyu13.github.io/issues/4),
[#9](https://github.com/yhyu13/yhyu13.github.io/issues/9)

## Problem

The responsive work (#4, #7, #9) fixed layout, touch and scroll on phones, but
the first load on a phone is still heavy. Measured on the merged `master`
(`ef011be`), `vite preview`, Chromium, `waitUntil: "load"` plus a 4 s settle,
`deviceScaleFactor: 3` with touch emulation:

| Route / viewport | Measured transfer | Cause |
|---|---|---|
| every route, 390×844 | entry `index-*.js` <u>722 kB</u> | `App.tsx` imports `DeckReader` statically, which pulls `lib/pdf` and therefore `pdfjs-dist` into the entry chunk |
| `/`, all three viewports | <u>1260 kB</u> JS | entry + `StageWash-*.js` <u>492 kB</u> (`three` + `@designcodeio/threeui` dot matrix drawn at `opacity: .12`, `soft-light`) |
| `/decks`, 390×844 | <u>5044 kB</u> | 2 covers × the <u>1236 kB</u> `pdf.worker.min.mjs`, downloaded once **per document** |
| `/decks`, 768×1024 | <u>9304 kB</u> | 4 covers × the same 1236 kB worker |

Three separate costs, each with a different fix:

1. **`pdf.js` sits in the entry chunk.** The reader is only reachable at
   `/decks/:slug`, but because `App.tsx` imports `DeckReader` eagerly, every
   route — including `/archive`, which has no PDF at all — pays for it.
2. **`StageWash` is unconditional.** A 492 kB WebGL backdrop that is barely
   visible at `opacity: .12` is mounted on phones, where the GPU work costs
   most and the visual return is smallest.
3. **The PDF worker is re-fetched per cover.** `loadPdf()` calls
   `getDocument` per card; pdf.js spawns a worker per document, so the
   1236 kB worker script is requested again for each lazily-loaded cover.

A local experiment (making `DeckReader` a lazy route, changing nothing else)
moved the entry chunk from 739.80 kB to 293.15 kB minified — 231.42 kB to
96.13 kB gzip — and split `pdf.js` into its own 441.45 kB chunk. That is the
size of the win available for decision 1 alone.

## Decision

### 1. Route-level code splitting for the deck reader

Make `/decks/:slug` a `lazy()` route in `App.tsx`, like `/courses/:slug`
already is, and wrap it in the existing `Suspense` pattern. `pdf.js` and the
reader then load only on a deck detail route; the gallery, Archive, Craft and
Courses stop paying for them.

The gallery's cover thumbnails also need `pdf.js`, but only through
`DeckShelf`, which is already `lazy()` inside `Library.tsx`. After this change
no route pulls `pdfjs-dist` into the entry chunk.

### 2. Gate `StageWash` instead of mounting it everywhere

Keep the backdrop on fine-pointer, wide viewports (the desktop visual language
is unchanged), and skip it when any of these hold:

- coarse pointer (`@media (pointer: coarse)` via `matchMedia`), or
- viewport width below the 900 px detail boundary, or
- `prefers-reduced-motion: reduce` (already hidden in CSS; the JS should not
  download the chunk either), or
- `navigator.connection.saveData` is true.

The decision is made in `Library.tsx` before the `lazy()` import is triggered,
so a phone never requests the stage-wash chunk. Because it is evaluated before
first paint and the element is decorative (`aria-hidden`), no layout shift is
introduced; the canvas is absolutely positioned and `pointer-events: none`.

### 3. One PDF worker per page session, not per cover

Reuse a single `PDFWorker` (or a single lazily-created `PDFDocumentProxy`
worker port) across `DeckShelf` and `DeckReader` instead of letting each
`getDocument` spawn its own. Concretely:

- own the worker in `src/lib/pdf.ts` (module-level singleton, created on the
  first `loadPdf`, disposed when the last document is destroyed), and
- pass it through `getDocument({ url, worker })`; `GlobalWorkerOptions.workerSrc`
  stays as the fallback for the first creation.

The hypothesis — to be confirmed by the budget test, not assumed — is that the
repeated 1236 kB requests come from per-document worker creation. If the
measurement after the change still shows more than one worker request, the
fallback is to raise the `IntersectionObserver` root margin so fewer covers
load on the first screen, and to record the residual cost in the plan.

### 4. Budgets, asserted by a test

The numbers above become regression budgets, checked by a Playwright test that
reads `page.on("response")` the same way the measurement did:

| Budget | Limit | Today |
|---|---|---|
| entry chunk, minified | ≤ 300 kB | 739.80 kB |
| `/` at 390×844, JS bytes | ≤ 900 kB | 1260 kB |
| `/` at 390×844, `StageWash` requests | 0 | 1 |
| `/decks` at 390×844, `pdf.worker` requests | ≤ 1 | 2 |
| `/decks` at 390×844, total bytes | ≤ 2500 kB | 5044 kB |
| `/decks` at 390×844, initial PDF requests | < 8 | 2 (keep) |

The entry-chunk budget is checked from the build output (`dist/assets/index-*.js`
size) rather than from the network, so it does not depend on gzip or CDN
behaviour.

## Consequences

- The deck reader now shows a `Suspense` fallback for a moment on a cold
  `/decks/:slug` visit. It already renders a placeholder cover and a loading
  state, so the fallback is `null`, matching `/courses/:slug`.
- Phones lose a decorative WebGL layer. Desktop keeps it, so the visual
  language above 900 px is untouched; the trade-off is that a phone screenshot
  of the home page will differ from today's baseline, which is why the visual
  baselines must be regenerated for the phone viewports.
- Owning the worker adds one lifetime to manage in `lib/pdf.ts`. Destroying a
  document no longer tears the worker down; the module does it on the last
  release. This is the only place where a leak could appear, so the plan gets
  an explicit route-change test (open a deck, go back, open another).
- No content, URL or courseware-contract change.

## Verification plan

1. `npm run build` exits 0; `dist/assets/index-*.js` is ≤ 300 kB.
2. `npx playwright test` passes, including the new budget test and the existing
   responsive/scroll suites (which cover the 44 px targets, rail focus and
   scroll-to-top already delivered by #4 and #7).
3. Network profile at 390×844: `/` makes zero `StageWash` requests; `/decks`
   makes at most one `pdf.worker` request.
4. Desktop regression: at 1440×900 `/` still loads `StageWash` and the detail
   book still animates (screenshot + the existing `extra-viewports` geometry
   assertions).
5. Repeated navigation `/decks` → `/decks/:slug` → back → another deck leaves
   exactly one worker alive (asserted by a `performance.getEntriesByType`
   count or an explicit worker counter in `lib/pdf.ts`).

## Evidence appendix

Command, in the perf worktree, after `npm run build`:

```
npx vite preview --port 4173
node tmp-perf-measure.mjs   # throw-away Playwright script, not committed
```

The script opened each route at 390×844, 768×1024 and 1440×900, recorded every
response body length, and grouped them into ``.js``/``.mjs``, ``.pdf`` and
``pdf.worker`` counts. The numbers quoted above are its output for that build;
they are re-measured by the budget test once task 5 of the plan lands.

Build output that grounds the entry-chunk budget:

```
dist/assets/index-BnYKoLmm.js   739.80 kB │ gzip: 231.42 kB
dist/assets/StageWash-m1aG9UtK.js 504.25 kB │ gzip: 126.24 kB
dist/assets/pdf.worker.min-Dswkl-cV.mjs 1,265.41 kB
```

Entry chunk after the local `lazy()` experiment:

```
dist/assets/index-UqeG0qEW.js  293.15 kB │ gzip:  96.13 kB
dist/assets/pdf-DJp4UbTZ.js    441.45 kB │ gzip: 133.42 kB
```

## Addendum 2026-11-02 — what shipped, and what was deliberately not

Decisions 1 and 2 and the budget check are implemented on
`feat/11-mobile-performance`. Decision 3 (a shared PDF worker) was **not**
implemented: it changes document and worker lifetimes, which is the part of
this spec that can leak, so it stays behind its own test before it lands.

Re-measured on the built branch the same way as the problem section
(`vite preview`, Chromium, `waitUntil: load` + 4 s settle):

| Route / viewport | Before | After | Change |
|---|---|---|---|
| every route, 390×844, entry chunk | 739.80 kB | 293.88 kB | −445.92 kB |
| `/` at 390×844 | 1260 kB | <u>332 kB</u> | −928 kB |
| `/` at 768×1024 | 1260 kB | <u>332 kB</u> | −928 kB |
| `/` at 1440×900 | 1260 kB | 779 kB (entry + `StageWash`) | −481 kB, backdrop kept |
| `/archive` at 390×844, `pdf.js` requests | 1 (inside entry) | 0 | −441.45 kB |
| `/decks` at 390×844 | 5044 kB, 2 workers | 5039 kB, 2 workers | unchanged (deferred) |
| `/decks` at 768×1024 | 9304 kB, 4 workers | 9299 kB, 4 workers | unchanged (deferred) |

Two consequences worth recording:

- The gallery at `/decks` now fetches `pdf-*.js` (441.45 kB) itself, because
  the cover thumbnails render PDFs. It no longer arrives through the entry
  chunk, so Archive, Craft, Courses and the home page stop paying for it, but
  `/decks` total transfer is essentially unchanged.
- The desktop home page dropped by the exact entry-chunk reduction and keeps
  the backdrop, so the visual language above 900 px with a fine pointer is
  untouched.

Implemented guards:

- `scripts/check-budget.mjs` runs inside `npm run build` and fails it when
  `dist/assets/index-*.js` exceeds 300 kB (Vite's kB unit).
- `tests/perf-budget.spec.ts` asserts the module-level decisions against the
  dev server: no `StageWash` and no `threeui` on a phone, no `pdfjs-dist` from
  `/archive`, fewer than eight covers on `/decks`, and the desktop backdrop and
  reader intact.

Deferred to the next round, with the evidence above as their baseline:
plan tasks 3, 4 and 6 (worker singleton, threshold tuning, worker-lifetime
test) and the deletion of `StageWash` from the phone visual baselines.

## Addendum 2026-11-02 (round 2) — decision 3 shipped, with the constraint it hit

This supersedes the "deferred" note for decision 3. The shared PDF worker is
implemented on `feat/11-mobile-performance`; plan tasks 3 and 6 are done.

The first attempt failed in a way worth recording, because it is the whole
reason this decision was written as risky. `PDFDocumentLoadingTask.destroy()`
does not only tear down the document: it marks the borrowed worker
`_pendingDestroy` and deletes the worker from pdf.js's port cache
(`pdf.mjs`, `PDFDocumentLoadingTask.destroy` → `PDFWorker.destroy`). A
`getDocument()` that overlaps that window throws

```
Error: PDFWorker.create - the worker is being destroyed.
```

In the browser this is not a caught error: the second deck opened after a
back-navigation rendered an empty `#root`. The fix is in `src/lib/pdf.ts` —
destroys are chained into one promise, and `loadPdf()` awaits that chain before
creating a document. With that serialisation the borrowed port is reusable and
the error cannot occur.

Re-measured on the built branch, same method as before:

| Route / viewport | Before round 2 | After round 2 |
|---|---|---|
| `/decks` at 390×844 | 5039 kB, 2 workers | <u>3804 kB</u>, 1 worker |
| `/decks` at 768×1024 | 9299 kB, 4 workers | <u>5592 kB</u>, 1 worker |
| `/decks/:slug` at 390×844 | 2914 kB, 2 workers | 2914 kB, 1 worker |

Covered by `tests/perf-budget.spec.ts` → "one worker serves the gallery and
every deck opened afterwards", which opens two decks across a back-navigation
and asserts exactly one worker script fetch.

Plan task 4 (tuning the `IntersectionObserver` threshold) was left undone on
purpose: with one worker, the remaining transfer on `/decks` is the PDFs
themselves plus `pdf.js`, so shrinking the first-screen cover count would trade
first-paint content for a smaller number without removing waste. It stays a
knob for a future measurement, not a task.
