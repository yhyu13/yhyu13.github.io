export type ManualId = "identity" | "craft" | "archive" | "decks" | "courses";

export type ManualStep = {
  title: string;
  body: string;
};

export type ManualAction = {
  label: string;
  href: string;
  external?: boolean;
};

export type Manual = {
  id: ManualId;
  kicker: string;
  coverTitle: string;
  subtitle: string;
  footer: string;
  coverColor: string;
  coverInk: string;
  year: string;
  description: string;
  stepsLabel: string;
  steps: ManualStep[];
  excerptLabel: string;
  excerpt: string;
  reviewLabel: string;
  review: string;
  actions: ManualAction[];
  photo?: string;
};

export const ZHIHU = "https://www.zhihu.com/people/ao-ta-kang-007";
export const BILIBILI = "https://space.bilibili.com/1526329479";

export const MANUALS: Manual[] = [
  {
    id: "identity",
    kicker: "Field Manual · I",
    coverTitle: "Hang Yu",
    subtitle: "躬行",
    footer: "Person · Links · Site",
    coverColor: "#363126",
    coverInk: "#31291e",
    year: "2026",
    description:
      "Hang (Yohan) Yu. This library is the public desk: who I am, where I write, and the 2017 notes I still keep.",
    stepsLabel: "How to read this volume",
    steps: [
      {
        title: "Name the person",
        body: "Hang (Yohan) Yu. The motto on the cover is the whole method: 纸上得来终觉浅，绝知此事要躬行.",
      },
      {
        title: "Point to the public desks",
        body: "Zhihu and Bilibili are the live writing and teaching rooms. This site is the shelf, not a feed.",
      },
      {
        title: "Open a volume",
        body: "Craft is how the work is done in public. Archive is the 2017 field notes that remain.",
      },
    ],
    excerptLabel: "Motto",
    excerpt: "纸上得来终觉浅，绝知此事要躬行",
    reviewLabel: "Before you leave",
    review:
      "If a link does not open a real desk — Zhihu, Bilibili, or a volume on this shelf — it does not belong on this cover.",
    actions: [
      { label: "Zhihu", href: ZHIHU, external: true },
      { label: "Bilibili", href: BILIBILI, external: true },
    ],
    photo: "/uploads/me.jpg",
  },
  {
    id: "craft",
    kicker: "Field Manual · II",
    coverTitle: "Craft",
    subtitle: "Writing · Teaching",
    footer: "Zhihu · Bilibili · 躬行",
    coverColor: "#945a3e",
    coverInk: "#4b281a",
    year: "2026",
    description:
      "The craft is writing and teaching in public. Zhihu and Bilibili are the desks. Reading is shallow until the work is done by hand.",
    stepsLabel: "How to read this volume",
    steps: [
      {
        title: "Start from a real question",
        body: "Pick a problem that still resists a clean answer. Do not start from a blank template.",
      },
      {
        title: "Write the argument",
        body: "Put the claim where a reader can check it. Keep the evidence next to the sentence that needs it.",
      },
      {
        title: "Teach it in public",
        body: "Zhihu and Bilibili are the rooms. A note that never leaves the draft folder is not craft on this shelf.",
      },
      {
        title: "Keep the loop visible",
        body: "The motto is the review: 躬行. If the work was only read, it is not finished.",
      },
    ],
    excerptLabel: "First note",
    excerpt: "纸上得来终觉浅，绝知此事要躬行",
    reviewLabel: "Before you publish",
    review: "A note that never leaves the draft folder is not craft on this shelf.",
    actions: [
      { label: "Zhihu", href: ZHIHU, external: true },
      { label: "Bilibili", href: BILIBILI, external: true },
    ],
  },
  {
    id: "archive",
    kicker: "Field Manual · III",
    coverTitle: "Archive",
    subtitle: "2017 Notes",
    footer: "Capsule · Rainbow",
    coverColor: "#566044",
    coverInk: "#293024",
    year: "2017",
    description:
      "Two 2017 field notes. A reproducibility report on Matrix Capsules with EM routing, and a review of DeepMind Rainbow. The Hexo Hello World post is omitted.",
    stepsLabel: "How to read this volume",
    steps: [
      {
        title: "Matrix Capsule with EM Routing",
        body: "2017-12-17. Hang Yu and Suofei Zhang. A capsule takes a tensor and outputs a pose; routing by agreement is the unsupervised walk between layers. Open the full report.",
      },
      {
        title: "DeepMind Rainbow: Review",
        body: "2017-12-16. Six DQN extensions stacked. The note’s claim: for a value-based method, having a better target to learn is generally more effective than learning the target better.",
      },
    ],
    excerptLabel: "Period notes",
    excerpt: "Capsule: tensor in, pose out. Rainbow: six DQN extensions. Open the reports below.",
    reviewLabel: "Before you leave",
    review:
      "These are period notes, not a claim that the 2017 numbers still lead the field. Read the reports; do not treat the shelf cards as the papers.",
    actions: [
      { label: "Open Capsule", href: "/archive/capsule" },
      { label: "Open Rainbow", href: "/archive/rainbow" },
    ],
  },
  {
    id: "decks",
    kicker: "Field Manual · IV",
    coverTitle: "Video Slides",
    subtitle: "Slides read aloud",
    footer: "YouTube · Bilibili · 躬行",
    coverColor: "#4f5b4a",
    coverInk: "#26301f",
    year: "2026",
    description:
      "Beloved video collections from YouTube and Bilibili, as readable slides. Each opens in a reader, links back to the original, and downloads as a PDF.",
    stepsLabel: "How to read this volume",
    steps: [
      {
        title: "Open a video's slides",
        body: "Each entry is a PDF of a video's slides. Arrow keys page through; select thumbnails to jump.",
      },
      {
        title: "Watch or download",
        body: "Follow the link to the original video, or download the PDF to keep.",
      },
    ],
    excerptLabel: "Source",
    excerpt: "Video → PDF → download, no rebuild needed",
    reviewLabel: "Before you leave",
    review: "If a video's slides do not open on this shelf, they are not here yet.",
    actions: [{ label: "Browse video slides", href: "/decks" }],
  },
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
];

export function getManual(id: string | undefined): Manual | undefined {
  return MANUALS.find((manual) => manual.id === id);
}
