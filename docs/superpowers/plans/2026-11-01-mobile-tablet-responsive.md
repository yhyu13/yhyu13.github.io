# Plan — Mobile and tablet responsive adaptation

Refs: #4
Spec: `docs/superpowers/specs/2026-11-01-mobile-tablet-responsive-design.md`

## Definition of done

- `npm run build` exits 0.
- Playwright screenshot matrix (375×812, 768×1024, 1024×768, 1440×900) shows
  no clipped books, no horizontal scroll, and readable text on every route.
- All interactive targets on mobile are ≥ 44×44 px.
- Touch devices show an open affordance on every book card.
- The duplicated responsive rules in `site.css` are consolidated back into
  `field-manuals.css`; `site.css` only holds article/QR/stage-wash rules.

Evidence policy: the pixel screenshot baselines are local artifacts and stay
gitignored (they embed a live WebGL canvas and are platform-sensitive). The
committed verification is the geometry suite — `tests/responsive.spec.ts`,
`tests/scroll-bug.spec.ts`, `tests/extra-viewports.spec.ts` — which asserts no
horizontal overflow, vertical fit on landscape, rail focus, one-tap open and
scroll-to-top. Pixel tests live in `tests/screenshots.spec.ts` and are excluded
from the default config: `npm run test:e2e` runs the functional suite, and
`npm run test:visual` uses `playwright.visual.config.ts` to regenerate or
compare the local baselines.

## Tasks

| # | Task | Owner | Evidence |
|---|---|---|---|
| 1 | Consolidate book-position media queries into `field-manuals.css`; remove overrides from `site.css` | impl | diff shows book rules only in `field-manuals.css` |
| 2 | Add `1180px` and `640px` breakpoints; tune sizes for 900–1179px and 640–899px | impl | screenshots at 1024×768 and 768×1024 |
| 3 | Add coarse-pointer / focus-visible affordances for touch; enforce 44px hit areas | impl | CSS selectors and computed style check |
| 4 | Make detail/shelf panels reflow below 900px with centered width and reachable close button | impl | screenshots at 375×812 detail view |
| 5 | Reflow deck-reader controls and course video rows for narrow screens | impl | screenshots at 375×812 on `/decks/:slug` and `/courses/:slug` |
| 6 | Add Playwright responsive screenshot test | impl | `npx playwright test` passes |
| 7 | Self-review against spec acceptance criteria | reviewer | review comment in PR |

### Round 2 — field feedback

| # | Task | Owner | Evidence |
|---|---|---|---|
| 8 | Swipe previews a focused volume; tap opens (two-tap on touch) | impl | `tests/scroll-bug.spec.ts` swipe/tap cases |
| 9 | Mobile detail scrolls on the document; scroll down and back to 0 | impl | `tests/scroll-bug.spec.ts` scroll case |
| 10 | Extended viewport audit (320–1180 px, landscape) | reviewer | `tests/extra-viewports.spec.ts` |
| 11 | Spec/plan addendum for the interaction change | docs | this section |

### Round 3 — native shelf rail (issue #7)

| # | Task | Owner | Evidence |
|---|---|---|---|
| 12 | Replace the focus-swap gesture with a native horizontal scroll-snap rail below 900px | impl | `overflow-x: auto`, `scroll-snap-type: x mandatory`; rail metrics test |
| 13 | One tap on a cover opens it; remove the two-tap step | impl | `tests/scroll-bug.spec.ts` tap case |
| 14 | Remove nested scroll containers on mobile detail/shelves (`overflow: visible`, `overscroll-behavior: auto`) | impl | computed `overflow-y: visible` and scroll-to-top for `/archive`, `/courses`, `/decks`, `/craft` |
| 15 | Rail focus follows the centred cover without navigating | impl | `data-focused` follows `scrollLeft` |

Supersedes round-2 task 8: swiping now moves the shelf itself, and a single
tap opens the cover.

### Round 4 — calm detail and deck covers (issue #9)

| # | Task | Owner | Evidence |
|---|---|---|---|
| 16 | Flatten the mobile detail book; remove the page fan and the long layout transition | impl | computed `transform: none`, `display: none`, transition without `width` |
| 17 | Lazy-load deck covers with a title placeholder | impl | initial PDF request count `< 8`, more after scrolling |

## Risk / rollback

Risk: a breakpoint change could break the desktop layout or make the books
overlap at an intermediate width.
Rollback: revert the squash commit on `master`; no data migration.
