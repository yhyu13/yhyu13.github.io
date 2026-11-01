# Mobile and tablet responsive adaptation for the Field Manuals SPA

Date: 2026-11-01
Status: Draft for review
Author: Hang Yu
Refs: [#4](https://github.com/yhyu13/yhyu13.github.io/issues/4)

## Problem

The site currently relies on two coarse CSS breakpoints (`max-width: 900px`
and `max-width: 560px`) and on hover for discovery affordances. On real tablets
and phones this produces several concrete failures:

- **Tablet portrait (768px–900px):** the 900px rules still treat the viewport
  like a small desktop. The five books are 38vw–42vw wide, overlap each other,
  and the hero word collides with the top book covers.
- **Tablet landscape / small laptop (1024px–1180px):** the desktop layout is
  active, but the detail panel is 47.5% wide and the selected book is 30vw,
  leaving the text cramped while the book still dominates the left half.
- **Mobile landscape (560px–760px):** the 900px rules apply, so books are sized
  for portrait widths and become too tall; the detail panel starts too far down.
- **Touch:** there is no hover, so the "Read" badge and the book lift never
  appear. A first-time visitor on a phone cannot tell the books are tappable.
- **Content pages:** the deck-reader arrows and thumbnail strip, and the course
  video rows with 200px posters, do not reflow cleanly on narrow screens.

## Decision

Add a purpose-built responsive ladder and touch-aware affordances, while keeping
the desktop visual language intact.

### 1. Breakpoints

Use four width bands so each device class gets a tuned layout:

| Band | Range | Layout goal |
|---|---|---|
| Desktop | `>= 1180px` | Current five-book gallery; detail side-by-side. Unchanged. |
| Small desktop / tablet landscape | `900px – 1179px` | Five books scaled down; detail panel widened to avoid cramping. |
| Tablet portrait / large phone landscape | `640px – 899px` | All five books visible; centre volumes read larger; detail becomes vertical flow. |
| Phone portrait | `<= 639px` | All five books visible; centre book largest, outer two shrink toward the edges; vertical detail flow. |

The existing `560px` breakpoint is replaced by `639px`; the `900px` breakpoint
stays as the boundary between side-by-side detail and vertical detail.

### 2. Book sizing and placement

- Each band gets explicit `--x`, `--y`, `--w`, `--r`, `--yaw` values for every
  volume, declared in one place per file to end the current split-brain where
  `site.css` overrides only three of the five books.
- On phone portrait, keep all five books on-canvas: the central book reads
  largest and the outer two shrink toward the edges. Rotations are reduced so
  titles remain legible. No cover is fully clipped; the earlier "carousel"
  wording is dropped because it conflicted with the plan's no-clipping DoD.
- On tablet portrait, keep all five books visible but narrower and with less
  rotation so they do not overlap.

### 3. Touch affordances

- The "Read" badge is shown whenever the device is coarse-pointer (touch) or
  when the book has focus, not only on hover.
- A subtle `scale(0.98)` press feedback is added to active buttons and cards.
- Minimum hit areas are enforced: icon buttons 44×44px, pills 44px min-height,
  menu links padded to at least 44px tall.

### 4. Detail / shelf views

- Below 900px, the selected book is pinned near the top and the panel/shelf
  scrolls beneath it. The close button stays reachable (top center, 44px hit
  area).
- The panel width becomes `min(680px, calc(100% - 40px))` centered, so text is
  not flush to screen edges on tablets.
- `CourseShelf`, `DeckShelf`, and `CraftPanel` reuse the same vertical flow
  rules; their mobile overrides are kept in their own CSS files but aligned to
  the new 900px boundary.

### 5. Content pages

- Deck reader arrows become 48×48px on coarse pointers; the thumbnail strip
  allows horizontal swipe/scroll and hides overflow.
- Course video rows stack poster above copy below 640px.
- Article pages already use `min(760px, calc(100% - 48px))`; tighten padding to
  `16px` margins on the narrowest band.

### 6. Consolidation

Move the duplicated/overridden book-position rules from `site.css` back into
`field-manuals.css` so responsive behaviour has a single source of truth. Keep
`site.css` for article pages, QR dialog, and stage-wash-specific rules.

## Consequences

- More CSS, but the responsive story becomes explicit and testable per device
  class instead of interpolated between two distant breakpoints.
- Touch users get the same discovery cues as mouse users.
- The split-brain between `field-manuals.css` and `site.css` is removed, which
  prevents future regressions when a new volume is added.
- No content or data changes; the public URL structure is unchanged.

## Verification plan

1. `npm run build` exits 0.
2. Playwright captures full-page screenshots at:
   - 375×812 (iPhone SE / small phone)
   - 768×1024 (iPad portrait)
   - 1024×768 (iPad landscape)
   - 1440×900 (desktop)
3. Manual checks on each screenshot: no horizontal scroll, no clipped books,
   no text overlap, close button visible, Read badge visible on touch.

## Addendum 2026-11-01 — shelf interaction and mobile scrolling

Field feedback after the first pass changed two behaviours:

- **Swipe previews, tap opens.** A horizontal swipe on the gallery moves a
  focused volume and never navigates. The focused cover lifts (`scale 1.04`,
  `-14px`) while the others recede (`opacity .82`). On coarse pointers the
  first tap on a non-focused book only focuses it; the second tap opens it.
  Swipe-then-tap opens in one tap. Fine pointers keep single-click opening.
- **Mobile detail scrolls on the document.** `display: flow-root` on the stage
  contains the shelf's top margin without creating a scroll container, and
  `overflow-x: clip` keeps the off-canvas book transforms from widening the
  page. Non-selected books are `display: none` in mobile detail.

Acceptance additions:

- A swipe leaves the URL unchanged and moves `data-focused="true"` to the
  adjacent book.
- On touch, the first tap on a non-focused book leaves the URL unchanged and
  focuses it; the second tap opens it.
- On a mobile detail route, scrolling down <u>500 px</u> and back up returns
  `scrollTop` to 0 with the close button visible.

## Addendum 2026-11-01 (round 3, issue #7) — native shelf rail

Field feedback replaced the focus-swap gesture with a real shelf:

- **The shelf moves.** Below 900px the gallery is a native horizontal scroll
  container: `display: flex`, `overflow-x: auto`,
  `scroll-snap-type: x mandatory`, one card per snap point. Swiping pans the
  covers like a music-app carousel; the centred cover gets
  `data-focused="true"` and the rest recede. This supersedes the round-2
  "swipe previews without moving the shelf" and "two-tap open" behaviour.
- **One tap opens.** Tapping a cover opens its detail page immediately.
- **No nested scroll traps.** On mobile, `.detail-scroll`, `.course-shelf`,
  and `.deck-shelf` use `overflow: visible` and `overscroll-behavior: auto`,
  so a touch inside them scrolls the document. Previously `overflow-y: auto`
  plus `overscroll-behavior: contain` swallowed the gesture on Archive,
  Courses, and Decks.

Acceptance additions:

- The gallery at 390px has `scrollWidth > clientWidth`, `overflow-x: auto`,
  and `scroll-snap-type` containing `x`.
- Scrolling the rail to a cover sets `data-focused="true"` on it without
  changing the URL.
- One tap on a cover navigates to its route.
- `/archive`, `/courses`, `/decks`, and `/craft` at 390×844 scroll down and
  back to `scrollTop = 0`, with the pane's computed `overflow-y` equal to
  `visible`.
