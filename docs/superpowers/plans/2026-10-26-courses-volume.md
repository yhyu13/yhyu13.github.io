# Courses Volume Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fifth volume, `courses` (Field Manual · V), to the Field Manuals library, and fill it with the CS2680 courseware: the interactive study site, the ten decks, the ten narrated clips, the text layer and the digest — served as static files, linked from a course page, with the videos hosted as release assets rather than on Pages.

**Architecture:** A new `Course` record shape (parallel to `Deck`, not a variant of it) lives in `src/data/courses.ts`; a fifth `Manual` entry puts a new book on the shelf; `CourseShelf` is the volume's list view and `CoursePage` is one course's page; the course's own artefacts are **files** under `public/courses/<slug>/files/`, exported from the CS2680 repo by `tools/export_course_site.py`; the 10 MP4s are uploaded once as a GitHub Release and linked, never embedded. The site serves a real file when one exists and falls back to `dist/404.html` (the SPA shell) otherwise, so files and routes can never collide.

**Tech Stack:** Vite 7 + React 19 + react-router 7, TypeScript 5.9, Node ESM scripts, `pdfjs-dist` (existing, unused by this feature), GitHub Actions → GitHub Pages. The CS2680 side is Python 3 + `pillow` + `ffmpeg` (existing).

**Spec:** [docs/superpowers/specs/2026-10-26-courses-volume-design.md](docs/superpowers/specs/2026-10-26-courses-volume-design.md)

**Cross-repo contract:** the export tool lives in `C:\Git-repo-AI\CS2680-Courseware` (it owns the assets); this repo consumes its output. Two repos, two commits, in this order: export first, then the homepage change.

---

## Global Constraints

- **Do not edit the four existing volumes.** `identity`, `craft`, `archive` and `decks` (12 entries) stay byte-identical. The only change to `manuals.ts` is the *addition* of a fifth entry and one string in the `ManualId` union.
- **Do not introduce a second visual theme.** The course page reuses the existing tokens (`--paper --ink --ink-deep --ink-soft --muted --brass --clay --moss --sage --pink --serif --ease`) and the existing class vocabulary (`pill`, `kicker`, `topbar`, `brand`, `nav-actions`, `icon-button`, `detail-title`, `detail-description`, `doc-section`, `doc-label`, `action-rail`, `article-*`). No new colour literals in `courses.css` beyond the ones the other volumes already use.
- **Static files live under `/courses/<slug>/files/`, routes live at `/courses` and `/courses/<slug>`.** The `files/` segment is what makes them collision-proof — do not move the assets to `/courses/<slug>/` directly.
- **No `index.html` anywhere under `public/courses/<slug>/`.** GitHub Pages redirects a request for a *directory* to that directory's `index.html`; a course-local index at the course root would shadow the SPA route and the course page would be unreachable on the live site. Everything, the manifest included, lives under `files/`.
- **No MP4 on Pages.** 89.4 MB would take the deployed site past its ~100 MB soft cap. Videos go to a GitHub Release and are linked.
- **No embedded `<video>` and no iframe.** Both are explicitly rejected in the spec. Link out; let the study site open as its own page.
- **`archive/` is not exported to the homepage.** The courseware ships; the byte-for-byte mirror of Harvard's site stays on the dedicated archive site. The course page links to the official source.
- **The course's own copy is regenerated, never copied.** The mcode.cn pages say "MP4 没有上传到本站"; that is false here. The export writes fresh course-local pages.
- **Every task ends with `npm run build` clean** (it runs `tsc --noEmit`).
- **Every task ends with a commit.** One commit per task, message as shown.
- `prefers-reduced-motion` respected. `React.lazy` for anything not on the first paint.
- The CS2680 repo keeps its own 11 gates green; this repo adds its own link check.

---

### Task 0: Sync the clone and record the baseline

**Files:**
- Modify: none

**Interfaces:**
- Produces: a working tree that matches `origin/master`, and a recorded baseline (commit + build state) that the last task can be compared against.

- [ ] **Step 1: Fetch and fast-forward**

```bash
cd /c/Git-repo-my/yhyu13.github.io
git fetch origin --prune
git merge --ff-only origin/master
git status -sb
```

Expected: `## master...origin/master` with no divergence. **This step is not optional**: the local clone was two months stale (2026-07-11) while the live site had moved to a Vite/React rewrite (2026-09-06) with a `decks` volume that did not exist locally. Everything below assumes the current tree.

- [ ] **Step 2: Record the baseline**

```bash
git log --oneline -1
npm ci
npm run build
```

Expected: `tsc --noEmit` clean, `vite build` succeeds, `dist/index.html` and `dist/404.html` both exist.

- [ ] **Step 3: Confirm the existing volume renders**

```bash
ls public/decks/*.pdf | wc -l
```

Expected: `12`. If it is not 12, stop and report — the baseline is not what the spec was written against.

---

### Task 1: The export tool (in the CS2680 repo)

**Files:**
- Create: `C:\Git-repo-AI\CS2680-Courseware\tools\export_course_site.py`
- Read (not modified): `C:\Git-repo-AI\CS2680-Courseware\tools\build_public_site.py`

**Interfaces:**
- Consumes: the CS2680 repo's `deploy/public/` (the already-built course site).
- Produces: a destination directory containing `files/` — every course artefact
  **and** `files/manifest.json`. **No `index.html` at the destination root**: a
  course-local index would shadow the SPA route at `/courses/<slug>`. CLI:
  `python tools/export_course_site.py --profile homepage --slug cs2680 --dest <dir>`

- [ ] **Step 1: Write the export script**

```python
#!/usr/bin/env python3
"""Export one course's artefacts for a hosting site.

The CS2680 repo owns the assets; the site that shows them does not. This script
copies the course's own files into a target site and writes the manifest and the
course-local pages that describe exactly what was copied.

    python tools/export_course_site.py --profile homepage --slug cs2680 \
        --dest "C:\\Git-repo-my\\yhyu13.github.io\\public\\courses\\cs2680"

Two profiles exist because the two homes say different things:

  mcode     the standalone course site: it also carries the byte-for-byte
            mirror of the published course site under archive/.
  homepage  the personal site: only the courseware, because a personal profile
            is not the place to redistribute a third party's course site.

The course's own pages are regenerated for each profile. The mcode pages say
"the MP4s are not uploaded here" - true there, false on a site where the clips
are downloadable from a release. Copying them would put a lie on the page.
"""

from __future__ import annotations

import argparse
import datetime
import hashlib
import json
import shutil
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
COURSEWARE = REPO / "courseware"
REMOTION = COURSEWARE / "remotion"

PROFILES = {
    "homepage": {
        "copy_dirs": ["study", "downloads", "text", "posters"],
        "copy_files": ["NOTICE.txt"],
        "with_archive": False,
    },
    "mcode": {
        "copy_dirs": ["study", "downloads", "text", "posters", "archive"],
        "copy_files": ["NOTICE.txt"],
        "with_archive": True,
    },
}
```

The rest of the script:

```python
def human(n: int) -> str:
    return f"{n / 1024 / 1024:.1f} MB" if n >= 1024 * 1024 else f"{n / 1024:.0f} KB"


def build_source() -> Path:
    src = REPO / "deploy" / "public"
    if not src.is_dir():
        raise SystemExit(
            f"no built course site at {src}. Run tools/build_public_site.py first."
        )
    return src


def course_title() -> str:
    return "CS2680 · Modern AI Systems"


def clip_rows(project: Path) -> list[dict]:
    """One row per narrated clip, read from the narration manifests."""
    rows = []
    for json_path in sorted((project / "narration").glob("*.json")):
        data = json.loads(json_path.read_text(encoding="utf-8"))
        scenes = data["scenes"]
        rows.append({
            "id": data["id"],
            "title": data.get("title", data["id"]),
            "seconds": round(sum(float(s["seconds"]) for s in scenes), 2),
            "scenes": len(scenes),
            "captions": sum(len(s.get("cues") or []) for s in scenes),
        })
    return rows
```

- [ ] **Step 2: Add the manifest writer**

The manifest is the contract between the export and the course page:

```python
def write_manifest(dest: Path, slug: str, groups: dict[str, list[dict]],
                   notice: str, release_tag: str | None) -> None:
    manifest = {
        "slug": slug,
        "title": course_title(),
        "exportedAt": datetime.datetime.now(
            datetime.timezone.utc).isoformat(timespec="seconds"),
        "source": str(REPO),
        "releaseTag": release_tag,
        "groups": groups,
        "notice": notice,
    }
    (dest / "files" / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
```

Every entry in `groups` carries `label`, `href` (relative to `files/`), `bytes`, and
for videos `poster` and `meta` (`"73 s · 8 scenes · 15 captions"`). Video `href`s
are absolute release URLs when `--release-tag` is given, and are left as
`files/…` placeholders otherwise — Task 9 fills them in.

- [ ] **Step 3: Add the course-local pages**

`index.html` and `text.html` are generated, not copied. Both are written for the
profile: `homepage` says the clips are downloadable from a release; `mcode` says
they are not uploaded. Both link only to files that were actually exported, and
both carry the licence line and the official source URL.

- [ ] **Step 4: Make the export idempotent and verifiable**

```bash
cd /c/Git-repo-AI/CS2680-Courseware
python tools/export_course_site.py --profile homepage --slug cs2680 --dest /tmp/exp1
python tools/export_course_site.py --profile homepage --slug cs2680 --dest /tmp/exp2
diff -r /tmp/exp1 /tmp/exp2 && echo "IDEMPOTENT"
```

Expected: no differences except the `exportedAt` timestamp inside
`files/manifest.json` — so compare the trees with that one key excluded, and assert
every other file's SHA-256 matches.

- [ ] **Step 5: Assert the manifest matches the files**

Add to the script: after writing the manifest, walk `files/`, and for every entry
in `groups` assert the referenced file exists and its size matches `bytes`. Any
mismatch is a hard error. This is the invariant that stops the page from
advertising a file that was not exported.

- [ ] **Step 6: Commit (in the CS2680 repo)**

```bash
cd /c/Git-repo-AI/CS2680-Courseware
git add tools/export_course_site.py
git commit -m "feat: add a course export tool for hosting sites"
```

---

### Task 2: Export the course into the homepage repo

**Files:**
- Create: `public/courses/cs2680/**` (the exported tree, ~155 files)

**Interfaces:**
- Produces: `public/courses/cs2680/files/{study,downloads,text,posters}/…`,
  `public/courses/cs2680/files/manifest.json`, and the course's own
  `files/text.html`. **Nothing but `files/` at the course root.**

- [ ] **Step 1: Run the export**

```bash
cd /c/Git-repo-AI/CS2680-Courseware
python tools/export_course_site.py --profile homepage --slug cs2680 \
    --dest "C:\\Git-repo-my\\yhyu13.github.io\\public\\courses\\cs2680"
```

- [ ] **Step 2: Verify the tree**

```bash
cd /c/Git-repo-my/yhyu13.github.io
ls public/courses/cs2680
ls public/courses/cs2680/files
du -sh public/courses/cs2680
```

Expected: `files/` only at the course root; inside `files/`: `study downloads
text posters manifest.json text.html NOTICE.txt`; total well under 25 MB.
**`archive/` must be absent**, and **there must be no `index.html` at the course
root** — if either is present, the profile is wrong.

- [ ] **Step 3: Verify the study site still works from `file://`**

Open `public/courses/cs2680/files/study/index.html` from disk. Expected: the deck
loads, the arrow keys page, and `concepts.html` and `search.html` resolve. The
export must not have rewritten anything inside `study/`.

- [ ] **Step 4: Commit**

```bash
cd /c/Git-repo-my/yhyu13.github.io
git add public/courses
git commit -m "feat: add the CS2680 courseware as static files"
```

---

### Task 3: The course data model

**Files:**
- Create: `src/data/courses.ts`

**Interfaces:**
- Produces: `type Course`, `type CourseSection`, `type CourseAsset`,
  `type CourseSectionKind`, `COURSES: Course[]`, `getCourse(slug)`.

- [ ] **Step 1: Write the module**

```ts
export type CourseSectionKind =
  | "site"
  | "decks"
  | "videos"
  | "text"
  | "digest"
  | "notice";

export type CourseAsset = {
  label: string;
  href: string;
  meta?: string;
  external?: boolean;
  poster?: string;
};

export type CourseSection = {
  kind: CourseSectionKind;
  label: string;
  description: string;
  /** Groups of assets, e.g. one for "page notes" and one for "slide texts". */
  groups?: { label: string; assets: CourseAsset[] }[];
};

export type Course = {
  slug: string;
  title: string;
  titleEn: string;
  term: string;
  institution: string;
  instructor: string;
  sourceUrl: string;
  licence: string;
  color?: string;
  sections: CourseSection[];
};

export const COURSES: Course[] = [
  {
    slug: "cs2680",
    title: "CS2680 · Modern AI Systems",
    titleEn: "Modern AI Systems: Agents and System Optimizations",
    term: "Fall 2026",
    institution: "Harvard SEAS",
    instructor: "Juncheng Yang",
    sourceUrl: "https://cs2680.seas.harvard.edu/",
    licence:
      "课程材料版权归 Harvard SEAS 与授课教师所有；本站仅供个人学习，课件为学习整理，未获授权再分发。",
    color: "#3f5b63",
    sections: [
      {
        kind: "site",
        label: "学习站",
        description:
          "17 个页面、251 张幻灯片：概念索引（143 条，逐条深链到讲它的那一页）、离线全文搜索（212 张幻灯片 + 433 页课程文本）、三条阅读路线。打开后是一个独立页面。",
        groups: [
          {
            label: "入口",
            assets: [
              { label: "读 · 三条阅读路线", href: "/courses/cs2680/files/study/index.html" },
              { label: "概念索引", href: "/courses/cs2680/files/study/concepts.html" },
              { label: "全文搜索", href: "/courses/cs2680/files/study/search.html" },
            ],
          },
        ],
      },
      {
        kind: "decks",
        label: "讲义",
        description: "10 份 PowerPoint 讲义，共 125 张幻灯片；每份非封面页带页码徽章与来源标注。",
      },
      {
        kind: "videos",
        label: "视频",
        description:
          "10 段导览视频（9 段按讲义各一段，外加 1 段垂直栈主线），共 14 分 42 秒。每段带 Edge TTS 旁白、浏览器渲染字幕与程序生成的背景音乐。",
      },
      {
        kind: "text",
        label: "文字",
        description:
          "课程的完整文字层：27 份公开页面的 Markdown 笔记，9 份讲义 PDF 的逐页文本。",
      },
      {
        kind: "digest",
        label: "摘要",
        description:
          "三份策展摘要，是三套课件共同的唯一输入；每个数字都能追到具体来源页码。",
      },
      {
        kind: "notice",
        label: "版权与出处",
        description:
          "材料版权归 Harvard SEAS 与授课教师所有。请优先访问官方地址。",
      },
    ],
  },
];

export function getCourse(slug: string | undefined): Course | undefined {
  return COURSES.find((course) => course.slug === slug);
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/data/courses.ts
git commit -m "feat: add the course data model and the CS2680 entry"
```

---

### Task 4: The fifth volume on the shelf

**Files:**
- Modify: `src/data/manuals.ts`

**Interfaces:**
- Produces: `ManualId` gains `"courses"`; `MANUALS` gains a fifth entry. The gallery, the menu layer and the toast all iterate `MANUALS`, so the new book appears in all three with no further change.

- [ ] **Step 1: Extend the union**

```ts
export type ManualId = "identity" | "craft" | "archive" | "decks" | "courses";
```

- [ ] **Step 2: Append the manual**

Add after the `decks` entry:

```ts
  {
    id: "courses",
    kicker: "Field Manual · V",
    coverTitle: "Courses",
    subtitle: "网课 · 课件 · 交互页",
    footer: "CS2680 · Notes · Clips",
    coverColor: "#3f5b63",
    coverInk: "#1c2c31",
    year: "2026",
    description:
      "网课的完整学习包：可交互的学习站、可下载的讲义、带旁白与字幕的导览视频，以及课程的文字层。CS2680 是第一门。",
    stepsLabel: "How to read this volume",
    steps: [
      {
        title: "打开一门课",
        body: "每门课是一份打包的档案：学习站、讲义、视频、文字与摘要，各归其位。",
      },
      {
        title: "先读，再下载",
        body: "学习站是阅读的地方——有概念索引和全文搜索；讲义是拿走的东西。",
      },
      {
        title: "视频带旁白",
        body: "每段视频都有旁白与字幕，字幕由画面自己渲染，所以缺字也不会变豆腐块。",
      },
    ],
    excerptLabel: "First course",
    excerpt: "CS2680 · Modern AI Systems · Harvard SEAS · Fall 2026",
    reviewLabel: "Before you leave",
    review:
      "课程材料版权归 Harvard SEAS 与授课教师所有；这里是个人学习的整理，不是原站的分发。",
    actions: [{ label: "Browse courses", href: "/courses" }],
  },
```

- [ ] **Step 3: Verify the build and the shelf**

Run: `npm run build && npm run preview`
Expected: clean build; the preview shows **five** books, the fifth labelled
"Field Manual · V / Courses".

- [ ] **Step 4: Commit**

```bash
git add src/data/manuals.ts
git commit -m "feat: add the Courses volume to the shelf"
```

---

### Task 5: The course shelf

**Files:**
- Create: `src/components/CourseShelf.tsx`

**Interfaces:**
- Consumes: `COURSES` from `src/data/courses.ts`; the exported `files/manifest.json` for the counts.
- Produces: `<CourseShelf />`, rendered by `Library` when `openId === "courses"`. Cards link to `/courses/<slug>`.

- [ ] **Step 1: Write the shelf**

The card language is `DeckShelf`'s, not a new one. The counts come from the
manifest, so they cannot disagree with what was exported:

```tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { COURSES, type Course } from "../data/courses";

type CourseManifest = {
  groups: Record<string, { label: string; href: string }[]>;
};

export function CourseShelf() {
  return (
    <section className="course-shelf" aria-label="Courses">
      <h2 className="detail-title">Courses</h2>
      <p className="detail-description">
        网课学习包：可交互的学习站、讲义、带旁白的视频，以及课程的文字层。
      </p>
      <div className="course-grid">
        {COURSES.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: Course }) {
  const [counts, setCounts] = useState<string>("");
  useEffect(() => {
    let cancelled = false;
    fetch(`/courses/${course.slug}/files/manifest.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: CourseManifest | null) => {
        if (cancelled || !data) return;
        const decks = data.groups.decks?.length ?? 0;
        const videos = data.groups.videos?.length ?? 0;
        setCounts(`${decks} 份讲义 · ${videos} 段视频`);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [course.slug]);

  return (
    <article className="course-card">
      <Link
        className="course-card-cover"
        to={`/courses/${course.slug}`}
        aria-label={`Open ${course.title}`}
        style={{ ["--cover-color" as string]: course.color ?? "#3f5b63" }}
      >
        <span className="course-card-kicker">{course.term}</span>
        <span className="course-card-title">{course.title}</span>
        <span className="course-card-meta">
          {course.institution} · {course.instructor}
        </span>
      </Link>
      <div className="course-card-body">
        <p className="course-card-desc">{course.sections[0]?.description ?? ""}</p>
        {counts ? <p className="course-card-counts">{counts}</p> : null}
        <div className="action-rail">
          <Link className="pill" to={`/courses/${course.slug}`}>
            Open
          </Link>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/CourseShelf.tsx
git commit -m "feat: add the CourseShelf volume listing"
```

---

### Task 6: The course page

**Files:**
- Create: `src/pages/CoursePage.tsx`

**Interfaces:**
- Consumes: `getCourse` from `src/data/courses.ts`; the exported `files/manifest.json`.
- Produces: `<CoursePage />` at `/courses/:slug`. The toolbar follows `ArticlePage`
  (back link + QR share); the body is one section per `CourseSectionKind`.

- [ ] **Step 1: Write the page**

```tsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QrShare, QrTrigger } from "../components/QrShare";
import { getCourse, type CourseAsset, type Course } from "../data/courses";

type Manifest = {
  groups: Record<string, { label: string; href: string; meta?: string; poster?: string; bytes?: number }[]>;
  notice?: string;
};

export function CoursePage() {
  const { slug } = useParams();
  const course = slug ? getCourse(slug) : undefined;
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState("");
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    if (!course) return;
    let cancelled = false;
    fetch(`/courses/${course.slug}/files/manifest.json`)
      .then((r) => {
        if (!r.ok) throw new Error("manifest missing");
        return r.json();
      })
      .then((data: Manifest) => {
        if (!cancelled) setManifest(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load this course's file list.");
      });
    return () => {
      cancelled = true;
    };
  }, [course]);

  useEffect(() => {
    document.title = course ? `${course.title} · Hang Yu` : "Hang Yu";
    return () => {
      document.title = "Hang Yu";
    };
  }, [course]);

  if (!course) return null;

  return (
    <article className="article-page course-page">
      <div className="article-toolbar">
        <Link className="article-back" to="/courses">
          ← Courses
        </Link>
        <QrTrigger onClick={() => setQrOpen(true)} />
      </div>
      <div className="article-inner">
        <p className="article-kicker">
          {course.term} · {course.institution}
        </p>
        <h1>{course.title}</h1>
        <p className="article-meta">
          {course.titleEn} · {course.instructor} ·{" "}
          <a href={course.sourceUrl} target="_blank" rel="noopener noreferrer">
            官方课程页
          </a>
        </p>
        {error ? <p className="qr-error">{error}</p> : null}
        {course.sections.map((section) => (
          <section key={section.kind} className="course-section">
            <p className="doc-label">{section.label}</p>
            <p className="detail-description">{section.description}</p>
            <CourseSectionBody section={section} manifest={manifest} />
          </section>
        ))}
        <p className="article-tags">
          <span># 课程归档</span>
          <span># {course.term}</span>
        </p>
      </div>
      <QrShare open={qrOpen} onClose={() => setQrOpen(false)} />
    </article>
  );
}
```

- [ ] **Step 2: Write the section body**

`CourseSectionBody` renders three shapes, and they must not be faked into one
another:

- `site` — the three entry links, as a list of `pill` actions.
- `decks` / `videos` / `text` / `digest` — the manifest's groups, one row per
  asset. A video row shows its poster, its title, its meta line and a link to the
  release asset; a deck or text row shows its filename and its size.
- `notice` — the licence sentence, the official URL and the `NOTICE.txt` link.

- [ ] **Step 3: Handle the "not exported" case honestly**

If a manifest group is missing, render the section's description and a link to
the course's static directory — not a link to a file that is not there.

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/pages/CoursePage.tsx
git commit -m "feat: add the course page"
```

---

### Task 7: Routes and the Library seam

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/pages/Library.tsx`

**Interfaces:**
- Produces: `/courses` → the shelf; `/courses/:slug` → the course page; the
  fifth book opens its detail panel with the shelf inside it.

- [ ] **Step 1: Add the routes**

```tsx
import { CoursePage } from "./pages/CoursePage";
...
<Route path="/courses" element={<Library openId="courses" />} />
<Route path="/courses/:slug" element={<CoursePage />} />
```

- [ ] **Step 2: Mount the shelf**

In `Library.tsx`, the same seam the Decks volume uses:

```tsx
const CourseShelf = lazy(() =>
  import("../components/CourseShelf").then((m) => ({ default: m.CourseShelf })),
);
...
{openId === "decks" ? (
  <Suspense fallback={null}>
    <DeckShelf />
  </Suspense>
) : openId === "courses" ? (
  <Suspense fallback={null}>
    <CourseShelf />
  </Suspense>
) : (
  <DetailPanel manual={selected} />
)}
```

- [ ] **Step 3: Verify the build and the routes**

Run: `npm run build && npm run preview`
Expected: `/courses` shows the shelf; `/courses/cs2680` shows the course page;
`/courses/nope` renders the SPA's not-found path without a crash.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx src/pages/Library.tsx
git commit -m "feat: wire the Courses volume into the library and the router"
```

---

### Task 8: Styles

**Files:**
- Create: `src/styles/courses.css`
- Modify: `src/main.tsx` (import it after `site.css`)

**Interfaces:**
- Produces: `.course-shelf`, `.course-grid`, `.course-card`, `.course-card-cover`,
  `.course-card-kicker`, `.course-card-title`, `.course-card-meta`,
  `.course-card-body`, `.course-card-desc`, `.course-card-counts`,
  `.course-section`, `.course-asset-list`, `.course-asset`, `.course-asset-poster`,
  `.course-asset-label`, `.course-asset-meta`.

- [ ] **Step 1: Write the stylesheet**

Base it on `src/styles/decks.css` and reuse the tokens — do not introduce a new
palette:

```css
/* Courses volume - reuses field-manuals tokens */
.course-shelf { padding: 40px 24px 96px; }
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 28px;
}
.course-card {
  border: 1px solid rgba(234, 223, 199, 0.12);
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
}
.course-card-cover {
  display: flex;
  flex-direction: column;
  gap: 6px;
  aspect-ratio: 4 / 3;
  padding: 22px;
  background: var(--cover-color);
  color: var(--paper);
}
.course-card-kicker { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.72; }
.course-card-title { font-family: var(--serif); font-size: 1.35rem; line-height: 1.2; }
.course-card-meta { font-size: 0.78rem; opacity: 0.8; }
.course-card-body { padding: 16px 18px 20px; }
.course-card-desc { color: var(--ink-soft); font-size: 0.86rem; line-height: 1.5; }
.course-card-counts { color: var(--ink-soft); font-size: 0.78rem; margin-top: 6px; }
.course-card-body .action-rail { margin-top: 16px; }
```

- [ ] **Step 2: Import it**

In `src/main.tsx`, after the `site.css` import.

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/styles/courses.css src/main.tsx
git commit -m "feat: add the courses stylesheet"
```

---

### Task 9: The clips as release assets

**Files:**
- Create (in the CS2680 repo, not committed): the release assets.
- Modify: `public/courses/cs2680/files/manifest.json` (regenerated by the export).

**Interfaces:**
- Produces: stable absolute URLs
  `https://github.com/yhyu13/yhyu13.github.io/releases/download/courseware-v1/<slug>.mp4`,
  recorded in the manifest's `videos` group.

- [ ] **Step 1: Confirm the clips exist and pass their own gate**

```bash
cd /c/Git-repo-AI/CS2680-Courseware
ls courseware/remotion/final/*.mp4 | wc -l
python tools/verify_video_delivery.py --video courseware/remotion/final/lecture01.mp4 \
    --narration courseware/remotion/narration/Lecture01.json
```

Expected: `10` files, and `VERDICT: PASS (5 checks passed)`. **Do not publish a
clip that fails its own delivery check.**

- [ ] **Step 2: Create the release**

```bash
cd /c/Git-repo-AI/CS2680-Courseware
gh release create courseware-v1 "CS2680 courseware clips" \
  courseware/remotion/final/course-overview.mp4 \
  courseware/remotion/final/course-stack.mp4 \
  courseware/remotion/final/lecture01.mp4 … lecture08.mp4
```

- [ ] **Step 3: Re-export with the release tag**

```bash
python tools/export_course_site.py --profile homepage --slug cs2680 \
    --release-tag courseware-v1 \
    --dest "C:\\Git-repo-my\\yhyu13.github.io\\public\\courses\\cs2680"
```

The export now writes the absolute release URLs into the manifest's `videos`
group, and the course page's video rows become external links.

- [ ] **Step 4: Verify one asset URL actually resolves**

```bash
curl -sI -L "https://github.com/yhyu13/yhyu13.github.io/releases/download/courseware-v1/lecture01.mp4" | head -3
```

Expected: `200` and a `content-length` of roughly 7 MB.

- [ ] **Step 5: Commit the regenerated manifest**

```bash
cd /c/Git-repo-my/yhyu13.github.io
git add public/courses/cs2680/files/manifest.json
git commit -m "feat: point the course video rows at the release assets"
```

---

### Task 10: A link checker

**Files:**
- Create: `scripts/check-links.mjs`

**Interfaces:**
- Produces: a non-zero exit and a list of broken references. Run: `node scripts/check-links.mjs`.

- [ ] **Step 1: Write the checker**

Walk every `.html` under `public/` and `src/`, extract `href`/`src` attributes,
and resolve each internal reference against the file's own directory. Skip
external schemes (`http`, `https`, `mailto`, `data`, `//`) and pure fragments.
Report every reference that does not resolve to a file.

- [ ] **Step 2: Handle the SPA routes**

A reference to `/courses/cs2680` is a **route**, not a file — the SPA serves it
from `dist/404.html`. The checker must treat the known route prefixes as
resolvable. Declare them in one place, and include the parameterised ones as
prefixes:

```js
const SPA_ROUTES = ["/", "/identity", "/craft", "/archive", "/decks", "/courses"];
// /courses/<slug> is covered by the "/courses" prefix.
```

A reference is a route if it equals one of those, or starts with one of them
**and** the remainder is a single path segment (`/courses/cs2680` is a route,
`/courses/cs2680/files/…` is a file).

- [ ] **Step 3: Run it**

```bash
node scripts/check-links.mjs
```

Expected: clean. If it reports the course's own study-site links as broken, the
export broke a relative path — fix the export, not the checker.

- [ ] **Step 4: Add it to the build**

```json
"build": "tsc --noEmit && vite build && node scripts/copy-404.mjs && node scripts/check-links.mjs"
```

Expected: `npm run build` now fails on a broken link, before anything is deployed.

- [ ] **Step 5: Commit**

```bash
git add scripts/check-links.mjs package.json
git commit -m "feat: add a link checker and run it in the build"
```

---

### Task 11: Posters, optional

**Files:**
- Modify (in the CS2680 repo): `tools/export_course_site.py` — downscale the posters on export.
- Modify: `public/courses/cs2680/files/posters/*.png`

**Interfaces:**
- Produces: the same ten posters at a smaller size. The course page does not change.

- [ ] **Step 1: Measure the cost**

```bash
du -sh public/courses/cs2680/files/posters
```

Expected: ~7 MB for ten PNGs at 2560 px wide.

- [ ] **Step 2: Downscale on export**

The export already has Pillow available in the CS2680 repo. Resize each poster to
1600 px wide and re-encode as PNG with `optimize=True`; if that saves less than
30%, keep the PNG (JPEG would blur the slide text, and these are text images).

- [ ] **Step 3: Re-export and verify the size**

Expected: the posters group drops to ~3 MB, and a poster still shows its slide
text legibly at 800 px wide.

- [ ] **Step 4: Commit**

```bash
git add public/courses/cs2680/files/posters
git commit -m "perf: downscale the course poster sheets"
```

---

### Task 12: Local verification

**Files:**
- Modify: none

- [ ] **Step 1: Build**

```bash
npm run build
```

Expected: clean, and the link checker green.

- [ ] **Step 2: Preview and screenshot**

Start `npm run preview` and drive headless Edge at `/courses` and `/courses/cs2680`.
Expected: the shelf shows one course card with its counts; the course page shows
six sections; the video section shows ten posters.

- [ ] **Step 3: Click through, in this order**

1. Open the fifth book from the gallery → the shelf.
2. Open the course card → the course page.
3. Open the study site → it loads as its own page; concepts and search work.
4. Back → the course page; download one deck → the file arrives.
5. Open one video row → the release asset plays.
6. Back to the gallery → the fifth book is still there, and the other four are
   unchanged.

- [ ] **Step 4: Confirm the other volumes are untouched**

```bash
git diff --stat origin/master -- src/data/decks.ts src/data/archivePosts.tsx src/pages/ArticlePage.tsx
```

Expected: empty.

---

### Task 13: Ship it

**Files:**
- Modify: none

- [ ] **Step 1: Push**

```bash
git push origin master
```

- [ ] **Step 2: Watch the build**

```bash
gh run watch
```

Expected: the `Deploy` workflow runs `npm ci` → `npm run build` (now including the
link checker) → uploads the artifact → deploys to Pages.

- [ ] **Step 3: Verify the live site**

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://yhyu13.github.io/courses
curl -s -o /dev/null -w "%{http_code}\n" https://yhyu13.github.io/courses/cs2680
curl -s -o /dev/null -w "%{http_code}\n" https://yhyu13.github.io/courses/cs2680/files/study/index.html
curl -s -o /dev/null -w "%{http_code}\n" https://yhyu13.github.io/courses/cs2680/files/manifest.json
```

Expected: `200` for all four. The second one is the SPA fallback in action — it
is not a file, so Pages serves `404.html` and the router takes over.

- [ ] **Step 4: Verify the live release link**

```bash
curl -sI -L "https://github.com/yhyu13/yhyu13.github.io/releases/download/courseware-v1/lecture01.mp4" | head -2
```

Expected: `200`.

---

### Task 14: Record the contract

**Files:**
- Modify: `AGENTS.md`
- Modify: `README.md`

**Interfaces:**
- Produces: the repository's own documentation of the new volume and of the
  cross-repo export contract, so the next agent does not re-derive it.

- [ ] **Step 1: Update `AGENTS.md`**

Add to the Layout section:

```md
- `src/data/courses.ts` — the course records and the CS2680 entry
- `src/components/CourseShelf.tsx` — the Courses volume listing
- `src/pages/CoursePage.tsx` — one course's page
- `public/courses/<slug>/` — a course's artefacts, exported from the CS2680 repo
```

And a new section:

```md
## Course artefacts

The files under `public/courses/<slug>/` are **exported**, not authored here.
The source of truth is `C:\Git-repo-AI\CS2680-Courseware`; re-export with:

    python tools/export_course_site.py --profile homepage --slug <slug> --dest <this repo>/public/courses/<slug>

Do not hand-edit anything under `public/courses/`. The export writes the file
list into `files/manifest.json`, and `scripts/check-links.mjs` fails the build if the
page would advertise a file that is not there.

Course videos are **not** on Pages. They live in the `courseware-v1` GitHub
release and are linked from the course page.
```

- [ ] **Step 2: Update `README.md`**

Add a "Courses" section describing the volume and the one course in it.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md README.md
git commit -m "docs: record the Courses volume and the course export contract"
```

---

### Spike (de-scoped, do not start without a decision)

**Question:** can the course's ten decks be published as PDFs, so they can be read
in the existing `DeckReader` and downloaded like every other deck on the site?

**Two routes, both with a cost:**

- **LibreOffice.** The Decks pipeline already assumes it
  (`C:\Program Files\LibreOffice\program\soffice.exe`) — and it is **not
  installed on this machine today**. A 500 MB install, and it would be the first
  real render of the CS2680 decks: the text-fit of those slides was *estimated*,
  never rendered, so a conversion is also a chance to find layout defects.
- **Slice the HTML slides.** The study site renders one slide at a time via
  `?preview=N`; headless Edge can print each to a single-page PDF. 251 pages
  then need merging, and this machine has no PDF merger (no `qpdf`, no `pdftk`,
  no `pypdf`).

**Decision needed before this becomes work.** Until then the readable form is the
HTML study site and the download is the PPTX, which is a complete answer on its
own.

---

## Definition of done

- [ ] The gallery shows five books; the fifth opens a course shelf.
- [ ] `/courses/cs2680` shows the course: study site, ten decks, ten clips, the
      text layer, the digest, and the licence line.
- [ ] Every link on the course page resolves — checked mechanically, before
      deploy, and again on the live site.
- [ ] The ten clips download from the release; no MP4 is served from Pages.
- [ ] The four existing volumes are byte-identical to `origin/master`.
- [ ] `npm run build` is clean, including the link checker.
- [ ] `AGENTS.md` and `README.md` record the volume and the export contract.
