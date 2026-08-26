# Field Manuals SPA — yhyu13.github.io

Date: 2026-08-26  
Status: approved for implementation (user: finish until perfect, no further questions)

## Product

**是什么：** Hang Yu 的个人站点。一场 Field Manuals 式的书库：三本 CSS 3D 书，点开一本进入详情。Vite + React SPA，GitHub Pages 托管。

**不是什么：** 不是 Hexo / NexT。不是 Codex / Claude / Cursor 的克隆封面。不是博客信息架构（Home / Categories / Archives 导航）。不是 CMS。

锁定决策：

- 丢掉 Hexo，新 SPA
- 视觉语言：ThreeUI Field Manuals（`bestsellers-book-showcase.html`）
- IA：Library of manuals
- 三本书：Identity + Craft + Archive
- Craft = 写作与教学（知乎 / B 站）
- 实现：把 Field Manuals HTML 移植进 React；`@designcodeio/threeui` 用于内页/氛围零件，不当黑盒书架

## Site chrome

| 元素 | 文案 |
|---|---|
| Brand | Hang Yu |
| Hero word | 躬行 |
| Ticket | The Collection → 回到书库 |
| Menu | Identity / Craft / Archive |
| Theme color | `#29251d` |
| Description | 纸上得来终觉浅，绝知此事要躬行 |

## The three manuals

内容只来自现站可追溯事实：姓名 Hang (Yohan) Yu、标语、知乎 / B 站链接、2017 两篇真实文章。Hello World（Hexo 默认帖）不进书架。

### I · Identity

- Cover: Field Manual · I / **Hang Yu** / 躬行 / Person · Links · Site
- Color: `#363126` / ink `#31291e`
- Description: Hang (Yohan) Yu. This library is the public desk: who I am, where I write, and the 2017 notes I still keep.
- Steps: Name the person → Point to the public desks → Treat this site as a shelf, not a feed
- Quote block: 纸上得来终觉浅，绝知此事要躬行
- Review: If a link does not open a real desk (Zhihu, Bilibili, or a volume here), it does not belong on this cover.
- Actions: Zhihu (`https://www.zhihu.com/people/ao-ta-kang-007`), Bilibili (`https://space.bilibili.com/1526329479`)
- Extra: `public/uploads/me.jpg` in the identity interior

### II · Craft

- Cover: Field Manual · II / **Craft** / Writing · Teaching / Zhihu · Bilibili · 躬行
- Color: `#945a3e` / ink `#4b281a`
- Description: The craft is writing and teaching in public. Zhihu and Bilibili are the desks. The method is the site motto: reading is shallow until the work is done by hand.
- Steps: Start from a real question → Write the argument → Teach it in public → Keep the loop visible
- Quote: 纸上得来终觉浅，绝知此事要躬行
- Review: A note that never leaves the draft folder is not craft on this shelf.
- Actions: same Zhihu / Bilibili URLs

### III · Archive

- Cover: Field Manual · III / **Archive** / 2017 Notes / Capsule · Rainbow
- Color: `#566044` / ink `#293024`
- Description: Two 2017 field notes. A reproducibility report on Matrix Capsules with EM routing, and a review of DeepMind Rainbow. Hello World is omitted (Hexo boilerplate).
- Steps: Capsule EM Routing (2017-12-17) → Rainbow Review (2017-12-16)
- Quote: Capsule as tensor-in / pose-out; Rainbow as six DQN extensions stacked.
- Reading pages `/archive/capsule` and `/archive/rainbow` port the full original post bodies (not abridged). Dead third-party figures (jianshu / rawgit) are dropped; GitHub-hosted capsule figures use `raw.githubusercontent.com`. The prose arguments stay.
- Review: These are period notes, not a claim that the 2017 numbers still lead the field.
- Actions: Open Capsule, Open Rainbow

## Interaction (port from Field Manuals)

Keep, with book ids `identity` / `craft` / `archive`:

- Gallery of three CSS 3D books, pointer parallax (`--mx/--my`, per-card `--local-x/y`)
- Hover lift + “Read” badge
- Click → `data-mode="detail"`: selected book left/center, others blur out, detail panel + bottom dock + close button + blossom field
- Escape / close → gallery
- Menu overlay, italic volume names
- `prefers-reduced-motion`: no parallax, no blossom, instant mode switch
- No cover MP4 / no stock JPEG covers. Covers are CSS paper (gradient + grain)

Detail template mapped off the original “Getting started / first prompt / before you ship”:

| Original | This site |
|---|---|
| Getting started | How to read this volume |
| Your first prompt | Motto / excerpt |
| Before you ship | Before you leave |
| Field Edition / Read Notes / View Guide / Save | Real links (Zhihu, Bilibili, archive articles). No fake save-to-reading-list. |

## Routes

| Path | Behavior |
|---|---|
| `/` | Gallery |
| `/identity` `/craft` `/archive` | Open that book |
| `/archive/capsule` `/archive/rainbow` | Reading pages, Field Manuals type, back to Archive |
| unknown | SPA `404.html` = `index.html` → gallery |

Old Hexo URLs (static files in `public/`):

| Old | To |
|---|---|
| `/about/` `/2026/` | `/identity` |
| `/archives/` `/categories/` `/tags/*` | `/archive` |
| `/2017/12/17/Matrix-Capsule-With-EM-Routing-Reproduce-Report/` | `/archive/capsule` |
| `/2017/12/16/DeepMind-Rainbow-Review/` | `/archive/rainbow` |
| `/2017/12/16/hello-world/` | `/archive` |
| `/archives/2017/` `/archives/2017/12/` | `/archive` |

Redirect pages are tiny HTML with `meta refresh` + link. Do not keep NexT CSS/JS.

`<title>`: `Hang Yu`. Favicon is a new earth-toned SVG; NexT favicons die with the theme.

Ticket button: gallery → toast “The collection is complete.”; detail → navigate to `/` (close the book). Menu / Escape / close / brand all bind to the router (`/` = gallery).

## Architecture

- Vite 7 + React 19 + TypeScript + React Router (`BrowserRouter`, `base: '/'`)
- `@designcodeio/threeui` + `three`: `DotMatrixBackground` as a low-opacity stage wash (hue toward earth, opacity ~0.12). If the WebGL layer fails or `prefers-reduced-motion`, hide it. Interior CTAs stay Field Manuals pills — ThreeUI iframe buttons (GradientPill / Tactile) clash with this palette and are not used.
- Content: `src/data/manuals.ts` only
- CSS: port of `bestsellers-book-showcase.html` `<style>` into `src/styles/field-manuals.css`, selectors retargeted to the three ids
- GitHub Actions → Pages (`dist/`, copy `index.html` → `404.html`)
- `master` becomes source. Pages source must be GitHub Actions (documented in README / AGENTS.md)

## Out of scope

Search, comments, CMS, dark/light toggle, Hexo, Hello World, cloning official cover videos, hash routing, i18n.

## Completion audit

Done only when all of these are true in the repo, not by assertion:

1. `npm run build` succeeds
2. Gallery shows three Yu manuals, not Codex/Claude/Cursor
3. `/identity` `/craft` `/archive` open the matching book
4. Zhihu and Bilibili are real `href`s
5. Capsule and Rainbow reading pages contain the original arguments (capsule = pose/routing/smallNORB; rainbow = six extensions + “better target > better learning”)
6. Old URL redirect files exist under `public/`
7. Hexo NexT artifacts (`css/`, `lib/`, `fancybox/`, `js/`, `images/`, generated `index.html` body) are gone from git root
8. `AGENTS.md` describes the SPA, not Hexo output
9. Repo README states that GitHub Pages source must be switched from `master` branch to GitHub Actions; the workflow file alone does not cut over.
