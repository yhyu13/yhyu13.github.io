export type ManualId = "identity" | "craft" | "archive" | "decks";

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
    coverTitle: "Decks",
    subtitle: "Slides read aloud",
    footer: "YouTube · Bilibili · 躬行",
    coverColor: "#4f5b4a",
    coverInk: "#26301f",
    year: "2026",
    description:
      "Slide decks, mostly adapted from YouTube and Bilibili videos. Each opens in a reader you can page through and download as a PDF.",
    stepsLabel: "How to read this volume",
    steps: [
      {
        title: "Open a deck",
        body: "Each handbook is a PDF of the original slides. Arrow keys page through; select thumbnails to jump.",
      },
      {
        title: "Download to keep",
        body: "Every deck ships with its PDF as a standalone file. Save it, or read on the shelf.",
      },
    ],
    excerptLabel: "Source",
    excerpt: "Deck → PDF → download, no rebuild needed",
    reviewLabel: "Before you leave",
    review: "If a deck does not open on this shelf, it is not yet a deck.",
    actions: [{ label: "Browse decks", href: "/decks" }],
  },
];

export function getManual(id: string | undefined): Manual | undefined {
  return MANUALS.find((manual) => manual.id === id);
}
