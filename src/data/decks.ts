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
    title: "Huberman × Joe Lonsdale — 如何加速学习",
    year: "",
    date: "",
    source: "Bilibili · Andrew Huberman",
    sourceUrl: "https://www.bilibili.com/video/BV114YX63Ene",
    pdf: "/decks/huberman-accelerated-learning.pdf",
    description:
      "14 页拆 Alpha School 的学习法：每天两小时学术时间怎么做到十倍效率，Worked Example + 初始掌握 + 间隔重复三件套，以及 AI 在其中的位置。",
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
];

export function getDeck(slug: string | undefined): Deck | undefined {
  return DECKS.find((deck) => deck.slug === slug);
}
