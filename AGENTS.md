# AGENTS.md

## Repo overview

Personal GitHub Pages site for Hang (Yohan) Yu. Vite + React SPA in a Field Manuals (ThreeUI) visual language: three CSS 3D books (Identity, Craft, Archive).

Live URL: `https://yhyu13.github.io`

## Commands

- `npm install`
- `npm run dev` — Vite at `/`
- `npm run build` — typecheck, Vite build, copy `dist/index.html` → `dist/404.html` (SPA fallback)
- `npm run preview`

## Layout

- `src/data/manuals.ts` — the three volumes
- `src/data/archivePosts.tsx` — 2017 Capsule and Rainbow reading pages
- `src/pages/Library.tsx` — gallery / detail shell ported from ThreeUI Field Manuals
- `src/styles/field-manuals.css` — ported Field Manuals CSS
- `public/` — favicon, `uploads/me.jpg`, old-URL redirect HTML
- `.github/workflows/pages.yml` — build and deploy `dist/` to GitHub Pages

## Deploy

GitHub Pages **must** use source **GitHub Actions**, not branch `master` / root. The workflow file does not switch that setting.

## Do not

- Restore Hexo / NexT
- Reintroduce Codex / Claude / Cursor covers or their embedded videos
- Edit `D:\GitRepo-AI\threeui` from this repo
