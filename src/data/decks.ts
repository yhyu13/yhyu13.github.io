export type Deck = {
  slug: string;
  title: string;
  year: string;
  date: string;
  source?: string;
  sourceUrl?: string;
  pdf: string; // "/decks/<slug>.pdf"
  description: string;
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
