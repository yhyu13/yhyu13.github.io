# Hang Yu

Personal site. A Field Manuals-style shelf of four volumes: Identity, Craft, Archive, Video Slides.

```bash
npm install
npm run dev
```

Build: `npm run build`. GitHub Actions deploys `dist/` to Pages.

**Cutover:** in the GitHub repo, set Pages source to **GitHub Actions**. Leaving it on branch `master` will serve source files, not the SPA.

## In progress: the Courses volume

A fifth volume (`courses`, Field Manual · V) to host online-course material — the
CS2680 courseware is the first course. The design is specified and the work is
planned; neither is implemented yet.

- Spec: [docs/superpowers/specs/2026-10-26-courses-volume-design.md](docs/superpowers/specs/2026-10-26-courses-volume-design.md)
- Plan: [docs/superpowers/plans/2026-10-26-courses-volume.md](docs/superpowers/plans/2026-10-26-courses-volume.md)

The courseware itself lives in `C:\Git-repo-AI\CS2680-Courseware`; this repo
consumes an export of it.
