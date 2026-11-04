# 人脉课进 Courses 卷 — 素材清点 worksheet

Date: 2026-11-05
Status: 工作底稿（给同目录的 `2026-11-05-networking-course-volume-design.md` 提供事实）
Author: Hang Yu + Cindy
Scope: `C:\Git-repo-my\个人成长\networking-course` 下的全部产物
对照: `docs/superpowers/specs/2026-10-26-courses-volume-design.md`（Courses 卷的六种 section kind）

## 0. 一句话结论

现有素材可以填满 Courses 卷的 **decks / videos / text / digest / notice 五个区**，
不需要新增数据类型；唯一缺的是 **site（可交互学习站）**，而 site 目前是 Courses 卷
文案里承诺给每门课的能力。所以 v1 的正确切法是：**五区照发，卷级文案改成"有的课带学习站"**，
学习站另开一个 issue 做，不要为了凑齐六区硬塞一个假站。

| 可以放 | 不能放 | 先不放 |
|---|---|---|
| 107 页 PPTX、6 段带软字幕的 MP4、6 份 SRT、由 `content.json` 生成的笔记/屏幕文字/摘要、6 张海报 | `src/` 里的课程原片原音、`work/` 里的英文 ASR 与中间帧 | 交互学习站（v2） |

## 1. 目录里到底有什么

| 顶层 | 体积 | 文件数 | 是什么 | 处置 |
|---|---:|---:|---|---|
| `src/` | 1.57 GB | 108 | 54 节课程原片（`.mp4`）+ 原音（`.m4a`），从 B 站转载下载 | **不放**。第三方视听素材，见 §3 |
| `work/` | 794 MB | 38 项 | 每集渲染帧、TTS 音频、QA 截图、STT 英文转写 | **不放**。中间产物，且含第三方 ASR |
| `out/` | 285 MB | 19 | 6 集成片（带字幕 / clean 各一版）、6 份 SRT、1 份 PPTX | 部分放，见 §2 |
| `content/` | 144 KB | 7 | 104 页结构化内容：讲稿、备注、narration、6 模块地图、全课总结 | 页面文字层的**唯一来源** |
| `design/` | 12 KB | 2 | 配色（Michigan maize on ink）与字号规范 | 不上传，spec 引用其色值 |
| `scene/` | 16 KB | 1 | 时间轴渲染模板，`CONTENT` 由构建时注入 | v2 学习站的候选底座 |
| `tools/` | 314 KB | 48 | 整条流水线（下载、STT、TTS、排版、渲染、验收） | 不上传；导出脚本可复用其路径约定 |
| `bili_raw.log` | 5.4 MB | 1 | UTF-16 的抓取日志，含 B 站转载地址与官方 Coursera 地址 | **不放** |

## 2. 逐项判定

判定用四个词：**SHIP**（原样发布）、**GEN**（由源数据生成后发布）、
**HOLD**（有用途，但这一版不做）、**NEVER**（不发布）。

| # | 产物 | 证据（实测） | 目标区 | 判定 | 理由 |
|---|---|---|---:|---|---|
| 1 | `out/人脉不是通讯录-密歇根大学HowToNetwork-演讲版.pptx` | 2,087,594 B；107 页 = 104 内容页 + 封面 + 课程地图 + 总结；16:9 | decks | **SHIP** | 权威、可编辑的成品；文件名改成 ASCII 再导出 |
| 2 | `out/networking-ep1..6.mp4` | 6 个文件，148,147,958 B；1280×720 / 24 fps；合计 17:24.6；各含一条 `mov_text` 软字幕轨（第 3 条流） | videos | **SHIP**（GitHub Release） | 带字幕轨的版本比 clean 只多 34,528 B，没有理由发 clean |
| 3 | `out/networking-ep1..6-clean.mp4` | 148,113,430 B；无字幕流 | — | **NEVER** | 与 #2 重复的无字幕版本，发两份只会让清单变长 |
| 4 | `out/networking-ep1..6.srt` | 24,682 B；312 条 cue（59/44/58/59/49/43） | text/transcript | **SHIP** | 带时间轴的字幕原件；比转成纯文本更可核对 |
| 5 | `content/content.json` | 104 页；narration 4,567 字；note 2,845 字；6 模块；总结 5 条 | text/digest | **GEN** | 页面笔记、屏幕文字、两份摘要都从这里生成，不手写 |
| 6 | `content/ep1..6.json` | 每份只含对应集的 `episodes` 数组 | — | NEVER | `content.json` 的超集关系之外的重复副本，导出只用总文件 |
| 7 | `work/readable/01..54.md`、`work/transcripts/01..54.txt|json` | 54 份英文逐字稿，来自课程原音 ASR | — | **NEVER** | 第三方口述内容的逐字复制；中文讲稿是自己的整理，英文 ASR 不是 |
| 8 | `work/ep1..6/` | 单集 199 MB（帧 + TTS 音频） | — | **NEVER** | 可重建的中间产物 |
| 9 | `work/pptx_png/`、`work/pptx_sheets/`、`work/qa_epN/` | 8.0 MB / 3.2 MB / 8.4 MB×6 | — | **NEVER** | QA 渲染图；海报从成片定帧更准 |
| 10 | `scene/template.html` | 15 KB；`CONTENT` 注入；只有时间轴播放，没有翻页/搜索/概念索引 | site | **HOLD** | 它是"按时间播的片子"，不是"可读的站"；改造成 reader 是独立功能 |
| 11 | `src/` | 1.57 GB / 108 文件；B 站转载页 | — | **NEVER** | 见 §3 |
| 12 | `bili_raw.log`、`download.log` | 5.4 MB / 7 KB | — | **NEVER** | 抓取日志，且含转载地址 |
| 13 | 海报（待生成） | 从 #2 的 t=1.0 s 定帧，1280×720 JPEG q4，预计 6×100–150 KB | videos.poster | **GEN** | 第 1 页就是该集封面，标题各不相同（见下） |

每集封面页的 head（定帧选 t=1.0 s 的直接依据）：

| 集 | 封面 head | 时长 | 页数 | cue |
|---:|---|---:|---:|---:|
| 1 | 人脉不是通讯录 | 3:21 | 17 | 59 |
| 2 | 人脉是心态，不是技巧 | 2:24 | 15 | 44 |
| 3 | 人脉是一串动作，不是一次交易 | 3:13 | 19 | 58 |
| 4 | 先领导自己，才谈得上连接他人 | 3:24 | 20 | 59 |
| 5 | 信任藏在跟进里 | 2:40 | 17 | 49 |
| 6 | 有了关系之后，怎么做成事 | 2:23 | 16 | 43 |

## 3. 版权三分法（这一节决定什么能上公网）

| 层 | 具体文件 | 权属 | 结论 |
|---|---|---|---|
| 上游原件 | `src/` 的 54 段视频与音频；`bili_raw.log` 里的转载地址 | University of Michigan / Coursera；本条下载路径是第三方转载 | 不上传、不镜像、不提供下载；只链接官方课程页 |
| 上游口述的逐字复制 | `work/readable/`、`work/transcripts/` 的英文 ASR | 上游内容的复制件 | 不上传 |
| 自己的整理与再创作 | PPTX、6 段讲解视频、SRT、中文讲稿、备注、摘要 | 本人 | 可发布，但属"衍生整理"，需在页面上写明来源与"未获授权再分发" |

证据：`bili_raw.log`（UTF-16）里同时含
`https://www.coursera.org/learn/how-to-network` 和 B 站转载页
`https://www.bilibili.com/video/BV1JBxa6oE7m`；`src/` 的 108 个文件与 54 节一一对应。
`content/content.json` 的封面备注写的是"整门课 54 节、418 分钟，主讲 Tina Valentini"。

**残余风险要如实写出来**：把一门付费 Coursera 课程的整理稿公开在个人主页上，
和 CS2680 的处理属于同一类灰色地带——站点已有的做法是"只发自己的整理、不发原件、
写明未授权再分发"。这不是法律结论，是站点的既有先例；是否接受由站点所有者决定。

## 4. 体积与托管

| 去处 | 内容 | 体积 |
|---|---|---:|
| GitHub Pages（`public/courses/networking/files/`） | PPTX 2.0 MB + 海报 ~0.8 MB + 文本 ~0.07 MB + notice/manifest | **~2.9 MB** |
| GitHub Release（`courseware-networking-v1`） | 6 段 MP4 | **148.1 MB**（141.3 MiB） |
| 对照：CS2680 | Pages 15 MB / Release 89.4 MB | — |

Pages 的软上限约 100 MB，视频不能进站；Release 单文件上限 2 GB，单段最大 28.6 MB，
没有压力。

## 5. 与 Courses 卷六种 section 的对齐

`CourseSectionKind` 已经是 `site | decks | videos | text | digest | notice`，
`Course` 的 `sections` 按课配置，所以"少一个区"不需要改类型。

| kind | CS2680 现状 | 人脉课能给 | 缺口 | v1 |
|---|---|---|---|---|
| `site` | 17 页学习站 + 概念索引 + 全文搜索 | 无 | `scene/template.html` 只有时间轴播放 | **不发**，卷级文案改口 |
| `decks` | 10 份 PPTX | 1 份 107 页 PPTX | 无 | 发 |
| `videos` | 10 段 Release 视频 | 6 段 Release 视频 + 6 张海报 | 需要上传 Release | 发 |
| `text` | 27 笔记 + 9 讲义文本 | 6 笔记 + 6 屏幕文字 + 6 SRT | `CoursePage` 只渲染 notes/slides 两组，字幕组会被吞掉（`src/pages/CoursePage.tsx:215-223`） | 发，附带一处小组件改动 |
| `digest` | 3 份策展摘要 | 2 份：全课总结、六模块地图 | 无 | 发 |
| `notice` | 1 行 licence + NOTICE.txt | 同上 | 需要写清"未收录原片" | 发 |

## 6. 开工前必须定的事

1. **学习站做不做。** 不做就改卷级文案（`src/data/manuals.ts:178-205`、
   `src/components/CourseShelf.tsx:36`）。这两处现在都在说"每门课有学习站/交互页"。
2. **课程元数据。** 讲师 Tina Valentini、University of Michigan、Coursera；
   官方页 `https://www.coursera.org/learn/how-to-network`；学期写 `Coursera · 2026`。
3. **slug。** 建议 `networking`，落地 `/courses/networking`，与 `cs2680` 同层。
4. **海报定帧时间。** 建议 t=1.0 s（每集第一段的封面至少停留到 4.9 s，1 s 已稳定）。
5. **PPTX 文件名。** 中文名会在 URL 里被百分号编码，导出时改成
   `networking-course.pptx`。
6. **Release 标签。** 建议 `courseware-networking-v1`，与既有的 `courseware-v1` 并列。

## 7. 推荐切法

- **v1（本 spec）**：decks + videos + text + digest + notice；生成笔记/屏幕文字/两份摘要/
  六张海报；`text` 组件支持 `transcript` 组；卷级文案改口。
- **v2（另开 issue）**：把 `content.json` + `scene/template.html` 改成一个可翻页、可搜索的
  静态 reader，再补 `site` 区。CS2680 的学习站证明了这条路可行，但它是 17 页的独立应用，
  不是一次导出能变出来的。

## 附：本文数字是怎么量的

```bash
# 体积
du -sh src work out content design scene tools
# 视频时长 / 流
ffmpeg -i out/networking-ep1.mp4        # Duration + Stream #0:2 mov_text
# 字幕 cue 数
grep -c -- "-->" out/networking-ep1.srt
# 页数 / 讲稿字数
python -c "import json; d=json.load(open('content/content.json',encoding='utf-8')); print(sum(len(e['slides']) for e in d['episodes']))"
# 版权证据
python -c "print(open('bili_raw.log','rb').read().decode('utf-16',errors='ignore')[:2000])"
```
