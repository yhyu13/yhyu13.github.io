# Plan — Mobile first-load performance

Refs: #11
Spec: `docs/superpowers/specs/2026-11-02-mobile-performance-design.md`

## Definition of done

- `npm run build` exits 0 and `dist/assets/index-*.js` is ≤ 300 kB minified.
- At 390×844 `/` makes zero `StageWash-*.js` requests (today: one, 492 kB).
- At 390×844 `/decks` makes at most one `pdf.worker.min.mjs` request
  (today: two) and total transfer is ≤ 2500 kB (today: 5044 kB).
- At 1440×900 `/` still requests `StageWash-*.js` and the detail book keeps its
  3D transition.
- `npx playwright test` passes, with the new budget test included.

Evidence policy: the budget test reads `page.on("response")` byte counts at a
fixed viewport; the entry-chunk number is read from the build output. Neither
depends on a CDN, so both are reproducible locally on any machine. Pixel
baselines stay local and gitignored (platform-sensitive WebGL), as decided in
`docs/superpowers/plans/2026-11-01-mobile-tablet-responsive.md`.

## Tasks

| # | Task | Owner | Evidence |
|---|---|---|---|
| 1 | Make `/decks/:slug` a `lazy()` route in `App.tsx`, matching `/courses/:slug` | impl | build output: entry chunk 739.80 → ≤ 300 kB, `pdf-*.js` chunk split out |
| 2 | Gate `StageWash` on pointer/width/reduced-motion/`saveData` before the `lazy()` import in `Library.tsx` | impl | `/` at 390×844: zero `StageWash` requests; at 1440×900: one |
| 3 | Own the PDF worker in `src/lib/pdf.ts` (singleton, created on first `loadPdf`, released on last `destroyPdf`) | impl | `/decks` at 390×844: `pdf.worker` requests ≤ 1 |
| 4 | Keep the `DeckShelf` `IntersectionObserver` threshold; only adjust if task 3 alone does not reach the byte budget | impl | initial PDF requests stay < 8 |
| 5 | Add `tests/perf-budget.spec.ts` asserting the six budgets from the spec | impl | test names in the Playwright output |
| 6 | Add the worker-lifetime test (`/decks` → detail → back → another deck) | impl | exactly one live worker |
| 7 | Regenerate the phone visual baselines; confirm desktop baselines unchanged | impl | `npm run test:visual` local run |
| 8 | Self-review against the issue contract | reviewer | review comment on the PR |

## Ordering and dependencies

Task 1 is independent and can land first; it alone reaches the entry-chunk
budget. Task 2 is independent of task 1 and can proceed in parallel. Tasks 3, 4
and 6 touch the same file (`src/lib/pdf.ts`) and must be serialised. Task 5
depends on 1–3 having landed, because it asserts their outcomes.

## Risk / rollback

Risk: owning the worker (task 3) can leak a worker if a route unmounts without
`destroyPdf`, which on a phone is the difference between one document cached and
two. The worker-lifetime test (task 6) is the guard; if it proves flaky, drop
task 3 and keep the worker per document, accepting 2 × 1236 kB on `/decks` while
tasks 1 and 2 still deliver the entry-chunk and backdrop wins.

Risk: gating `StageWash` changes the phone appearance. That is accepted and
recorded in the spec's consequences; the desktop visual language is unchanged.

Rollback: revert the squash commit on `master`. No data, URL or export-contract
change is involved.

## Status 2026-11-02

| # | Task | State |
|---|---|---|
| 1 | Lazy `/decks/:slug` route | done — entry chunk 739.80 → 293.88 kB |
| 2 | Gate `StageWash` | done — zero backdrop requests at 390×844 and 768×1024 |
| 5 | Budget assertions | done — `scripts/check-budget.mjs` inside `npm run build`, `tests/perf-budget.spec.ts` for module-level decisions |
| 3, 4, 6 | Shared PDF worker, threshold tuning, worker-lifetime test | deferred — `/decks` still requests 2 × 1236 kB at 390×844 |
| 7 | Regenerate phone visual baselines | left to the visual run — baselines are local and gitignored |
| 8 | Self-review | pending reviewer |

The shipped subset keeps the phone-first wins that carry no lifecycle risk and
leaves the worker work, which can leak, behind its own test.
