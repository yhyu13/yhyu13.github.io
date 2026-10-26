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

## 2026-10-26 · Courses 卷：规格与计划

| ME | YOU |
|----|-----|-----|
| 想把 CS2680 课件传到个人主页，新开一个专门 host 网课 / AI 笔记 / 视频课 / 交互网页的子页面，原汁原味。出一个 spec plan，用所有 skill，无限 token。 | 先查真身：本地克隆落后两个月（停在 2026-07-11 的 Hexo/NexT 产物），线上早已是 Vite + React 的 Field Manuals SPA（`3fe0cdd`）。`git fetch` + 快进到真 origin 后重读。发现 Decks 卷（Field Manual · IV「Video Slides」，12 条目、pdf.js 阅读器、链回原视频）已经是"放网课类东西"的容器，但承诺太窄：一条 `Deck` 只有一个 `pdf` 字段，装不下一门课。 |
| — | 写 spec（5 条决策 + 架构 8 节 + 错误处理 / 可访问性 / 验证 / 风险）与 plan（Task 0–14 + 1 个 spike，61 步），落 `docs/superpowers/{specs,plans}/2026-10-26-courses-volume*`。决策：新开第五卷 `courses`（与 Video Slides 平级，不是子类型）；课件以静态文件落 `/courses/<slug>/files/`，不做 SPA 路由；10 段 MP4（89 MB）走 GitHub Release，只链不托管不内嵌；可读形态是 HTML 学习站、权威下载是 PPTX，每讲一份 PDF 留作带待决问题的 spike（本机没装 LibreOffice）。 |
| — | 自查抓到一个会让功能静默失效的坑：Pages 对目录请求 301 到该目录的 `index.html`，所以 `public/courses/<slug>/` 下任何位置都不能有 index.html，否则 `/courses/<slug>` 这条 SPA 路由永远到不了。规格已写死这条规则，并写进计划的"接手须知"。 |
| — | 版权判断（用户未明说，由我定，写在 spec 第 5 条并留了改口）：只发课件，不发 Harvard 原站的逐字节镜像 —— 个人主页上再分发第三方课程站最难辩护，官方源一点即达。 |
| — | 交接：spec/plan 在 `docs/superpowers/`，提交 `3797ec5`；README 加了指针并修掉"三卷"的旧账（实为四卷）；JOURNEY 记本条。实现留给下一个 agent：Task 0 先同步克隆，Task 1 的导出工具写进 CS2680 仓 `tools/export_course_site.py`，assets 在该仓 `deploy/public/`。未推远程。 |

## 2026-10-26 · Courses 卷：实现与上线

| ME | YOU |
|----|-----|
| 交接点已推好（spec+plan 三提交），无限 token，gogogogo。 | 按 plan 顺序执行 Task 0–14。Task 0 基线复核：构建产物与交接时哈希一致，12 份 deck PDF 在位。 |
| — | Task 1–2：CS2680 仓写 `tools/export_course_site.py`（幂等导出，断言 manifest 与文件逐字节一致，`files/` 外绝不写 index.html），158 个文件 18.7 MB 导入 `public/courses/cs2680/`，两次导出 SHA256 全等、只差 exportedAt。study 站 86 个文件与源逐字节一致，浏览器验证翻页/概念索引/搜索可用。 |
| — | Task 3–8：`courses.ts` 数据模型、第五卷上书架、CourseShelf、CoursePage（六节）、路由、`courses.css`（只复用已有色值）。manifest 里 10 段视频先落占位符，页面如实显示"暂未提供下载"。 |
| — | Task 9：CS2680 上游 11/11 闸门全绿后，10 段 MP4（89.4 MB）传 GitHub Release `courseware-v1`，带 tag 重导出只动 manifest.json 一行（幂等性自己证明了自己）。 |
| — | Task 10：`scripts/check-links.mjs` 进 build 收尾——扫 `public/**/*.html` 的 href/src 加 `src/data` 的站内绝对路径；带扩展名的单段引用不算 SPA 路由；负路径测试确认真能抓坏链。 |
| — | Task 11：海报 2560px→1600px 降采样，7.3 MB→3.15 MB（-57%），800px 宽下标题与数字仍可读；省不到 30% 就保留原 PNG 的闸门写进了导出工具。 |
| — | Task 12 走查抓到 spec 的一个事实性盲区：书架位置是 CSS 里按书手写的（三个断点各一块 `[data-book=…]`），第五本书 DOM 自动出现但位置 0×0。三处断点按既有构图语言补了第五本并把四本重新布点（10/30/50/70/90%）。顺手把坏 slug 从"空白页"改成 DeckReader 式的诚实报错。 |
| — | 走查还抓到课程页列表链接是浏览器默认蓝（在 `.article-body` 作用域外），补了 article 同款纸色链接样式。 |
| — | Task 13：12 个实现提交推上 origin/master，Deploy 绿。线上验证：`/courses/cs2680/` 尾斜杠 404+外壳（和交接实测的 `/archive/capsule/` 同款行为，验收看 body 不看状态码——这条教训差点又踩一次）；manifest/pptx（431777 字节与 manifest 一致）/海报全 200；线上首页五本书，课程页六节十海报十 release 链接全渲染；学习站线上翻页、搜索正常。 |
| — | Task 14：AGENTS.md 的"In progress"改写为已实现的两仓合同（导出命令、index.html 禁令、release tag、链接检查器四条），README 同步。 |

## Open items

- 你这边若仍白屏：无痕打开 https://yhyu13.github.io/?v=2，或硬刷新。Network 里 `index.html` 应引用 `/assets/index-….js`，不应再请求 `/src/main.tsx`。
- GitHub Pages 源必须保持 **GitHub Actions**，不要退回 branch `master` / root。
- 未把本 journey 归档进 skill。
- `CS2680-Courseware` 仓是纯本地仓（无任何 remote）：导出工具的两个提交（`39861a4`、`873b5ca`）只存在于本机。要留底需要建远端（仓名/可见性待定）。
