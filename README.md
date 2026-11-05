# Hang Yu

Personal site. A Field Manuals-style shelf of five volumes: Identity, Craft, Archive, Video Slides, Courses.

```bash
npm install
npm run dev
```

Build: `npm run build` (typecheck → Vite → 404 fallback → link check). GitHub Actions deploys `dist/` to Pages.

**Cutover:** in the GitHub repo, set Pages source to **GitHub Actions**. Leaving it on branch `master` will serve source files, not the SPA.

## The Courses volume

The fifth volume (`courses`, Field Manual · V) hosts online-course material.
CS2680 is the first course; `networking` (`How to Network`) is the second. It
is implemented; the contract below is how it stays correct.

- Spec: [docs/superpowers/specs/2026-10-26-courses-volume-design.md](docs/superpowers/specs/2026-10-26-courses-volume-design.md)
- Plan: [docs/superpowers/plans/2026-10-26-courses-volume.md](docs/superpowers/plans/2026-10-26-courses-volume.md)

The courseware itself lives in `C:\Git-repo-AI\CS2680-Courseware`; this repo
consumes an export of it. Re-export with:

```bash
python C:\Git-repo-AI\CS2680-Courseware\tools\export_course_site.py --profile homepage --slug cs2680 --release-tag courseware-v1 --dest public\courses\cs2680
```

The export is idempotent (only `files/manifest.json`'s timestamp moves), it
asserts its own manifest against the files it wrote, and it writes nothing at
the course root except `files/` — an `index.html` there would shadow this
site's own `/courses` route on Pages. The video clips are GitHub Release
assets (`courseware-v1`), not repo files. `npm run build` ends with a link
checker that fails on any internal reference that does not resolve.

The `networking` course lives in `C:\Git-repo-my\个人成长\networking-course`
(not a git repo) and has no study site. Its exporter is
`tools/export_course_site.py` there:

```bash
python C:\Git-repo-my\个人成长\networking-course\tools\export_course_site.py --profile homepage --slug networking --dest public\courses\networking
```

Its six clips are release assets (`courseware-networking-v1`). Its `text`
section has three groups — `notes`, `slides`, `transcript` — and the subtitle
files are served from the site, not from the release.
