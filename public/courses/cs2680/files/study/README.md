# CS2680 Courseware — static study site

A static, offline study site for **Harvard SEAS CS2680 "Modern AI Systems: Agents and
System Optimizations"** (Fall 2026, instructor Juncheng Yang).

Every page is a slide deck built with the [html-ppt](https://github.com/lewislulu/html-ppt-skill)
static-slide-deck system. There is **no build step**: open `index.html` in a browser and
it works, including from `file://` with no network.

---

## Open it

```
courseware/html/index.html
```

Double-click it, or drag it into a browser. Nothing else is required — no server, no
package install, no network.

From a terminal, if you prefer a local server (not required):

```bash
cd courseware/html
python -m http.server 8000     # then open http://localhost:8000/
```

**Open it in a landscape window.** The `html-ppt` deck system fills the viewport
(`100vw x 100vh`) with a fixed type scale, the way a presentation does. A portrait
or narrow window reflows the columns and clips the bottom of dense slides. Press
`F` for fullscreen, or use a 16:9 screen. Every slide was rendered at 1600x900
and checked for content running into the frame edge.

## Navigate

| Key | Action |
|---|---|
| `←` `→` / `Space` / `PgUp` `PgDn` | previous / next slide |
| `Home` / `End` | first / last slide |
| `F` | fullscreen |
| `O` | slide overview grid |
| `T` | cycle theme |
| `S` | presenter window (current + next slide, speaker script, timer) |
| `N` | speaker-notes drawer |
| `#/N` in the URL | deep link to slide N |

Every deck ends with a **Source & navigation** slide that links back to the index and
names the upstream Harvard URL the deck was generated from.

## The decks

| Deck | Slides | Upstream source |
|---|---|---|
| `decks/course-overview.html` | 14 | `https://cs2680.seas.harvard.edu/index.html` |
| `decks/lecture-01.html` | 16 | `.../slides/1_intro.pdf` |
| `decks/lecture-02.html` | 16 | `.../slides/2_agent_use_1.pdf` |
| `decks/lecture-03.html` | 18 | `.../slides/3_agent_use_2.pdf` |
| `decks/lecture-04.html` | 20 | `.../slides/4_agent_design_1.pdf` |
| `decks/lecture-05.html` | 17 | `.../slides/5_agent_design_2.pdf` |
| `decks/lecture-06.html` | 16 | `.../slides/6_agent_design_3.pdf` |
| `decks/lecture-07.html` | 21 | `.../slides/7_agent_design_4.pdf` |
| `decks/lecture-08.html` | 18 | `.../slides/8_agent_design_5.pdf` |
| `decks/agent-evaluation.html` | 15 | `.../notes/agent-evaluation.html` |
| `decks/cost-effective-agents.html` | 9 | `.../notes/cost-effective-agents.html` |
| `decks/transformers-llm-foundations.html` | 10 | `.../notes/transformers.html` |
| `decks/assignments-and-project.html` | 14 | `.../assignments/index.html` |
| `decks/part-ii-status.html` | 8 | `.../index.html` |

`index.html` is the hub: a deck that lists every other deck and links to it.

## Layout

```
courseware/html/
├── index.html            course landing page (a deck-style hub)
├── decks/<slug>.html     one deck per topic
├── assets/               vendored copy of the html-ppt asset set
│   ├── base.css          tokens + layout primitives
│   ├── fonts.css         webfont imports
│   ├── runtime.js        keyboard, presenter window, overview, theme cycling
│   ├── themes/           36 themes
│   └── animations/       CSS entry animations and canvas FX
├── build.mjs             the generator (engine + layout renderers)
├── content.mjs           the slide content model, derived from the digest
└── README.md
```

`assets/` is a verbatim copy of the html-ppt skill's `assets/` directory, with one
provenance header comment added to each `.css` / `.js` file so that the repository's
provenance gate can see where the vendored files are used. Nothing else was changed.

## Theme

All 14 decks use the **`academic-paper`** theme, with the same `data-themes` list on
every deck so the visual system is identical across the site. Press `T` to audition
alternatives: `editorial-serif`, `minimal-white`, `swiss-grid`, `corporate-clean`,
`engineering-whiteprint`.

The theme's font stack ends in `Georgia, serif`, so the site renders correctly with no
network: `fonts.css` asks for webfonts, and when they fail to load the deck falls back
to system serif. No layout depends on a webfont being present.

## Regenerate

The HTML is a reproducible artifact, not hand-typed. It is generated from the course
digest in `courseware/_digest/`:

```bash
cd courseware/html
node build.mjs            # regenerate index.html and decks/*.html
node build.mjs --check    # regenerate, then verify every number against the digest
```

`build.mjs` holds the layout renderers (each one copies the class structure of the
matching page in the html-ppt `templates/single-page/` directory); `content.mjs` holds
the slide content. `--check` extracts every number that appears on every generated page
and requires it to appear in the digest — it currently reports zero numbers that cannot
be traced.

Requirements: Node 18+ (uses only the standard library) and the digest files.

## Verify

From the repository root:

```bash
python tools/verify_deliverables.py --check-html
```

This resolves every internal link and local asset across the tree, checks each page for
boilerplate text, and requires each page to name its upstream source URL.

## Editorial rules the decks follow

These come from the digest's own "source discipline" notes and are worth knowing before
you edit a deck:

- **Nothing is invented.** Every number, name, date, percentage, benchmark, paper title
  and quoted phrase on a page appears in `courseware/_digest/`. Where two published
  pages disagree — the grading split, the Assignment 3 leaderboard formula, the bonus
  course-feedback cap, the Assignment 3 deliverable — the deck prints **both** readings
  with their source rather than silently choosing one.
- **Screenshot-only pages are not described.** Several source pages are image-based with
  no recoverable text; the decks do not paraphrase them.
- **Unpublished material is not filled in.** The Part II lectures (from 2026-10-19) have
  no published slide decks and Assignments 4 and 5 have no published spec.
  `decks/part-ii-status.html` states that gap precisely instead of papering over it.
- **Unattributed figures are not attributed.** One benchmark slide in Lecture 4 gives
  percentages with no benchmark name, model name or source; the deck reproduces the
  figures and says so.

## Provenance

Upstream: <https://cs2680.seas.harvard.edu/> — course home, lecture decks, reference
notes, assignment specifications, project page and policy page. The digest in
`courseware/_digest/` is the single source of truth used to author these decks; it
records the upstream URL, the page markers and the "Numbers and named entities" table
for every lecture.

Layout system: the html-ppt skill (MIT), vendored under `assets/`.
