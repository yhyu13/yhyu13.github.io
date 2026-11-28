export type Deck = {
  slug: string;
  title: string;
  year: string;
  date: string;
  source?: string;
  sourceUrl?: string;
  pdf: string; // "/decks/<slug>.pdf"
  description: string;
  /** Optional companions: the animated page, the long-read, the cut. */
  links?: { label: string; href: string }[];
  color?: string;
};

export const DECKS: Deck[] = [
  {
    slug: "atlas-fei-fei-li-world-model",
    title: "Atlas — 世界模型 · 李飞飞专访",
    year: "",
    date: "",
    source: "李飞飞专访",
    sourceUrl: "https://www.bilibili.com/video/BV1oWtC6XExN",
    pdf: "/decks/atlas-fei-fei-li-world-model.pdf",
    description:
      "李飞飞谈世界模型（world model）与空间智能——从视觉数据到能理解物理世界的模型，通向通用智能的一条路径。",
  },
  {
    slug: "bci-industry-survey",
    title: "脑机接口产业调查 — 离现实生产力还有多远",
    year: "2026",
    date: "2026-11-05",
    source: "Bilibili · 铉铮",
    sourceUrl: "https://www.bilibili.com/video/BV1wdx96dEQW",
    pdf: "/decks/bci-industry-survey.pdf",
    description:
      "《求是》2026/21 深度调研的解读——科学前沿、工程技术、产业投资、治理监管四层递进，用融资额、企业数与时间表回答一个问题：脑机接口离真正的生产力还有多远。",
    links: [
      { label: "90 秒动画页", href: "/bci/film.html" },
      { label: "长页解读", href: "/bci/longread.html" },
      { label: "MP4 · 配音版", href: "/bci/bci-industry-survey-90s-vo.mp4" },
    ],
  },
  {
    slug: "berkeley-ai-alumni-panel",
    title: "Berkeley AI 校友圆桌 — DeepMind / Cursor / xAI",
    year: "2026",
    date: "2026-10-09",
    source: "Bilibili · geek_UNCLE",
    sourceUrl: "https://www.bilibili.com/video/BV1Nkph6sEQ6",
    pdf: "/decks/berkeley-ai-alumni-panel.pdf",
    description:
      "78.8 分钟的伯克利校友圆桌压成七条能直接用的结论：让人记住你的是作品不是简历、海投是策略不是赌博、实习是双向尽调，以及大厂与初创的真实体感。",
    links: [
      {
        label: "口播成片",
        href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v1/berkeley-ai-alumni-panel-voiced.mp4",
      },
    ],
  },
  {
    slug: "blackhole-cpp-simulation-summary",
    title: "黑洞 C++ 模拟",
    year: "",
    date: "",
    source: "Bilibili",
    sourceUrl: "https://www.youtube.com/watch?v=8-B6ryuBkCM",
    pdf: "/decks/blackhole-cpp-simulation-summary.pdf",
    description:
      "用 C++ 做黑洞物理模拟的整理——从引力/光线追踪到可视化，把相对论的直觉写成可运行的代码。",
  },
  {
    slug: "blotnick-trading-psychology",
    title: "交易心理学 — Blotnick",
    year: "",
    date: "",
    source: "Blotnick",
    sourceUrl: "https://www.bilibili.com/video/BV1oUtx6kEZv",
    pdf: "/decks/blotnick-trading-psychology.pdf",
    description:
      "Blotnick《交易心理学》的梳理——市场起伏背后是人性与纪律，如何在亏损与贪婪之间守住自己的交易系统。",
  },
  {
    slug: "china-four-classes",
    title: "中国四个阶层",
    year: "",
    date: "",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1oaEW6VErW",
    pdf: "/decks/china-four-classes.pdf",
    description:
      "以视频内容梳理中国社会四个阶层的划分、流动与处境——一份观察当下结构的切片。",
  },
  {
    slug: "davos-2026-musk-fink",
    title: "2026 达沃斯 — 马斯克对话贝莱德 CEO",
    year: "2026",
    date: "2026",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1vzzxBFEpY",
    pdf: "/decks/davos-2026-musk-fink.pdf",
    description:
      "32 分钟对谈的提炼：特斯拉与贝莱德两种复利、能源与算力瓶颈、太空 AI 数据中心，以及火星与好奇心这笔长期账。",
  },
  {
    slug: "deepseek-r1-reasoning",
    title: "DeepSeek-R1 — 为什么会推理",
    year: "2026",
    date: "2026-11-12",
    source: "Bilibili · 斯坦福讲座",
    sourceUrl: "https://www.bilibili.com/video/BV1BQsX6yELJ",
    pdf: "/decks/deepseek-r1-reasoning.pdf",
    description:
      "16 页讲清 R1 的推理是怎么训出来的：思维链为什么不够、强化学习里奖励怎么给、以及「查得到」和「要想一步」的分界。",
  },
  {
    slug: "dsh-blender-plugin-v21",
    title: "DSH × Blender 实时插件 v2.1.0",
    year: "2026",
    date: "2026-10-16",
    source: "Bilibili · 赛博雪豹",
    sourceUrl: "https://www.bilibili.com/video/BV1ohJ86wEaQ",
    pdf: "/decks/dsh-blender-plugin-v21.pdf",
    description:
      "DeepSeek Harness 直连实时驱动的 Blender 插件更新——面板内缩放/平移、一次多选构件、headless 作业区，把 AI 建模接进真实 GUI。",
  },
  {
    slug: "emba-ipo-capital-path",
    title: "EMBA 企业上市课 — 成长型企业的资本路径",
    year: "2018",
    date: "2018",
    source: "Bilibili · Martinludeking",
    sourceUrl: "https://www.bilibili.com/video/BV15s411g7DG",
    pdf: "/decks/emba-ipo-capital-path.pdf",
    description:
      "一堂 2018 年 EMBA 课的还原：多层次资本市场怎么分层、新三板挂牌与投行的双重角色、发审委六大关注点、港股新规。规则此后已多次修订，只作课堂内容存档。",
  },
  {
    slug: "flirting-power",
    title: "调情力 — 让你的生活更美好",
    year: "",
    date: "",
    source: "Bilibili · 脑神经科学",
    sourceUrl: "https://www.bilibili.com/video/BV1bCn36NEF1",
    pdf: "/decks/flirting-power.pdf",
    description:
      "把一期 12 分钟的讲稿整理成可操作的关系学：调情不是套路，是持续给出注意力、好奇与选择。",
    links: [
      {
        label: "成片 · 配音版",
        href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v1/flirting-power-reel.mp4",
      },
    ],
  },
  {
    slug: "gow-raising-kratos",
    title: "God of War — Raising Kratos",
    year: "2018",
    date: "2018",
    source: "YouTube · PlayStation Europe",
    sourceUrl: "https://www.youtube.com/watch?v=ra_R-K_IoUc",
    pdf: "/decks/gow-raising-kratos.pdf",
    description:
      "“Making Of” 纪录片——圣莫尼卡如何用一镜到底与父子羁绊重塑奎托斯。导演 Brandon Aureli 与 Santa Monica Studio 团队分享五年磨一剑的幕后。",
  },
  {
    slug: "huberman-accelerated-learning",
    title: "Huberman Lab — 如何加速学习（Alpha School）",
    year: "",
    date: "",
    source: "Bilibili · Andrew Huberman",
    sourceUrl: "https://www.bilibili.com/video/BV114YX63Ene",
    pdf: "/decks/huberman-accelerated-learning.pdf",
    description:
      "14 页拆 Alpha School 的学习法：每天两小时学术时间怎么做到十倍效率，Worked Example + 初始掌握 + 间隔重复三件套，以及 AI 在其中的位置。嘉宾姓名两处来源不一致：搬运标题写 Joe Liemandt，deck 与 ASR 稿写 Joe Lonsdale；本页不代为判定，以原片为准。",
  },
  {
    slug: "huberman-reaching-the-sublime",
    title: "Huberman × Robert Greene — 触及崇高之境",
    year: "",
    date: "",
    source: "Bilibili · Andrew Huberman",
    sourceUrl: "https://www.bilibili.com/video/BV1zbypzoEXg",
    pdf: "/decks/huberman-reaching-the-sublime.pdf",
    description:
      "14 页重述 Huberman 与 Robert Greene 的 2 小时 10 分对谈：意识是一个圈、崇高在圈外；拉丁语 sublimin 是「走到门槛前」；中风后的病房窗口如何改写雄心，以及把崇高感落回日常。要点重述，不是原片翻译。",
    links: [
      {
        label: "口播成片",
        href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v5/huberman-reaching-the-sublime-voiced.mp4",
      },
    ],
  },
  {
    slug: "huberman-ross-edgley",
    title: "Huberman × Ross Edgley — 动力与韧性",
    year: "",
    date: "",
    source: "Bilibili · Andrew Huberman",
    sourceUrl: "https://www.bilibili.com/video/BV1LWsp6pEj6",
    pdf: "/decks/huberman-ross-edgley.pdf",
    description:
      "16 页重述 Huberman 与 Ross Edgley 的 2 小时 36 分长谈：动力不是开关，而是一组可以轮换的理由；从十岁背包里的石头，到环英国、环冰岛，再到空转时怎么重新点火。片内时间码均指原片。",
    links: [
      {
        label: "口播成片",
        href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v5/huberman-ross-edgley-voiced.mp4",
      },
    ],
  },
  {
    slug: "meyerowitz-photography-master",
    title: "乔尔·梅耶罗维茨 — 拆解摄影大师 001",
    year: "2026",
    date: "2026-11-10",
    source: "Bilibili · 看世界的方法",
    sourceUrl: "https://www.bilibili.com/video/BV1WJW36aETG",
    pdf: "/decks/meyerowitz-photography-master.pdf",
    description:
      "20 页拆解纽约街头摄影师 Joel Meyerowitz：从 35mm 追瞬间到 8×10 等一束光，五个问题回到同一件事——他拍的不是人，是人与环境的关系。",
  },
  {
    slug: "moon-industrialization-sfia",
    title: "月球工业化 — SFIA",
    year: "",
    date: "",
    source: "SFIA",
    sourceUrl: "https://www.bilibili.com/video/BV1TyXtYwEmF",
    pdf: "/decks/moon-industrialization-sfia.pdf",
    description:
      "SFIA 风格的月球工业化推演——从氦-3 到资源开采，把月球当作一座可建造的工业基地来设想。",
  },
  {
    slug: "pboc-half-year-work-conference-2024",
    title: "央行半年工作会 2024",
    year: "2024",
    date: "2024",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1BqgH6XEMF",
    pdf: "/decks/pboc-half-year-work-conference-2024.pdf",
    description:
      "中国人民银行 2024 年半年工作会议要点——货币政策、金融风险与下一阶段的工作部署。",
  },
  {
    slug: "personal-agi-garry-tan",
    title: "Personal AGI — Garry Tan",
    year: "",
    date: "",
    source: "Garry Tan",
    sourceUrl: "https://www.bilibili.com/video/BV1aAuR6wERV",
    pdf: "/decks/personal-agi-garry-tan.pdf",
    description:
      "Garry Tan 谈个人化 AGI ——当模型成为人人可得的智能工具，个体如何拥有并驾驭自己的智能体。",
  },
  {
    slug: "ps5-pro-technical-seminar",
    title: "PS5 Pro 技术研讨会 — Cerny",
    year: "2024",
    date: "2024",
    source: "YouTube · PlayStation",
    sourceUrl: "https://www.youtube.com/watch?v=lXMwXJsMfIQ",
    pdf: "/decks/ps5-pro-technical-seminar.pdf",
    description:
      "Mark Cerny 在 SIE 总部讲解 PS5 Pro ——GPU、光追与机器学习三大支柱如何驱动主机世代中期的视觉跃迁。",
  },
  {
    slug: "taikong-jijian-deeptalk-ep03",
    title: "太空基建 · DeepTalk EP.03",
    year: "",
    date: "",
    source: "Bilibili · DeepTalk",
    sourceUrl: "https://www.bilibili.com/video/BV1SnDfB6E9a",
    pdf: "/decks/taikong-jijian-deeptalk-ep03.pdf",
    description:
      "DeepTalk 第 03 期：太空基建——从发射成本到轨道服务，把太空当作一场可长期投入的基础设施建设。",
  },
  {
    slug: "taikong-xingjian-jiguang-tongxin",
    title: "星际激光通信产业链",
    year: "",
    date: "",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1erZaBoEA6",
    pdf: "/decks/taikong-xingjian-jiguang-tongxin.pdf",
    description:
      "星间激光通信产业链——从星间链路到地面站，低成本高带宽的太空通信如何从概念走向商用。",
  },
  {
    slug: "voxemw-kimik3-realtimevideocall",
    title: "Vox-EMW · Kimi K3 实时视频通话",
    year: "",
    date: "",
    source: "Vox-EMW",
    pdf: "/decks/voxemw-kimik3-realtimevideocall.pdf",
    description:
      "Kimi K3 与 Vox-EMW 的实时视频通话演示——低延迟、可打断的多模态语音交互体验。",
  },
  {
    slug: "ai-coworker-grok-bot",
    title: "AI 同事如何工作 — Grok Bot 的软件工厂",
    year: "2026",
    date: "",
    source: "Y Combinator · Lightcone",
    pdf: "/decks/ai-coworker-grok-bot.pdf",
    description:
      "12 页拆 Lightcone 那期 Grok Bot 对谈：六个 AI 员工怎么排成一条流水线、人只在批准这一步出现，以及「软件工厂」里哪些环节仍然得靠人。",
    links: [
      { label: "口播片", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v2/ai-coworker-grok-bot-voiced.mp4" },
    ],
  },
  {
    slug: "ai-long-project",
    title: "如何用 AI 长期开发一个复杂项目",
    year: "",
    date: "",
    source: "Bilibili · oil欧呦",
    sourceUrl: "https://www.bilibili.com/video/BV1rPWd6nEpP",
    pdf: "/decks/ai-long-project.pdf",
    description:
      "把模型的执行力留下，把长期迭代里的混乱管住：16 页讲一个复杂项目怎么分工、每次改动怎么验收、规则怎么沉淀进仓库。",
  },
  {
    slug: "ascent-trimsheet-disguise",
    title: "《上行战场》一张贴图的伪装",
    year: "",
    date: "",
    source: "Bilibili · CG加油站",
    sourceUrl: "https://www.bilibili.com/video/BV1kXTL6qEYb",
    pdf: "/decks/ascent-trimsheet-disguise.pdf",
    description:
      "11 人团队、4 名美术、8000+ 资产，硬表面 80% 共用一张 4K trim sheet：Tor Frick 在 GDC 2022 讲的那套「伪装」与数学。数字出自原片转述。",
    links: [
      { label: "口播片", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v2/ascent-trimsheet-voiced.mp4" },
    ],
  },
  {
    slug: "codex-blender-camera",
    title: "Codex × Blender — AI 复杂运镜怎么做",
    year: "2026",
    date: "2026-09-15",
    source: "Bilibili · T7丨第七变量",
    sourceUrl: "https://www.bilibili.com/video/BV1VNes61EvX",
    pdf: "/decks/codex-blender-camera.pdf",
    description:
      "一个 CQB 一镜到底的案例：五版白模预演、两类参考图、一份分工明确的提示词，从 Blender 白模到 Seedance 生成。",
    links: [
      { label: "口播片", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v2/codex-blender-camera-voiced.mp4" },
    ],
  },
  {
    slug: "cook-skill-vote",
    title: "Cook — 给 Agent 一条分数线",
    year: "",
    date: "",
    source: "Bilibili · code炀",
    sourceUrl: "https://www.bilibili.com/video/BV1SLW66oErv",
    pdf: "/decks/cook-skill-vote.pdf",
    description:
      "Leon Lin 的 cook 循环：给 agent 一个目标、一条分数线和一段时间，让它自己做到像参考图。10 页讲清评分标准、评委与止损。",
  },
  {
    slug: "dan-koe-account-growth",
    title: "Dan Koe — 从零做账号的两个杠杆",
    year: "",
    date: "",
    source: "Bilibili · PatternSight",
    sourceUrl: "https://www.bilibili.com/video/BV144Hj6LEMh",
    pdf: "/decks/dan-koe-account-growth.pdf",
    description:
      "从零做账号不是多发几条，而是两个杠杆：把内容变成资产，把资产换成注意力。16 页压缩重讲。",
    links: [
      { label: "口播片", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v2/dan-koe-account-growth-voiced.mp4" },
    ],
  },
  {
    slug: "dan-koe-creator-play",
    title: "Dan Koe — 网红退场，手艺人上场",
    year: "",
    date: "",
    source: "Bilibili · 来点思考",
    sourceUrl: "https://www.bilibili.com/video/BV1p2xL67EJ3",
    pdf: "/decks/dan-koe-creator-play.pdf",
    description:
      "流量红利结束后，创作者该换的玩法：从追热点转向做手艺，用作品积累而不是用算法喂养。",
    links: [
      { label: "口播片", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v2/dan-koe-creator-play-voiced.mp4" },
    ],
  },
  {
    slug: "dankoe-writing",
    title: "Dan Koe — 拯救大脑的写作系统",
    year: "",
    date: "",
    source: "Bilibili · PatternSight",
    sourceUrl: "https://www.bilibili.com/video/BV13v4A6cEL9",
    pdf: "/decks/dankoe-writing.pdf",
    description:
      "一套让「学的更快、想的更清」的写作流程：先想清楚写给谁、再决定写什么，最后才是怎么写。",
    links: [
      { label: "口播片", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v2/dankoe-writing-voiced.mp4" },
    ],
  },
  {
    slug: "deadlock-improvement",
    title: "Deadlock 变强哲学 — 比别人更快提升",
    year: "",
    date: "",
    source: "Bilibili · 旁白_B",
    sourceUrl: "https://www.bilibili.com/video/BV1pGsL62E7y",
    pdf: "/decks/deadlock-improvement.pdf",
    description:
      "Akraken 讲的不是孤立地变强，而是相对速度：练什么、怎么复盘、怎么把每一次对局变成下一次的输入。",
    links: [
      { label: "口播片", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v2/deadlock-improvement-voiced.mp4" },
    ],
  },
  {
    slug: "deepseek-29-skills",
    title: "DeepSeek 装 29 个 Skill — 把 Flash 用成 Opus 的八成",
    year: "",
    date: "",
    source: "Bilibili · 马丁没有早晨zZ",
    sourceUrl: "https://www.bilibili.com/video/BV1ZMxs6PEfD",
    pdf: "/decks/deepseek-29-skills.pdf",
    description:
      "29 个技能怎么分工、哪些真的提效、哪些只是好看：16 页拆一套可复用的 DeepSeek Stack。",
    links: [
      { label: "口播片", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v2/deepseek-29-skills-voiced.mp4" },
    ],
  },
  {
    slug: "grok-bot-marketing",
    title: "Grok Bot 营销小队 — 六个 AI 员工",
    year: "",
    date: "",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1ZBHx6ZELv",
    pdf: "/decks/grok-bot-marketing.pdf",
    description:
      "官方营销指南的解读：六个岗位、一条流水线，人只做批准。每个岗位的输入输出与验收标准都写清楚了。",
    links: [
      { label: "口播片", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v2/grok-bot-marketing-voiced.mp4" },
    ],
  },
  {
    slug: "herdr-multi-agent",
    title: "Herdr — 多 Agent 的瓶颈不是算力",
    year: "2026",
    date: "",
    source: "Bilibili · 为什么叫QQ",
    sourceUrl: "https://www.bilibili.com/video/BV1xz8Y6SEX1",
    pdf: "/decks/herdr-multi-agent.pdf",
    description:
      "多 Agent 真正的瓶颈是人的注意力：Herdr 把并行的 coding agent 收进一个终端工作区，让「看谁在等我」变成一屏能扫完的事。",
    links: [
      { label: "口播片", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v2/herdr-multi-agent-voiced.mp4" },
    ],
  },
  {
    slug: "mainstream-media-reform",
    title: "深化主流媒体系统性变革",
    year: "2026",
    date: "",
    source: "Bilibili · 铉铮",
    sourceUrl: "https://www.bilibili.com/video/BV1Bh4n6dEb5",
    pdf: "/decks/mainstream-media-reform.pdf",
    description:
      "《求是》2026 年第 11 期专访的解读：怎么看、怎么办——把五组关系放在一起，本身就是一种判断。",
  },
  {
    slug: "march-witness",
    title: "随军记 — 一个瑞士传教士的长征见证",
    year: "",
    date: "",
    source: "中国军号 · 长征颂 MV",
    pdf: "/decks/march-witness.pdf",
    description:
      "薄复礼（Alfred Bosshardt）1934.10—1936.4 的 560 天：16 页逐镜拆《The Journey Witnesses》怎么用影像讲一段被记录下来的长征。",
  },
  {
    slug: "megadev-generating-text",
    title: "MegaDev 第 1 课 — 生成文本",
    year: "",
    date: "",
    source: "Bilibili · P1",
    sourceUrl: "https://www.bilibili.com/video/BV1xsWQ6nEky",
    pdf: "/decks/megadev-generating-text.pdf",
    description:
      "中高级 AI 开发课的第一讲：生成文本这条链路上，从 prompt 到结构化输出各自解决什么问题。28 页。",
  },
  {
    slug: "musk-work-method",
    title: "马斯克工作法 — 9200 条笔记里的操作系统",
    year: "2026",
    date: "2026-11-11",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1HNW26fErj",
    pdf: "/decks/musk-work-method.pdf",
    description:
      "把一部纪录片压成一套可以拆开的操作系统：一套操作系统、五步算法、矢量、组织即产品、速度与失败。",
    links: [
      { label: "口播片", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v2/musk-work-method-voiced.mp4" },
    ],
  },
  {
    slug: "nobody-saves-you",
    title: "没人来救你 — 送给迷茫困惑者的真心话",
    year: "",
    date: "",
    source: "Bilibili · PatternSight",
    sourceUrl: "https://www.bilibili.com/video/BV1M9n46CEKm",
    pdf: "/decks/nobody-saves-you.pdf",
    description:
      "原片把出口从别人身上收回来：朋友、家人、政府和讲者本人都不会替你走完这一步。建议和工具可以留下，决定必须自己做。",
    links: [
      { label: "口播片", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v2/nobody-saves-you-voiced.mp4" },
    ],
  },
  {
    slug: "pstack-ai-automation",
    title: "pstack — 怎么让 AI 全自动完成工作",
    year: "",
    date: "",
    source: "Bilibili · 非良237",
    sourceUrl: "https://www.bilibili.com/video/BV12D4E6NEMn",
    pdf: "/decks/pstack-ai-automation.pdf",
    description:
      "Lauren Tan（poteto）开源工作流的拆解：月合并 2,500、约 60 个 skill、新手 6 步。产量不是装完就有，是验证和环境换来的信任。",
  },
  {
    slug: "skill-doctor",
    title: "Skill Doctor — 会自我改进的 Agent",
    year: "2026",
    date: "2026-09-04",
    source: "Bilibili · 为什么叫QQ",
    sourceUrl: "https://www.bilibili.com/video/BV1dYt46kEMw",
    pdf: "/decks/skill-doctor.pdf",
    description:
      "让 Agent 改自己的说明书：失败会话取证、最小 diff、PR 人审、可回滚。证据只从失败的会话里取。",
    links: [
      { label: "口播片", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v2/skill-doctor-voiced.mp4" },
    ],
  },
  {
    slug: "skill-trigger",
    title: "Skill 怎么写，才会被 Agent 用上",
    year: "",
    date: "",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1BqnJ63E4h",
    pdf: "/decks/skill-trigger.pdf",
    description:
      "把一支讲解收成四件事：触发、正文、验收和维护。不用点名也会被用上，靠的是描述写对了场景。",
    links: [
      { label: "口播片", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v2/skill-trigger-voiced.mp4" },
    ],
  },
  {
    slug: "agent-eval-skills",
    title: "Agent 评测 — Skill、Eval 与验证",
    year: "2026",
    date: "2026-09-12",
    source: "Bilibili · AI变局",
    sourceUrl: "https://www.bilibili.com/video/BV1ceYR65EmK",
    pdf: "/decks/agent-eval-skills.pdf",
    description:
      "SpaceXAI 工程师公开的 Agent 秘诀：为什么模型总在瞎编、一道可执行的检查为什么比一段说明更值钱，以及 skill 该怎么写成能被验证的样子。11 页。",
  },
  {
    slug: "ai-bubble-not-yet",
    title: "AI 泡沫未至 — Wei Li × Joe Cass",
    year: "",
    date: "",
    source: "Bilibili · 英语学习小助理沐沐",
    sourceUrl: "https://www.bilibili.com/video/BV1G2bW6cEWg",
    pdf: "/decks/ai-bubble-not-yet.pdf",
    description:
      "贝莱德全球首席投资策略师 Wei Li 与 Joe Cass 的对谈：AI 资本开支处在周期哪一段、泡沫的判据是什么、什么时候才该担心。23 页。",
  },
  {
    slug: "one-container-intl-econ-law",
    title: "一个集装箱讲完国际经济法",
    year: "",
    date: "",
    source: "Bilibili · 科普观察室",
    sourceUrl: "https://www.bilibili.com/video/BV1oCxr65EfQ",
    pdf: "/decks/one-container-intl-econ-law.pdf",
    description:
      "用一只集装箱的旅程串起国际经济法：谁在定规则、争端怎么解决、为什么关税只是最表层的那一刀。20 页精读。",
  },
  {
    slug: "thousand-town-engine",
    title: "千人小镇 — 技术栈与制作方法拆解",
    year: "2026",
    date: "2026-10-19",
    source: "Bilibili · 仪绘士BY",
    sourceUrl: "https://www.bilibili.com/video/BV1ArJ96CE3P",
    pdf: "/decks/thousand-town-engine.pdf",
    description:
      "一部 5 分钟的「AI 搭了一座千人小镇」视频，拆成 22,054 行源码、4 个 vendor 库和一份可跑 Demo：证据链四条腿，每条都指回可核对的字节。13 页。",
    links: [
      { label: "成片 · 1:39", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v3/thousand-town-showreel.mp4" },
    ],
  },
  {
    slug: "wuxia-town-pitch",
    title: "武侠世界 — Demo Day Pitch",
    year: "2026",
    date: "",
    source: "首届 AI 产品挑战赛 · Demo Day",
    pdf: "/decks/wuxia-town-pitch.pdf",
    description:
      "不在场（While You're Away）：用户离开时世界继续活着，回来时一切可交付。村/城/塞三块场景、240 名自主 agent、昼夜时辰、种子即内容。9 页 pitch。",
    links: [
      { label: "演示片段 · 0:34", href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v3/wuxia-town-demo.mp4" },
    ],
  },

  {
    slug: "wharton-mollick-ai-startups",
    title: "沃顿 AI 教授 — 别再创办软件公司了",
    year: "",
    date: "",
    source: "Bilibili · -spacecaps-",
    sourceUrl: "https://www.bilibili.com/video/BV1do4h6UEMu",
    pdf: "/decks/wharton-mollick-ai-startups.pdf",
    description:
      "Ethan Mollick 那期访谈的 16 页整理：AI 把「做产品」的门槛压平之后，能赚钱的活儿挪到了理解场景、做判断和学摩尔定律上。",
  },

  {
    slug: "astra-ysm-one-shot",
    title: "一轮出 YSM — 92 秒原片的拆解",
    year: "2026",
    date: "2026-11-21",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1o1s26sE79",
    pdf: "/decks/astra-ysm-one-shot.pdf",
    description:
      "原片只有 92 秒：一张参考图、一个 Blockbench 模型、一段游戏内展示，既不展示提示词也不讲骨骼。这份课件补的是原片跳过的那一段——模型合同、校验器，和一条能验收的直出路径。",
  },
  {
    slug: "blockbench-ai-modeling",
    title: "让 AI 在 Blockbench 里做 MC 风格模型",
    year: "2026",
    date: "2026-11-21",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1ozH56tEzk",
    pdf: "/decks/blockbench-ai-modeling.pdf",
    description:
      "从连接到建模、打分与修改，完整走一遍 Blockbench × AI。真正要留下的不是提示词，而是一套自己的技能库：适用范围、判断标准，以及这次 AI 猜错了什么。",
  },
  {
    slug: "blockbench-course",
    title: "GPT 操作 Blockbench — 建模全流程",
    year: "2026",
    date: "2026-11-21",
    source: "Bilibili · RadorRador",
    sourceUrl: "https://www.bilibili.com/video/BV1Fsx56CEfi",
    pdf: "/decks/blockbench-course.pdf",
    description:
      "一支 4 分 24 秒的教程，加上在本机把整条链路重新跑一遍的结果：不是让 AI 画模型，而是把 Blockbench 变成可调用的工具端——插件开一个本地 MCP 服务，建模指令在编辑器里一块块长出来。",
  },
  {
    slug: "brynjolfsson-10y-wealth",
    title: "未来十年，钱往哪流 — Brynjolfsson 访谈解读",
    year: "2026",
    date: "2026-11-21",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1i8JD6WE3j",
    pdf: "/decks/brynjolfsson-10y-wealth.pdf",
    description:
      "斯坦福经济学家 Erik Brynjolfsson 的任务迁移框架：不问「职业会不会被替代」，问手上那十几件事分别会怎样。两个机制、四种结果、一张能验收的动作表。",
  },
  {
    slug: "deepseek-harness-tutorial",
    title: "DeepSeek Harness — 从对话到交付",
    year: "2026",
    date: "2026-11-25",
    source: "Bilibili · Git源宝",
    sourceUrl: "https://www.bilibili.com/video/BV1REx46NEc4",
    pdf: "/decks/deepseek-harness-tutorial.pdf",
    description:
      "50 分钟教程压成六个入口：模型与 Harness 的分工、安装与模型配置、四种模式与权限边界、插件（跨会话记忆与课程助手），以及按任务选择用法。",
  },
  {
    slug: "dsh-graph-case-study",
    title: "从空仓库到 v0.1 — dsh-graph 实战复盘",
    year: "2026",
    date: "2026-11-25",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1L4as6CE5v",
    pdf: "/decks/dsh-graph-case-study.pdf",
    description:
      "一个 Agent 项目如何派发、返工与验收：5 小时 44 分工作、22 次结构化裁决、439 条自动化用例全绿。案例是 sld-editor，一个可离线运行的变电站接线图编辑器。",
  },
  {
    slug: "dsh-memory-plugins",
    title: "三款 DSH 记忆插件对比",
    year: "2026",
    date: "2026-11-25",
    source: "Bilibili · 一桶布丁",
    sourceUrl: "https://www.bilibili.com/video/BV1rDx46VENg",
    pdf: "/decks/dsh-memory-plugins.pdf",
    description:
      "四路共同作答 687 题：Soul 在插件组排第一（402 题 · 58.5%），但仍落后 Qwen 直接检索对照（574 题 · 83.6%）。一张表看清插件记忆与直接检索的差距。",
  },
  {
    slug: "dsh-model-fusion",
    title: "DSH Model Fusion — 一个模型判断，一个模型执行",
    year: "2026",
    date: "2026-11-25",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1xcap6XEjm",
    pdf: "/decks/dsh-model-fusion.pdf",
    description:
      "Lead 负责理解需求、交代范围与验收、审查证据；Sidekick 负责改代码、跑测试、按反馈返工。两个模型，对用户仍是一个入口。",
  },
  {
    slug: "dsh-synapse-map",
    title: "Synapse — 把 DSH 对话摊成一张地图",
    year: "2026",
    date: "2026-11-25",
    source: "Bilibili · 良面Lab",
    sourceUrl: "https://www.bilibili.com/video/BV1cQ8g6VEVz",
    pdf: "/decks/dsh-synapse-map.pdf",
    description:
      "Synapse 不替换原生聊天，而是给同一工作区加一个地图视图：问答放在卡片上，连线显示追问关系，可以沿当前节点追问，也可以用原生 Fork 另开分支。",
  },
  {
    slug: "grok-bot-claude-code",
    title: "Grok Bot × Claude Code — 改动定档",
    year: "2026",
    date: "2026-11-21",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1314F6oEx9",
    pdf: "/decks/grok-bot-claude-code.pdf",
    description:
      "编排 bot 想清楚、施工 bot 动手、人来定谁能自动合并。真正要留下的不是流程，而是一道一道能核的门。",
  },
  {
    slug: "hyperframes-video-harness",
    title: "HyperFrames — 让智能体少猜一次",
    year: "2026",
    date: "2026-11-25",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1DssE6NEJd",
    pdf: "/decks/hyperframes-video-harness.pdf",
    description:
      "写得出视频，不等于看得懂视频。代码能表达排版与动效，但素材里有什么、谁挡住谁、音画错开多久，只有成片才知道；关键是把审片证据绑到明确的产物版本。",
  },
  {
    slug: "learnharness-tutor",
    title: "LearnHarness — AI 私教先摸你的底",
    year: "2026",
    date: "2026-11-18",
    source: "Bilibili · 网络宝藏社",
    sourceUrl: "https://www.bilibili.com/video/BV1hCs66aEnQ",
    pdf: "/decks/learnharness-tutor.pdf",
    description:
      "一分钟推介片的重讲：AI 私教不是更会讲，而是先判断你懂到哪一步，再决定讲什么。原片的说法与仓库文档分开记，不混为一谈。",
  },
  {
    slug: "skill-ablation-field-guide",
    title: "Skill 没效果？先跑对照实验",
    year: "2026",
    date: "2026-11-26",
    source: "Bilibili · 为什么叫QQ",
    sourceUrl: "https://www.bilibili.com/video/BV1fp4E6WEBk",
    pdf: "/decks/skill-ablation-field-guide.pdf",
    description:
      "把「Skill 有没有用」拆成两道可做的实验：先确认它真的被加载，再在未见任务上比配对差。给 Agent 与 CI 团队的一张发布检查表。",
    links: [
      {
        label: "口播成片 · 2:09",
        href: "https://github.com/yhyu13/yhyu13.github.io/releases/download/video-slides-extras-v4/skill-ablation-hts.mp4",
      },
    ],
  },
  {
    slug: "system-duo-two-modes",
    title: "System Duo — 快判断，慢推理",
    year: "2026",
    date: "2026-11-22",
    source: "Bilibili",
    sourceUrl: "https://www.bilibili.com/video/BV1B94Y6bEcW",
    pdf: "/decks/system-duo-two-modes.pdf",
    description:
      "把大量定型判断从生成式推理里拆出来：快速决策模型负责分流与检查，慢速大模型负责规划与行动。不是替代，是各就各位。",
  },
  {
    slug: "thoughtdag-context-map",
    title: "ThoughtDAG — 把对话变成上下文地图",
    year: "2026",
    date: "2026-11-25",
    source: "Bilibili · Chatchan",
    sourceUrl: "https://www.bilibili.com/video/BV1mqbL6PEZz",
    pdf: "/decks/thoughtdag-context-map.pdf",
    description:
      "节点存材料，连线选上下文。追问从当前节点长出支线，不必沿着同一条聊天继续；有用的节点连到新问题，只带入这次需要的材料。",
  },
  {
    slug: "windows-computer-use-pro-v31",
    title: "Windows Computer Use Pro v3.1 — 76 KB 接管 Windows",
    year: "2026",
    date: "2026-11-27",
    source: "Bilibili · 异托思Sensrey",
    sourceUrl: "https://www.bilibili.com/video/BV1PU1FzzEpP",
    pdf: "/decks/windows-computer-use-pro-v31.pdf",
    description:
      "不换更贵的模型，而是换掉输入端：Win32 窗口枚举、UIA 控件树、Win11 离线 OCR 与私有剪贴板，替掉「每步截一张图、按像素猜坐标」。模型只负责决定，工具负责看清与执行。",
    links: [{ label: "网页版 · 12 页", href: "/labs/computer-use-pro/index.html" }],
  },
  {
    slug: "garry-tan-ai-agents",
    title: "AI 代理，两年内重塑一切 — YC 总裁 Garry Tan",
    year: "2026",
    date: "2026-11-11",
    source: "Bilibili · KrillinAI俊希",
    sourceUrl: "https://www.bilibili.com/video/BV1eexd6mEwU",
    pdf: "/decks/garry-tan-ai-agents.pdf",
    description:
      "Garry Tan 与 Walter Isaacson 的 36 分钟对谈：YC 如何在十分钟里看一个创始人、为什么 AI 代理不是功能而是新的操作系统，以及从 Palantir 到 YC 的二十年。",
  },
];

// The shelf reads in array order; sorting by slug means a deck lands
// alphabetically wherever it was appended, so batches do not need manual
// placement (and a mis-sorted insert cannot drift silently).
DECKS.sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0));

export function getDeck(slug: string | undefined): Deck | undefined {
  return DECKS.find((deck) => deck.slug === slug);
}
