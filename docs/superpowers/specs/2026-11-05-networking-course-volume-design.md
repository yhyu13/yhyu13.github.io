# Courses 卷 — 第二门课：How to Network（人脉不是通讯录）

Date: 2026-11-05
Status: Draft for review
Author: Hang Yu + Cindy
Refs: [`2026-11-05-networking-course-intake-worksheet.md`](./2026-11-05-networking-course-intake-worksheet.md)
（素材与版权判定）；[`2026-10-26-courses-volume-design.md`](./2026-10-26-courses-volume-design.md)
（Courses 卷的既有契约）；Refs: [#14](https://github.com/yhyu13/yhyu13.github.io/issues/14)（spec 即 issue contract）

## Problem

Courses 卷现在只有一门课（CS2680），而且卷级文案把"每门课"都描述成
"可交互的学习站 + 讲义 + 视频 + 文字"（`src/data/manuals.ts:178-205`、
`src/components/CourseShelf.tsx:36`）。

人脉课是第二个候选，但它的形状不同：

- 有 **1 份 107 页 PPTX**、**6 段带软字幕的 MP4（17:24）**、**312 条 SRT cue**、
  **104 页结构化内容**（`content/content.json`）；
- **没有** 可交互学习站。`scene/template.html` 是一个按时间轴播放的渲染模板，
  没有翻页、搜索或概念索引，不是 CS2680 那种 reader。

直接把它塞进卷里会产生三个具体问题：

1. **文案撒谎。** 卷描述与三个步骤都说每门课有学习站；第二门课没有。
2. **字幕组渲染不出来。** `CoursePage` 的 `text` 分支只认 `notes` / `slides` 两组
   （`src/pages/CoursePage.tsx:215-223`），第三组会被静默丢弃。
3. **视频放不进 Pages。** 6 段合计 148.1 MB，加上现有 15 MB 会超过 Pages 的
   100 MB 软上限，且把视频放进每次页面加载的关键路径。

本 spec 的答案是：**照发五区、不带 site、改卷级文案、把字幕组补进组件**。

## Decision 1 — slug `networking`，作为 Courses 卷的第二门课

`src/data/courses.ts` 追加一条记录（类型不变）：

```ts
{
  slug: "networking",
  title: "How to Network · 人脉不是通讯录",
  titleEn: "How to Network: Leading Yourself to Lead Others",
  term: "Coursera · 2026",
  institution: "University of Michigan",
  instructor: "Tina Valentini",
  sourceUrl: "https://www.coursera.org/learn/how-to-network",
  licence:
    "课程版权归 University of Michigan 与 Coursera 所有；本站只收录个人整理的笔记、讲稿与自制讲解视频，未收录原课程的视频与音频，未获授权再分发。",
  color: "#8a6e00",
  blurb:
    "一门 54 节的密歇根人脉课，压成 6 集 17 分钟讲解，外加 107 页讲义与一套逐页笔记。",
  sections: [/* 见 Decision 2 */],
}
```

封面色 `#8a6e00` 取自 `design/design.json` 的 `maizeDim`：它是整套 maize 强调色的
暗部，和现有四本书的 `#363126 / #945a3e / #566044 / #4f5b4a / #3f5b63` 同属低饱和
深色，白字对比度 4.9:1（与 `#945a3e` 的 5.5:1 同档）。不引入 Michigan 校徽或任何标识。

## Decision 2 — v1 只发五区，不发 site

`Course.sections` 本来就是按课配置的数组，少一个区不需要改类型。

| kind | 内容 | 条数 |
|---|---|---:|
| `decks` | `networking-course.pptx` | 1 |
| `videos` | 6 段讲解视频（Release 外链）+ 6 张海报 | 6 |
| `text` | 逐页笔记 / 屏幕文字 / SRT 字幕 | 6 + 6 + 6 |
| `digest` | 全课总结、六模块地图 | 2 |
| `notice` | licence + NOTICE.txt | 1 |

各区的 `description`（页面上的说明文字）：

```ts
[
  { kind: "decks",  label: "讲义",
    description: "1 份 PowerPoint 讲义，107 页：104 页内容 + 课程地图 + 全课总结，与 6 集视频同源。" },
  { kind: "videos", label: "视频",
    description: "6 段讲解视频，共 17 分 25 秒，1280×720，带旁白与可开关的中文字幕。视频存放在 GitHub Release，不在本站。" },
  { kind: "text",   label: "文字",
    description: "三层文字：6 份逐页笔记、6 份屏幕文字、6 份 SRT 字幕，共 18 份。" },
  { kind: "digest", label: "摘要",
    description: "两份摘要：全课 5 条结论与六模块地图；每个模块的 takeaway 与讲稿原句。" },
  { kind: "notice", label: "版权与出处",
    description: "材料版权归 University of Michigan 与 Coursera 所有；原课程视频与音频未收录，请访问官方课程页。" },
]
```

**为什么不发 site：** 变出一个 site 只有两条路——把 104 页内容重新排成一个 reader，
或者把 `scene/template.html` 改造成可翻页的播放器。前者是 CS2680 学习站那个量级的
独立应用（17 页、251 张幻灯片、搜索索引），后者要给一个只按时间轴播放的单文件模板补上键盘翻页、
目录、进度和移动端布局。两者都不是"导出一次"能完成的，硬塞会得到一个点进去只有
一张封面的假站。**它另开 issue（v2），不阻塞这门课。**

## Decision 3 — 源在 `networking-course`，导出到本站

人脉课的素材在 `C:\Git-repo-my\个人成长\networking-course`（当前不是 git 仓库）。
沿用 CS2680 的两仓契约：**源目录拥有素材并负责导出，本站只消费导出结果**。

在源目录新增 `tools/export_course_site.py`，接口与 CS2680 的导出器一致：

```powershell
python tools/export_course_site.py --profile homepage --slug networking `
    --dest "C:\Git-repo-my\yhyu13.github.io\public\courses\networking"
```

导出后的树（29 个文件）：

```
public/courses/networking/
  files/
    downloads/networking-course.pptx      2,087,594 B · 107 页
    text/notes/ep1.md … ep6.md            6 份，由 content.json 的 note 生成
    text/slides/ep1.md … ep6.md           6 份，只含屏幕文字
    text/transcript/ep1.srt … ep6.srt     6 份，out/ 原件逐字复制
    digest/summary.md                     全课 5 条结论 + 6 模块地图
    digest/module-map.md                  每模块 takeaway + 一句讲稿
    posters/ep1.jpg … ep6.jpg             6 张，从成片 t=1.0 s 定帧
    NOTICE.txt
    manifest.json
```

**硬规则（与 CS2680 相同）：**

| 规则 | 原因 |
|---|---|
| 只写 `files/`，课程根目录不写任何文件 | 根目录的 `index.html` 会 shadow `/courses/networking` 这条 SPA 路由 |
| 不复制 `src/`、`work/`、日志、英文 ASR | 第三方原件与复制件，见 worksheet §3 |
| 不复制 `content/*.json` 的逐集副本 | `content.json` 是唯一源；逐集文件只是重复 |
| 视频不落地，manifest 写 Release 绝对 URL | 148 MB 不能进 Pages |
| 海报必须落盘并由 manifest 指向 | `check-links.mjs` 会同时校验 poster 和字节数 |
| 幂等、可重复：二次运行除 `exportedAt` 外字节一致 | 与 CS2680 导出器同一标准 |

导出器必须**在写完后自检**：manifest 里每个本地 `href` 都存在、每个 `poster` 都存在、
二进制文件的 `bytes` 与磁盘一致、`decks/videos/text/digest` 的条数分别是 1/6/18/2、
课程根目录没有 `index.html`。任一条不满足就以非 0 退出。

`manifest.json` 的关键字段（真实数字）：

```json
{
  "slug": "networking",
  "title": "How to Network · 人脉不是通讯录",
  "exportedAt": "2026-11-05T…Z",
  "source": "C:\\Git-repo-my\\个人成长\\networking-course",
  "groups": {
    "decks": [
      { "label": "networking-course.pptx", "href": "downloads/networking-course.pptx",
        "bytes": 2087594, "slides": 107 }
    ],
    "videos": [
      { "label": "第 1 集 · 人脉不是通讯录", "desc": "模块一 · 课程第 01 到 18 节",
        "href": "https://github.com/yhyu13/yhyu13.github.io/releases/download/courseware-networking-v1/networking-ep1.mp4",
        "poster": "posters/ep1.jpg", "meta": "3:21 · 17 页 · 59 条字幕" }
    ],
    "text": [
      { "label": "第 1 集 · 为什么经营人脉.md", "href": "text/notes/ep1.md", "group": "notes" },
      { "label": "第 1 集 · 屏幕文字.md", "href": "text/slides/ep1.md", "group": "slides" },
      { "label": "第 1 集 · 字幕.srt", "href": "text/transcript/ep1.srt", "group": "transcript" }
    ],
    "digest": [
      { "label": "全课总结.md", "href": "digest/summary.md", "scope": "5 条结论 · 6 模块" },
      { "label": "六模块地图.md", "href": "digest/module-map.md", "scope": "6 模块 · 每模块 1 句" }
    ]
  },
  "notice": "课程材料版权归 University of Michigan 与 Coursera 所有；原课程视频与音频未收录。"
}
```

（示例只列了 1 条 video / 3 条 text；实际写 6 / 18 条。）

## Decision 4 — 6 段视频走 GitHub Release

- 上传 **带字幕轨的** `out/networking-ep1..6.mp4`，不上传 `-clean`。
  证据：带字幕版 148,147,958 B，clean 版 148,113,430 B，只差 34,528 B，
  而前者多一条 `mov_text` 字幕流；没有理由发没有字幕的那份。
- 标签 `courseware-networking-v1`，与既有 `courseware-v1` 并列。
- URL 形如
  `https://github.com/yhyu13/yhyu13.github.io/releases/download/courseware-networking-v1/networking-ep1.mp4`
- 页面**不嵌 `<video>`**，只列海报、时长、页数、字幕条数和下载链接——
  与 Decks 卷、CS2680 的先例一致。

```powershell
gh release create courseware-networking-v1 `
  out/networking-ep1.mp4 out/networking-ep2.mp4 out/networking-ep3.mp4 `
  out/networking-ep4.mp4 out/networking-ep5.mp4 out/networking-ep6.mp4 `
  --title "Networking course — 6 narrated clips" `
  --notes "6 段讲解视频，1280×720，含 mov_text 软字幕轨；页面上只做链接，不内嵌。"
```

已知限制，写进 PR 而不是藏起来：`mov_text` 在部分浏览器里不会自动显示，
所以字幕的可靠副本是 `text/transcript/*.srt`，页面同时提供。需要"打开即见字幕"时，
另做一版烧录字幕的成片是独立工作，不在本 spec 内。

## Decision 5 — 六张海报从成片定帧

- 每集第 1 页就是该集封面（head 各不相同，见 worksheet §2 的表），
  在 `t=1.0 s` 已经稳定，避开入场动画。
- 用 `imageio_ffmpeg.get_ffmpeg_exe()`（流水线已经依赖它，机器上没有系统 ffmpeg）
  取 `-frames:v 1 -q:v 4`，输出 1280×720 JPEG，6 张预计 0.7–0.9 MB。
- 同一输入、同一时间点 → 同一张图，满足导出器的幂等要求。

## Decision 6 — `CoursePage` 的 text 分支改成按组渲染

现状（`src/pages/CoursePage.tsx:215-223`）硬编码两组，`transcript` 会被丢弃。
最小改动：把组顺序与标签提成一个常量，按 manifest 里实际出现的组渲染，未知组兜底成
"其他"，没有 `group` 的条目也照常显示。

```tsx
export const TEXT_GROUPS: [string, string][] = [
  ["notes", "页面笔记"],
  ["slides", "讲义逐页文本"],
  ["transcript", "字幕（.srt）"],
];

// case "text":
const groups = new Map<string, ManifestAsset[]>();
for (const asset of assets) {
  const key = asset.group ?? "other";
  groups.set(key, [...(groups.get(key) ?? []), asset]);
}
const order = [...TEXT_GROUPS.map(([g]) => g), ...[...groups.keys()].filter((g) => !TEXT_GROUPS.some(([k]) => k === g))];
return (
  <>
    {order.filter((g) => groups.has(g)).map((g) => (
      <AssetGroup
        key={g}
        slug={course.slug}
        label={`${TEXT_GROUPS.find(([k]) => k === g)?.[1] ?? "其他"}（${groups.get(g)?.length ?? 0}）`}
        assets={groups.get(g) ?? []}
      />
    ))}
  </>
);
```

**对 CS2680 必须零变化**：它的标签仍是"页面笔记（27）"和"讲义逐页文本（9）"，
条数与顺序不变；`AssetGroup` 的空数组保护保持。

## Decision 7 — 卷级文案改成"有的课带学习站"

只改三处，不动其它四卷。以下为**精确的前后对照**。

`src/data/manuals.ts`（Courses 卷，第 175–205 行）：

| 字段 | 现在 | 改为 |
|---|---|---|
| `subtitle` | `网课 · 课件 · 交互页` | `网课 · 课件 · 视频` |
| `footer` | `CS2680 · Notes · Clips` | `CS2680 · Networking · Notes · Clips` |
| `description` | `网课的完整学习包：可交互的学习站、可下载的讲义、带旁白与字幕的导览视频，以及课程的文字层。CS2680 是第一门。` | `网课学习包：可下载的讲义、带旁白与字幕的讲解视频、逐页笔记与摘要。CS2680 另带一个可交互的学习站；人脉课是一套六集讲解视频。` |
| `steps[0].body` | `每门课是一份打包的档案：学习站、讲义、视频、文字与摘要，各归其位。` | `每门课是一份打包的档案：讲义、视频、文字与摘要，有的还带学习站。` |
| `steps[1].body` | `学习站是阅读的地方——有概念索引和全文搜索；讲义是拿走的东西。` | `有学习站的课，先读站——有概念索引和全文搜索；没有学习站的课，从讲义和逐页笔记读起。` |
| `steps[2].body` | `每段视频都有旁白与字幕，字幕由画面自己渲染，所以缺字也不会变豆腐块。` | `每段讲解都有旁白和可开关的中文字幕；导览片是引子，讲义才是可以拿走的东西。` |
| `excerptLabel` | `First course` | `Courses` |
| `excerpt` | `CS2680 · Modern AI Systems · Harvard SEAS · Fall 2026` | `CS2680 · Harvard SEAS · Fall 2026 ｜ How to Network · University of Michigan · 2026` |
| `review` | `课程材料版权归 Harvard SEAS 与授课教师所有；这里是个人学习的整理，不是原站的分发。` | `课程材料版权归各课程的原作者所有：CS2680 归 Harvard SEAS 与授课教师，人脉课归 University of Michigan 与 Coursera。这里是个人学习的整理，不是原站的分发。` |

`src/components/CourseShelf.tsx:36`：

```
现在：网课学习包：可交互的学习站、讲义、带旁白的视频，以及课程的文字层。
改为：网课学习包：讲义、带旁白的视频、笔记与摘要；CS2680 另带可交互的学习站。
```

`excerpt` 是渲染在 `<code>` 里的单行文本（`CraftPanel.tsx:178-180`），
所以用 `｜` 连接，不换行。

## Decision 8 — 版权与 NOTICE

页面上那行 licence 已在 Decision 1；`NOTICE.txt` 由导出器生成：

```
How to Network: Leading Yourself to Lead Others
University of Michigan · Coursera
https://www.coursera.org/learn/how-to-network

本目录下的讲义、讲稿、笔记、摘要、字幕与讲解视频是个人学习整理，不是官方发行物。
原课程的视频与音频未收录于此；请前往官方课程页学习。
课程材料版权归 University of Michigan 与 Coursera 所有；未获授权再分发。
```

本 spec **不声明这是法律结论**。把付费课程的整理稿公开在个人主页上，与 CS2680
属同一类灰色地带；站点既有先例是"只发自己的整理、不发原件、明写未授权再分发"。
保留这条先例，并把风险留给站点所有者确认，是这里唯一诚实的做法。

## 工作拆分（按依赖顺序）

| # | 任务 | 产出 / 文件 |
|---|---|---|
| 1 | 写导出器 | `networking-course/tools/export_course_site.py`：读 `content/content.json`、`out/`，写 29 个文件并自检 |
| 2 | 跑导出 | `public/courses/networking/files/`（29 文件，~2.9 MB） |
| 3 | 上传 Release | `courseware-networking-v1`，6 个 MP4，148.1 MB |
| 4 | 加课程记录 | `src/data/courses.ts` 第二条 `COURSES` 项 |
| 5 | 改 text 渲染 | `src/pages/CoursePage.tsx` 的 `case "text"` |
| 6 | 改卷级文案 | `src/data/manuals.ts`、`src/components/CourseShelf.tsx` |
| 7 | 记录契约 | `AGENTS.md`：第二门课、导出命令、Release 标签；`README.md` 的 Courses 段 |
| 8 | 验证 | 见下 |

## 验证

```powershell
# 1. 构建 + 类型检查 + 链接检查（最后一行必须是 check-links 的通过行）
npm run build
# 期望：exit 0；末尾 "check-links: all internal references resolve."

# 2. 课程根目录不得有 index.html（会 shadow /courses/networking）
Test-Path public\courses\networking\index.html        # 期望 False
Test-Path public\courses\networking\files\manifest.json  # 期望 True

# 3. manifest 自检（条数、海报、外链标签、字节数）
node -e "const fs=require('fs');const b='public/courses/networking/files/';const m=JSON.parse(fs.readFileSync(b+'manifest.json','utf8'));const g=m.groups;const n=(k)=>g[k].length;if(n('decks')!==1||n('videos')!==6||n('text')!==18||n('digest')!==2)throw Error('counts '+[n('decks'),n('videos'),n('text'),n('digest')]);for(const v of g.videos){if(!v.href.startsWith('https://github.com/yhyu13/yhyu13.github.io/releases/download/courseware-networking-v1/'))throw Error(v.href);if(!fs.existsSync(b+v.poster))throw Error('poster '+v.poster);}for(const d of g.decks){if(fs.statSync(b+d.href).size!==d.bytes)throw Error('bytes');}console.log('manifest ok');"
# 期望：manifest ok

# 4. 站点上不得出现任何课程视频文件
Get-ChildItem public\courses\networking -Recurse -Filter *.mp4 | Measure-Object | % Count
# 期望：0

# 5. 本地预览后按 DoD 的页面断言逐条看（SPA 是客户端渲染，curl 只看得到壳）
npm run preview
```

页面断言（`/courses` 与 `/courses/networking`）：

- `/courses` 出现两张卡片；第二张 kicker 是 `Coursera · 2026`，
  institution 行是 `University of Michigan · Tina Valentini`，
  计数行是 `1 份讲义 · 6 段视频 · 18 份文字`。
- `/courses/networking` 依次出现：讲义 1 行、视频 6 行（每行有海报和
  "下载视频（GitHub Release）"）、文字 3 组（6/6/6）、摘要 2 行、版权 1 行；
  **没有**"学习站"区。
- `/courses/cs2680` 与改动前一致：10 份讲义、10 段视频、
  "页面笔记（27）"与"讲义逐页文本（9）"两组。
- 五本书仍在书架上；其余四卷的页面不需要改动。

## Definition of done

- [ ] `public/courses/networking/files/` 有 29 个文件；课程根目录只有 `files/`；
      `public/courses/networking/index.html` 不存在。
- [ ] `manifest.json` 的 `decks/videos/text/digest` 条数为 1/6/18/2；
      deck 字节数 2,087,594；6 个 poster 全部存在；6 个视频 href 全部指向
      `courseware-networking-v1`。
- [ ] 6 段 MP4 在 Release 可下载（每个 URL 返回 200/302），站内 0 个 MP4。
- [ ] `/courses` 显示两门课，计数行正确；`/courses/networking` 五区齐全、无 site 区。
- [ ] `/courses/cs2680` 的输出与改动前逐项一致（10/10，两个文本组标签不变）。
- [ ] `npm run build` exit 0，`check-links: all internal references resolve.`
- [ ] 四本旧卷的源文件（`src/data/manuals.ts` 中 identity/craft/archive/decks 四项、
      `src/styles/`）无改动。
- [ ] `AGENTS.md` 记录第二门课、导出命令和 `courseware-networking-v1`；README 的
      Courses 段同步。
- [ ] PR 证据块包含上面 1–4 条命令的原始输出，以及两张页面截图。

## Out of scope

- **交互学习站（site）**：另开 issue；本 spec 只保证"没有站"这件事在文案上不再撒谎。
- **PDF 版讲义**：与 CS2680 的 PDF spike 同一个未决问题（本机无 LibreOffice /
  PDF 合并器），不在这里重开。
- **字幕重制 / 翻译**：SRT 原样发布；不做英文轨、不做双语。
- **把 MP4 放进 `public/`**：与 Pages 体积上限和既有视频策略都冲突。
- **改动六种 `CourseSectionKind`**：本 spec 不新增类型。

## 风险

| 风险 | 影响 | 处置 |
|---|---|---|
| 衍生整理的公开发布属灰色地带 | 可能收到上游下架请求 | 明写来源与"未授权再分发"；只发整理、不发原件；官方页链接置顶 |
| `mov_text` 在部分浏览器不显示 | 观众看不到字幕 | 同一集提供 `.srt`；页面文案写"可开关的中文字幕"而不是"打开就有" |
| 148 MB Release 资产被误认为站内文件 | 有人把视频路径写进 `public/` | 导出器不落 MP4；`check-links` 只校验本地 poster；DoD 要求站内 0 个 MP4 |
| 卷级文案改动波及旧卷 | CS2680 页面文案变化 | 只改 Courses 卷字段；DoD 要求其余四卷源文件无改动 |
