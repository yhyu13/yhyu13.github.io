# StudentSim · 让 AI 教师在真实学生研究前获得可度量反馈

把 B 站第 209 期 NICE 学术 talk 做成一套**可讲、可查、可核对**的内容包。

- 视频：[《StudentSim：让AI教师在真实学生研究前获得可度量反馈》](https://www.bilibili.com/video/BV1EMJQ6tE8d)（BV1EMJQ6tE8d，63 分 15 秒，讲者 杨可 UIUC，主持 钱程 UIUC）
- 论文：*StudentSim: Training LLM-based Student Simulators* — [arXiv:2609.01591](https://arxiv.org/abs/2609.01591)（cs.CL，2026-09-01）
- 代码：<https://github.com/microsoft/StudentSim>

---

## 交付物

| 产物 | 路径 | 说明 |
|---|---|---|
| **口播 HTML deck** | `deck/index.html` | 18 页，`S` 键开演讲者视图（当前页 / 下一页 / 逐字稿 / 计时器）。主题 `tokyo-night`，`T` 键可切 5 套主题。 |
| **PPTX** | `slides/output/StudentSim-AI教师反馈.pptx` | 18 页 16:9，每页带演讲者备注（PowerPoint 备注视图）。 |
| **精读（简化文字 + 结构图）** | `analysis/00-核心结论.md` | 8 条结论 + Mermaid 结构图 + 回查表 + 口径与边界。 |
| **可交互网页** | `analysis/explainer.html` | 单文件，无网络依赖，手机可看。结论折叠 / F×R 象限 / 核对清单。 |
| **完整转写** | `transcript.md` | 21,562 字，按 10 分钟分片，带分片时间戳。 |
| **原始音频 + 元数据** | `p01.m4a`、`BV1EMJQ6tE8d.meta.json` | 逐字稿溯源用。 |

预览图：`deck/preview/slide-*.png`（HTML deck 逐页）、`slides/preview/slide-*.png`（PPTX 逐页近似渲染）。

---

## 一句话讲清

AI 教师好不好，不看它的指导写得多漂亮，而看**学生收到之后产生了什么反应**。
但这份反馈要等真学生，短则几个月、长则几年 —— 这篇工作把「学生」换成了
**按每个学生单独训练的 LLM 模拟器**，先在虚拟学生身上把 AI 教师练到会教，再用真人做最终验收。

---

## 单一数据源

`content.py` 是唯一事实源，所有产物都从它生成：

```
content.py ──> content.json ──> slides/compile.js ──> PPTX
          ├──> deck/build_deck.py ──> deck/index.html
          └──> analysis/build_explainer.py ──> 00-核心结论.md + explainer.html
```

改内容只改 `content.py`，然后：

```powershell
python dump_content.py
python deck\build_deck.py
node   slides\compile.js
python analysis\build_explainer.py
```

---

## 复现流水线

```powershell
# 1. 下载（b23.tv -> BV -> DASH 音频 -> m4a + 7 个 10 分钟分片）
python download.py

# 2. 转写（mcode-tools listen_audio，分片并行）
python transcribe.py all

# 3. 合并成 transcript.md
python merge_transcript.py

# 4. 生成全部产物
python dump_content.py
python deck\build_deck.py
node   slides\compile.js
python analysis\build_explainer.py
```

> `transcribe.py` 第 2 片（10:00–20:00）首次被上游语音识别服务拦截，
> 用 `fix_chunk01.py` 切成 4 段重试补回，内容完整。

---

## QA（可重跑）

```powershell
# PPTX：结构 / 越界 / 页码 / 占位符 / 备注 / 对比度
$env:PYTHONUTF8="1"; python slides\qa_check.py

# PPTX：逐页近似渲染 + 溢出估算 + 字体缺字检查
python slides\render_preview.py
python slides\check_glyphs.py

# HTML deck：逐页截图（headless Edge）
python deck\render.py 18

# 逐字稿长度（html-ppt 规则 150–300 字/页）
python notes_len.py

# 版面预算（哪个 block 超高）
node slides\metrics_report.js
```

当前状态：PPTX `validate.py` 全通过；越界 / 页码 / 占位符 / 对比度 0 问题；
18 页 0 溢出估算；逐字稿 18/18 在 150–300 区间；
HTML deck 与可交互页均在真实浏览器里跑过（翻页、结论折叠、象限展开、清单勾选均验证）。

---

## 公网落地页 + 讲解视频

| 产物 | 路径 | 说明 |
|---|---|---|
| **公网落地页** | `site/index.html` | 重新排版：深色 hero + 大标题 + 关键数字 + F×R + 方法 + 结果 + **落地 ROI 章节** + 下载区。共 10 个章节。 |
| **讲解视频** | `video/StudentSim-讲解.mp4` | 18 页幻灯片 + 逐字稿字幕，16:56，7.3 MB，H.264 / yuv420p / faststart。**是二次讲解，不是原演讲录像。** |

```powershell
python build_site.py     # 生成 site/（含 PPTX、deck、转写、精读、MP4）
python build_video.py    # 重新生成 MP4（烧录字幕，帧在 video/frames/，可删）
python check_site.py     # 校验全部链接与 deck 资源
```

### 发布（一次性）

**已上线**：<https://dhvofnxywk0rt.space.mcode.cn>

- Drive node ID：`458339130896543`
- `path` = `site/`，`source_path` = 项目根目录
- 再次更新同一个站时，把 `node_id` 传回去即可（原地覆盖，主域名与别名 URL 不变）

```powershell
# website_deploy(path=".../StudentSim-AI教师反馈/site",
#                source_path=".../StudentSim-AI教师反馈",
#                node_id="458339130896543")
```

> 站点为纯静态，无 CDN、无外部依赖，可离线打开。

**关于「原地更新已有 .cn 站」**：首次发布时本机 sqlite 与会话历史里都查不到那个站的部署记录，
拿不到它的 `node_id`，所以先按**新建独立站**发布了（对旧站是**增量**、不覆盖、不破坏）。
拿到旧站的 `node_id` 后，用上面同样的调用把 `node_id` 换过去即可完成原地更新。

**关于发布通道的 401**：发布走桌面端自己的 `/mavis/api/...`，用的是
`~/.minimax/local-runtime.auth.json` 里那份 **384 字符 app JWT**。它的 `updatedAtMs` 停在 32 天前时，
`get_upload_url` 会一直返回 `401 invalid access token`。
`mcode-tools` / Connector 走 shared-broker，不受影响。**在桌面端重新登录一次即可刷新**；
不要试图用 mcode 的 OAuth token 去填那个文件（只有 60 字符，格式与签发方都不同）。

---

## 落地 ROI：从哪边入手？

**从「评估端」切入，不要从「训练端」切入。** 完整论证见 `site/index.html` 第 07 节。

四个台阶，按顺序上（成本 ↑，收益确定性 ↓）：

| 台阶 | 做什么 | 一次性成本 | 收益确定性 |
|---|---|---|---|
| 0 | 先用 F / R 给现有系统体检 | 极低 | 高 |
| 1 | 用自己的日志造 S 集 / T 集 | 低 | 高 |
| 2 | 训 per-student LoRA 模拟器 | 中 | 中 |
| 3 | 模拟器当 reward 做 RL | 高 | 低（论文自陈 proof of concept） |

**为什么不能跳级**：评估端的收益是线性且一次投入永久复用；训练端的收益是二阶的**而且会被放大** ——
模拟器一旦错了，RL 会把这个错误当成学生的真实反应去优化 tutor（论文里用 GPT-5.4 当 reward，
accuracy 71.6%，比完全不训练 RL 的 75.7% 还低）。

**最陡的一个杠杆**：多数 AI tutor 日志里已经有「学生答错 → tutor 纠正 → 学生改对」这三段，
那正是论文的 T 集定义。**这一步的数据采集成本接近 0。**

**临界点**（讲者原话）：「当我们需要多能迭代的时候，可能才会需要学生模拟器的介入。」

---

## 两个容易踩的坑（已修，记一下）

1. **中文字体不能设成 Calibri / Cambria** —— 这两个字体**没有 CJK 字形**，
   会渲染成豆腐块。`deck.js` 里统一走 `fontFor(text, prefer)`：含中文就强制 Microsoft YaHei。
   同理 `✓`（U+2713）在 Microsoft YaHei 里**也不存在**，已换成 `★`。
2. **PowerShell 的 `[System.Uri]` 会把中文路径转成乱码** —— 用
   `urllib.request.pathname2url` 生成 file:// URL，或直接让 Python 驱动 Edge。

---

## 口径与边界

- **第 8 条结论「它能推广，但有三堵墙」是本次整理的归纳**，讲者未这样归纳过。
- Table 4 的列顺序是 **Accuracy / Guidance / Personalization**，对应 **90.5 / 3.31 / 3.93**。
- 网上流传的「2000+ Elo 子集 93.3% vs 56.7%」在本次核对的 arXiv 全文中**未检索到**，
  因此**不写进结论**；论文只写明该子集与三重标注子集「给出相同排序」。
- **时间戳是 10 分钟分片边界，不是词级时间戳** —— 语音识别输出不含词级时间信息，
  编造精确到秒的时间戳会给出假精度。
- 转写由语音识别生成，人名与技术名词可能有同音错字，已按上下文校正。
- 论文自陈边界：chess 是 **proof of concept**；迁移到自由文本领域需要各自的 reward 函数。

> 免责声明：本输出由 AI 辅助生成，仅用于信息整理与研究参考，不构成专业意见或决策依据。
