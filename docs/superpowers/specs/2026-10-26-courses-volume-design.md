# Courses Volume — 课程课件卷（CS2680 为第一门课）

Date: 2026-10-26
Status: Draft for review
Author: Hang Yu + Mavis

## Problem

The site is a **Field Manuals** library: a gallery of 3D book covers, each opening a
detail panel. Four volumes exist — Identity (I), Craft (II), Archive (III) and
**Video Slides (IV, `decks`)**.

Volume IV already answers "a place to host course-ish material", but its promise is
narrow and single-shaped: **one video → one PDF of its slides → a link back to the
original video**. Its data model is literally `{slug, title, year, date, source,
sourceUrl, pdf, description}`. It cannot hold a course.

What exists to be hosted is the **CS2680 courseware** (Harvard SEAS *Modern AI
Systems: Agents and System Optimizations*, Fall 2026), built in
`C:\Git-repo-AI\CS2680-Courseware` and already published once at
`https://9grh7yl1bgyr4.space.mcode.cn`. It is not one deck. It is:

| Part | What | Size |
|---|---|---|
| `study/` | the interactive HTML study site — 17 pages, 251 slides, 143-concept index, offline search over 212 slides + 433 course-text pages | 86 files, 3.5 MB |
| `downloads/` | 10 PowerPoint decks + 10 JSON sidecars (125 slides total) | 20 files, 6.6 MB |
| `text/` | 27 page notes, 9 page-marked slide texts, 3 curated digest parts | 39 files, 1.3 MB |
| `posters/` | one contact sheet per narrated clip | 10 files, 7.3 MB |
| `archive/` | a byte-for-byte mirror of the published course site, incl. the 9 original slide PDFs | 51 files, 7.8 MB |
| — | 10 narrated MP4 clips (Edge TTS + captions + music) | 89.4 MB |

The open question is the **form**: where does a course of this shape live inside a
library whose units are books, and what does the visitor actually get when they
open it?

Two shapes were considered and rejected before this one was chosen.

**Rejected — a "Course" sub-type inside the Decks volume.** It would reuse the
`Deck` model and the existing reader, but it would break that volume's promise
("Video → PDF → download, no rebuild needed") and force a course bundle — an
interactive site, a search index, ten decks, ten videos, forty text files — into a
record shape built for one PDF. The Decks volume is a good shape for what it holds;
it is the wrong shape for this.

**Rejected — put the courseware on the homepage's own page (a single course, no
volume).** The user asked for a sub-page that hosts *various* online-course
material ("各种网课"), not one course. A single-course page does not scale to the
second course, and the shelf metaphor this site already uses would be the one
place it does not apply.

## Decision: a fifth volume, "Courses"

Add **Field Manual · V — `courses`**, alongside the existing four, as a peer of
Volume IV rather than a child of it.

- The shelf is the site's index and it stays the index: five books, each a body of
  work.
- A **Course** is a new record shape, parallel to `Deck`, because a course is a
  *bundle* (an interactive site, decks, videos, text, a licence) rather than a
  single artifact. Two models, two readers, one shelf.
- Volume IV keeps its promise untouched. Its 12 entries do not change.

```
ManualId = "identity" | "craft" | "archive" | "decks" | "courses"
```

## Decision: the courseware ships as static files, not as SPA routes

The study site is an `html-ppt` application: a fixed-viewport, 100vw × 100vh slide
deck that works from `file://` and needs no server. Re-implementing it inside React
would be a rewrite of 251 slides' worth of behaviour (keyboard paging, the `?preview=N`
mode, the search index) for no gain.

So the course's assets are **served as files** under a path that cannot collide with
the SPA's routes:

```
public/courses/<slug>/files/…      ← every asset the course owns, including manifest.json
/courses                            ← SPA route → Library openId="courses"  (shelf)
/courses/<slug>                     ← SPA route → CoursePage                (one course)
```

**No `index.html` anywhere under `public/courses/<slug>/`.** This is not a style
preference, it is load-bearing. GitHub Pages resolves a request against the file
system: a request for `/courses/cs2680` that matches a *directory* is redirected to
`/courses/cs2680/` and served with that directory's `index.html`. A course-local
`index.html` at the course root would therefore **shadow the SPA route**, and the
React course page would be unreachable for every course that has files — the
feature would look fine in the source tree and be dead on the live site. Everything
the course owns, the manifest included, lives under `files/`, so the course root
is not a directory Pages can resolve.

Pages serves a real file when one exists and falls back to `dist/404.html` (the SPA
shell) otherwise — `scripts/copy-404.mjs` already establishes that. A file under
`/courses/<slug>/files/` can therefore never shadow a route, and a route can never
shadow a file.

**Consequence:** a course's interactive pages open as their own pages, exactly like
the Archive volume's 2017 reports (`/archive/capsule` → `ArticlePage`). The homepage
never embeds them in an iframe: the study site is full-viewport by design, and
nesting it inside the SPA chrome would put two design systems in one frame.

## Decision: videos are linked, not hosted, and not embedded

`AGENTS.md` says: *do not reintroduce … their embedded videos*. The Decks volume
already follows the same discipline — it hosts a **PDF** of the slides and links to
the original video on YouTube/Bilibili. Two hard facts point the same way:

- GitHub Pages has a ~100 MB soft site cap, and the 10 MP4s are **89.4 MB** on
  their own. Adding them would roughly triple the deployed site and put the
  clips in the critical path of every page load.
- The clips are the user's **own** output with no third-party original to link
  back to, so the Decks model needs one adaptation: the "original" is a release
  asset on this repository.

**So:** the 10 MP4s are uploaded once as **GitHub Release assets**
(`gh release create courseware-v1 …`), which are served from `github.com`, do not
count against the Pages site, and give stable URLs:

```
https://github.com/yhyu13/yhyu13.github.io/releases/download/courseware-v1/lecture01.mp4
```

The course page lists every clip with its poster, its length, its scene and caption
counts, and a link to the asset. **No `<video>` element is embedded** — the Decks
precedent is to link, and a page carrying ten players is a bandwidth problem that
the release assets exist to avoid.

## Decision: the readable form is the HTML study site; the authoritative download is the PPTX

The course's slides exist three times: as HTML (the study site, with search and
concepts), as PPTX (authoritative, editable) and — not yet — as PDF.

- **Reading** happens in the study site. It already has more than the PDF reader
  offers: 143 concepts, cross-deck search, three reading routes.
- **Download** is the PPTX, the artifact the courseware actually generates.
- **PDF export is deliberately out of scope for v1.** Producing a per-deck PDF
  needs a renderer: LibreOffice is **not installed** on this machine (the Decks
  pipeline assumed `C:\Program Files\LibreOffice\program\soffice.exe`, which is
  absent today), and the alternative — slicing the 251 HTML slides with headless
  Edge and merging the single-page PDFs — needs a PDF merger this machine does not
  have either. The plan carries it as a **spike with a decision**, not as work.

## Decision: the course's own licence frame, not a redistribution of the course site

The courseware is derivative of Harvard SEAS and the instructor's material. The
repository's `NOTICE` states it is mirrored for personal study and is **not
licensed for redistribution**.

The homepage is a personal identity site. Two parts of the export are therefore
treated differently:

- **The courseware ships** — the study site, the decks, the text layer, the
  digest, the posters. This is the user's own study material, and every page in it
  names its upstream source.
- **The `archive/` mirror does not ship on the homepage.** The byte-for-byte copy
  of the published course site — with Harvard's own slide PDFs, staff photos and
  sponsor logos — is a redistribution of someone else's assets on a personal
  profile, and it is the least defensible thing to put there. The course page
  links to the official site for the originals, and to the dedicated archive site
  for the full mirror.

The course page states the licence in one line, on the page, next to the link to
the official source. The course's own `NOTICE.txt` ships inside the course subtree.

This also keeps the homepage's deployed size at **~19 MB** of course assets instead
of ~27 MB.

## Architecture

### 1. Data model — `src/data/courses.ts` (new)

```ts
export type CourseSectionKind =
  | "site"      // the interactive study site
  | "decks"     // downloadable decks
  | "videos"    // narrated clips, linked to release assets
  | "text"      // page notes and slide texts
  | "digest"    // the curated digest
  | "notice";   // the licence and the upstream source

export type CourseAsset = {
  label: string;
  href: string;      // site-relative, or an absolute URL for a release asset
  meta?: string;     // "22 s · 8 scenes · 15 captions" / "422 KB"
  external?: boolean;// opens in a new tab (release assets, the official site)
  poster?: string;   // an image shown beside the row (videos)
};

export type CourseSection = {
  kind: CourseSectionKind;
  label: string;
  description: string;
  assets: CourseAsset[];
};

export type Course = {
  slug: string;
  title: string;         // "CS2680 · Modern AI Systems"
  titleEn: string;
  term: string;          // "Fall 2026"
  institution: string;   // "Harvard SEAS"
  instructor: string;    // "Juncheng Yang"
  sourceUrl: string;     // the official course site
  licence: string;       // one sentence
  color?: string;
  sections: CourseSection[];
};

export const COURSES: Course[] = [ /* one entry per course */ ];
export function getCourse(slug: string | undefined): Course | undefined;
```

**The file lists are generated, not hand-written.** There are 59 downloadable files
across the four asset groups; a hand-maintained list drifts the moment an asset is
added. The export writes `public/courses/<slug>/files/manifest.json`:

```json
{
  "slug": "cs2680",
  "title": "CS2680 · Modern AI Systems",
  "exportedAt": "2026-10-26T…Z",
  "source": "C:\\Git-repo-AI\\CS2680-Courseware",
  "groups": {
    "decks":   [{ "label": "lecture-01-course-overview.pptx", "href": "…", "bytes": 431777 }],
    "videos":  [{ "label": "Lecture 01", "href": "…", "poster": "…", "meta": "73 s · 8 scenes · 15 captions" }],
    "text":    [{ "label": "policy.md", "href": "…", "bytes": 14982 }],
    "digest":  [{ "label": "part1.md", "href": "…", "bytes": 65470 }]
  },
  "notice": "…"
}
```

`CoursePage` renders the **curated** copy from `src/data/courses.ts` (title, term,
licence, the prose of each section) and the **file lists** from the manifest
(fetched at runtime from `/courses/<slug>/files/manifest.json`). One fetch, one
loading state, one error state.

### 2. Export — `tools/export_course_site.py` in the **CS2680** repo (new)

The CS2680 repo owns the assets, so the export tool lives there and the homepage
repo consumes its output. It is a profile of the existing
`tools/build_public_site.py`, not a second implementation:

```
python tools/export_course_site.py --profile homepage --slug cs2680 \
    --dest "C:\Git-repo-my\yhyu13.github.io\public\courses\cs2680"
```

What it does, and what it must not do:

| Rule | Why |
|---|---|
| Copy `study/`, `downloads/`, `text/`, `posters/`, `NOTICE.txt` into `files/` | the course's own artefacts |
| **Do not** copy `archive/` | the licence decision above |
| Do **not** copy the mcode.cn landing page or `videos.html` | their copy ("MP4 没有上传到本站", "文件保存在仓库的 … 目录里") is true for that site and false here — the homepage ships its own copy |
| Generate a course-local `text.html` **inside `files/`** | every link must resolve to something that was actually exported |
| **Do not** write an `index.html` at the course root | it would shadow the SPA route — see the layout decision above |
| Write `files/manifest.json` | the file lists the page renders |
| Be idempotent and deterministic | re-running produces the same bytes |
| Record the source repo, the export date and every file's size | the page can say where it came from |

The export also **rewrites the course's own sub-page copy** for its new home: the
study site's own `index.html` stays as it is (it is the course's reading hub and its
links are all internal), but the course-local `text.html` and the licence block are
written for the homepage context.

### 3. Library integration

- `src/data/manuals.ts`: add `"courses"` to the `ManualId` union and append a fifth
  `Manual` — kicker `Field Manual · V`, coverTitle `Courses`, subtitle
  `网课 · 课件 · 交互页`, `actions: [{label: "Browse courses", href: "/courses"}]`.
  The cover inherits the shelf's 3D book treatment unchanged; the new cover's
  colour comes from the same palette the other four use.
- `src/pages/Library.tsx`: when `openId === "courses"`, render `CourseShelf`
  instead of the text `DetailPanel` — the same seam the Decks volume uses. The
  topbar, parallax, close button, QR share and blossoms are reused untouched.
- The menu layer, the gallery and the toast need no change: they iterate
  `MANUALS`, so the fifth book appears in all three automatically.

### 4. Routes — `src/App.tsx`

```
/courses            → <Library openId="courses" />
/courses/:slug      → <CoursePage />            (React.lazy, like DeckReader)
```

### 5. Components

**`src/components/CourseShelf.tsx`** — the volume's detail view. One card per
course: title, term, institution, a one-line description, and a row of counts
(decks / clips / pages) read from the manifest. Cards link to `/courses/<slug>`.
Reuses the `.deck-card` vocabulary (`pill`, `kicker`, `.action-rail`).

**`src/pages/CoursePage.tsx`** — one course. A toolbar (back to `/courses`, QR
share — the `ArticlePage` pattern), a header (kicker = term, title, meta line =
institution · instructor · a link to the official site), then one **section** per
`CourseSectionKind`:

| Section | What it shows |
|---|---|
| 学习站 | a card for the interactive study site, with its three entry points (读 / 概念索引 / 全文搜索) and a line saying it opens as its own page |
| 讲义 | one row per deck: filename, slide count, size, download |
| 视频 | one card per clip: poster, title, length, scene/caption counts, link to the release asset |
| 文字 | two groups (page notes, slide texts) with counts |
| 摘要 | the three digest parts, each with its scope line |
| 版权 | the licence sentence, the official URL, and the `NOTICE.txt` link |

Loading and failure are explicit: a failed manifest fetch renders an inline
message plus the direct link to the course's static directory — never a blank
page.

### 6. Styles

`src/styles/courses.css`, imported in `main.tsx` after `site.css` (the Decks
precedent). It reuses the existing tokens — `--paper --ink --ink-deep --ink-soft
--muted --brass --clay --moss --sage --pink --serif --ease` — and the existing
class vocabulary (`pill`, `kicker`, `topbar`, `brand`, `nav-actions`,
`icon-button`, `detail-title`, `detail-description`, `doc-section`, `doc-label`,
`action-rail`, `article-*`). It introduces **no new theme**: the course page is a
page of this site, not a second site.

### 7. Video assets — GitHub Release

```
gh release create courseware-v1 "CS2680 courseware clips" \
   courseware/remotion/final/*.mp4
```

The asset URLs are recorded in the exported manifest as absolute URLs, and the
course page marks them `external: true`.

### 8. What is explicitly out of scope

- **Embedding** the study site in an iframe (see Decision 2).
- **Embedding** video players (see Decision 3).
- **PDF export** of the course decks (see the spike in the plan).
- **A second course.** The model and the shelf are built for many; the data file
  ships with one. The second course is the proof that the shape is right.
- **Mirroring the course site** (see the licence decision).
- Touching the other four volumes, the Decks entries, or the 2017 notes.

## Error handling

- Export script: missing source repo, missing source directory, or a missing
  narration manifest → clear message, non-zero exit, nothing partial left behind.
- Manifest fetch fails → the course page shows an inline error with a direct link
  to the course's static directory, plus a link back to the shelf.
- A release asset URL 404s (a release deleted) → the row still shows the poster,
  the title and the length, with the download link marked unavailable rather than
  a dead button.
- A study-site path 404s → the study site is served as static files; the link is
  verified by the link check before the commit, so this is caught in CI, not by a
  visitor.

## Accessibility

- The course page is a document: real headings in order, real lists, real links.
  Each section's list is a `<ul>`; each row's actions are real `<a>`/`<button>`.
- The video posters carry `alt` text that names the clip and its length, so a
  screen reader gets the same information a sighted reader gets from the card.
- The link check (below) is the mechanical half of accessibility: a link that
  resolves to nothing is a keyboard trap, not just a 404.
- `prefers-reduced-motion` is respected, as everywhere else in this site.
- The study site is an `html-ppt` deck: it already requires a landscape window
  and documents that; the course page says so before the visitor opens it.

## Testing / verification

**Before the commit**

- `npm run build` clean (it runs `tsc --noEmit`).
- A new `scripts/check-links.mjs` walks `public/` and the course subtree and
  fails on any internal reference that does not resolve — the same class of
  defect that the CS2680 repo found and fixed twice.
- The exported `manifest.json` lists exactly the files that were exported: the
  export script asserts it, and the link check re-checks it from the other side.

**After the commit**

- The GitHub Actions build publishes `dist/`; check the live site:
  `https://yhyu13.github.io/courses` (shelf), `/courses/cs2680` (course page),
  `/courses/cs2680/files/study/index.html` (study site), one deck download, one
  release-asset video link.
- A manual click-through with the browser, in this order: open the fifth book →
  the course card → the course page → the study site → back → a deck download →
  a video link.
- The study site must still work from `file://` after the export (it is a static
  app; the export must not have broken its relative paths).

## Open questions / risks

- **The CS2680 repo's own gates are the upstream contract.** The export must not
  be able to ship a course that fails them; the homepage side re-runs the link
  check and the manifest assertion, and the CS2680 side keeps its 11 gates.
- **The courseware's copy is context-bound.** The mcode.cn pages say "MP4 没有上传
  到本站" and "文件保存在仓库的 … 目录里". Those sentences are true there and false
  on the homepage, where the clips *are* downloadable from a release. The export
  therefore writes the course-local pages rather than copying them; this is a
  rule the export script has to keep, not a one-off.
- **Release assets are a second place to keep files.** Deleting the release breaks
  the video links. The manifest records the release tag so a rebuild can be
  checked against it.
- **The posters are 7.3 MB of PNG.** They load lazily and are only reached from
  the video section, so they do not sit on the critical path — but they are the
  largest single group after the decks. Downscaling them is an optimisation, not a
  requirement, and is scoped as such.
- **Pages' 100 MB soft site cap.** After this change the deployed site is roughly
  19 MB of course assets on top of the existing 12 MB — comfortably inside it,
  and it only stays that way because the MP4s are not hosted.
