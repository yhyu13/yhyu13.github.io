# JOURNEY.md

ME = human. YOU = AI. Oldest first. One session = one heading + one two-column table.

## 2026-08-26 → 2026-08-27 · Field Manuals SPA

| ME | YOU |
|----|-----|
| 挂上 goal-persistence，要求用 `D:\GitRepo-AI\threeui` 整站重设计：1. plan 2. review improve。 | 读了本仓库（Hexo / NexT 生成站）和 threeui 的 landing（Kage、Sketchbook、Working Volumes、Field Manuals、Sylva）。没有改 threeui 源码。 |
| 拒绝 visual companion。 | 继续用文字收敛：现站是 Home / About / Categories / Archives + 三篇 2017 帖；AGENTS.md 禁止改生成 HTML，整站重做等于丢掉 Hexo。 |
| 站点形态选 **Drop Hexo, new SPA**。 | 记下：Vite + React，`@designcodeio/threeui`，GitHub Pages。 |
| 视觉选 **Field Manuals**。 | 记下土色、serif、三本 CSS 3D 书。 |
| IA 选 **Library of manuals**。 | 记下：书架是入口，不是博客导航。 |
| 三本书选 **Identity + Craft + Archive**。 | 现站只有 2017 论文和知乎 / B 站；Craft 需要你定题材。 |
| Craft 选 **写作与教学**（知乎 / B 站）。 | 发现 ThreeUI 的 `BestsellersBookShowcase` 是 iframe，封面写死 Codex / Claude / Cursor，不能当 props 传入。 |
| 实现选 **A：把 Field Manuals HTML 移植进 React**（推荐）。 | 锁架构：源码仓 + Actions 发 `dist/`；架子移植 CSS/交互；封面不用官方视频；旧 URL 做跳转。 |
| finish until perfect, no ask, no question。 | 写完规格 `docs/superpowers/specs/2026-08-26-field-manuals-spa-design.md`。子 agent 审规格：Approved。吸收建议（全文移植两篇 2017、嵌套 archives 跳转、ticket/Escape 绑路由、清 `js/` `images/`、Pages 源必须人手切到 Actions）。 |
| （同一指令，继续做） | 搭 Vite/React SPA：`src/data/manuals.ts`、`archivePosts.tsx`、`Library.tsx`、Field Manuals CSS。删 Hexo 树。`public/` 放旧 URL 跳转和 `uploads/me.jpg`。`npm run build` 过。预览：三本书是 Hang Yu / Craft / Archive，不是 Codex 三件套。知乎 / B 站是真链接。Capsule / Rainbow 论点在。`/about/` 跳到 `/identity`。修了 `Hang Yu · Hang Yu` 标题和文章 `document.title`。未提交。 |
| self test and take screen shot, critic self and improve。 | 截了 gallery / identity / craft / archive / capsule / menu / 390px。截图钉住的问题才改：详情页花瓣挡住正文（裁到左半）、证件圆裁改成圆角缩略图、Archive 摘录被底栏切掉（缩短）、手机关闭钮压住品牌（挪到菜单左侧）。原版 Field Manuals 的窄屏裁书、汉堡两横、详情正文在书下面，没改。 |
| push to remote, how to deploy? | 提交 `Replace Hexo site with Field Manuals Vite SPA`。远程多了 `6fa134b Site updated: 2026-07-11`（又一次 Hexo 生成）。rebase，冲突按 SPA 目标态解（删生成页，留我们的 `index.html`）。推到 `origin/master`：`20c6cfd`。说明：workflow 不会改 Pages 源；必须在仓库设置里改成 GitHub Actions。 |
| https://yhyu13.github.io/ 全白，actions 绿。 | 线上 HTML 已是构建产物（`/assets/index-CKnD0o8s.js` + CSS 都 200）。Playwright 打开能看到三本书，`#root` 有内容，背景 `rgb(41, 37, 29)`，控制台 0 error。`/src/main.tsx` 线上 404 是对的。判断：你这边多半是切 Pages 之前缓存的源码 `index.html`。建议无痕或 `?v=2` 硬刷新。 |
| dump to journey.md。 | 本文件。ME=human / YOU=AI；仓库里原先没有 JOURNEY.md，新建。没有把这段归档进 skill。 |

## 2026-08-28 · mobile fit + QR

| ME | YOU |
|----|-----|
| 1 update journey；2 mobile fit；3 QR 弹窗，可下载，扫了进站点。 | 追加本表。390px：三本封面进屏（不再裁成只剩中间一本）。详情：书缩小顶在顶栏下，正文紧跟，底栏改相对定位不再压步骤；手机详情关掉花瓣。顶栏加 QR 钮，弹窗码指向 `https://yhyu13.github.io`，Download PNG。`npm run build` 过。未推远程。 |

## Open items

- 你这边若仍白屏：无痕打开 https://yhyu13.github.io/?v=2，或硬刷新。Network 里 `index.html` 应引用 `/assets/index-….js`，不应再请求 `/src/main.tsx`。
- GitHub Pages 源必须保持 **GitHub Actions**，不要退回 branch `master` / root。
- 未把本 journey 归档进 skill。
- 本轮 mobile / QR 改完后尚未推远程。
