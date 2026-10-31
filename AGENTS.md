# AGENTS.md

## Repo overview

Personal GitHub Pages site for Hang (Yohan) Yu. Vite + React SPA in a Field Manuals (ThreeUI) visual language: five CSS 3D books (Identity, Craft, Archive, Video Slides, Courses).

Live URL: `https://yhyu13.github.io`

## Commands

- `npm install`
- `npm run dev` — Vite at `/`
- `npm run build` — typecheck, Vite build, copy `dist/index.html` → `dist/404.html` (SPA fallback), then `scripts/check-links.mjs` (fails the build on any internal reference that does not resolve)
- `npm run preview`

## Git agent workflow

Work runs as: issue contract → `docs/<N>-<slug>` spec PR (publishes the design
under `docs/superpowers/`) → `feat|fix|chore/<N>-<slug>` implementation branch in
its own worktree → independent review → squash merge. Read
`docs/GIT_WORKFLOW.md` before opening a branch. Helpers:
`scripts/new-worktree.ps1`, `scripts/list-worktrees.ps1`,
`scripts/remove-worktree.ps1`. Red lines: never
commit to `master` directly, one writer per file per worktree, never `git stash`,
`Refs #N` never `Closes #N` without the user's approval, evidence block (quoted
command output) in every PR.

## Layout

- `src/data/manuals.ts` — the volumes (Identity, Craft, Archive, Video Slides, Courses)
- `src/data/courses.ts` — the Courses volume's page data (sections per course)
- `src/data/archivePosts.tsx` — 2017 Capsule and Rainbow reading pages
- `src/pages/Library.tsx` — gallery / detail shell ported from ThreeUI Field Manuals
- `src/pages/CoursePage.tsx`, `src/components/CourseShelf.tsx` — the Courses volume
- `src/styles/field-manuals.css` — ported Field Manuals CSS; **each book's shelf position is hand-declared per breakpoint** (`[data-book=…]`, three blocks) — a new volume needs its rule added or the book renders 0×0
- `public/courses/<slug>/files/` — exported courseware (static; no index.html at the course root — it would shadow the SPA route on Pages)
- `public/` — favicon, `uploads/me.jpg`, old-URL redirect HTML
- `.github/workflows/pages.yml` — build and deploy `dist/` to GitHub Pages
- `docs/GIT_WORKFLOW.md` — the issue → spec PR → worktree → implementation PR → review → merge loop
- `docs/superpowers/specs/`, `docs/superpowers/plans/` — SDD artifacts; a spec PR lands before its implementation branch is cut
- `scripts/` — build helpers (`check-links.mjs`, …) and worktree lifecycle (`new-worktree.ps1`, `list-worktrees.ps1`, `remove-worktree.ps1`)

## The Courses volume and its two-repo contract

Implemented. The courseware lives in `C:\Git-repo-AI\CS2680-Courseware`
(branch `001-cs2680-courseware`); this repo consumes an export of it. Read
before changing either side:

- Spec — `docs/superpowers/specs/2026-10-26-courses-volume-design.md`
- Plan — `docs/superpowers/plans/2026-10-26-courses-volume.md` (Definition of
  done is at its end)

The contract:

1. The courseware repo builds its own site (`tools/build_public_site.py`) and
   exports it (`tools/export_course_site.py --profile homepage --slug cs2680
   --release-tag <tag> --dest <this repo>\public\courses\cs2680`). The export
   is idempotent and asserts its manifest against the files it wrote.
2. The export writes only `files/` under the course directory. Never add an
   `index.html` beside it: on Pages a directory request serves that index and
   shadows the SPA's `/courses/<slug>` route.
3. The ten narrated clips are **GitHub Release assets**
   (`releases/download/courseware-v1/…`), not repo files. A re-export without
   `--release-tag` leaves the video rows as placeholders the page shows as
   unavailable.
4. `npm run build` runs the link checker last; it walks `public/**/*.html`,
   the site-absolute links in `src/data`, **and every course manifest.json**
   (advertised hrefs/posters must exist; binary file sizes must match — text
   files are exempt, a Windows checkout rewrites line endings). It treats
   extensionless single-segment paths under declared route prefixes as SPA
   routes, and everything else must exist as a file. SPA routes answer 404
   status + the shell — judge them by the body, not the status code.

## Deploy

GitHub Pages **must** use source **GitHub Actions**, not branch `master` / root. The workflow file does not switch that setting.

## Do not

- Restore Hexo / NexT
- Reintroduce Codex / Claude / Cursor covers or their embedded videos
- Edit `D:\GitRepo-AI\threeui` from this repo
