export type CourseSectionKind =
  | "site"
  | "decks"
  | "videos"
  | "text"
  | "digest"
  | "notice";

export type CourseAsset = {
  label: string;
  href: string;
  meta?: string;
  external?: boolean;
  poster?: string;
};

export type CourseSection = {
  kind: CourseSectionKind;
  label: string;
  description: string;
  /** Groups of assets, e.g. one for "page notes" and one for "slide texts". */
  groups?: { label: string; assets: CourseAsset[] }[];
};

export type Course = {
  slug: string;
  title: string;
  titleEn: string;
  term: string;
  institution: string;
  instructor: string;
  sourceUrl: string;
  licence: string;
  color?: string;
  sections: CourseSection[];
};

export const COURSES: Course[] = [
  {
    slug: "cs2680",
    title: "CS2680 · Modern AI Systems",
    titleEn: "Modern AI Systems: Agents and System Optimizations",
    term: "Fall 2026",
    institution: "Harvard SEAS",
    instructor: "Juncheng Yang",
    sourceUrl: "https://cs2680.seas.harvard.edu/",
    licence:
      "课程材料版权归 Harvard SEAS 与授课教师所有；本站仅供个人学习，课件为学习整理，未获授权再分发。",
    color: "#3f5b63",
    sections: [
      {
        kind: "site",
        label: "学习站",
        description:
          "17 个页面、251 张幻灯片：概念索引（143 条，逐条深链到讲它的那一页）、离线全文搜索（212 张幻灯片 + 433 页课程文本）、三条阅读路线。打开后是一个独立页面。",
        groups: [
          {
            label: "入口",
            assets: [
              { label: "读 · 三条阅读路线", href: "/courses/cs2680/files/study/index.html" },
              { label: "概念索引", href: "/courses/cs2680/files/study/concepts.html" },
              { label: "全文搜索", href: "/courses/cs2680/files/study/search.html" },
            ],
          },
        ],
      },
      {
        kind: "decks",
        label: "讲义",
        description: "10 份 PowerPoint 讲义，共 125 张幻灯片；每份非封面页带页码徽章与来源标注。",
      },
      {
        kind: "videos",
        label: "视频",
        description:
          "10 段导览视频（9 段按讲义各一段，外加 1 段垂直栈主线），共 14 分 42 秒。每段带 Edge TTS 旁白、浏览器渲染字幕与程序生成的背景音乐。",
      },
      {
        kind: "text",
        label: "文字",
        description:
          "课程的完整文字层：27 份公开页面的 Markdown 笔记，9 份讲义 PDF 的逐页文本。",
      },
      {
        kind: "digest",
        label: "摘要",
        description:
          "三份策展摘要，是三套课件共同的唯一输入；每个数字都能追到具体来源页码。",
      },
      {
        kind: "notice",
        label: "版权与出处",
        description:
          "材料版权归 Harvard SEAS 与授课教师所有。请优先访问官方地址。",
      },
    ],
  },
];

export function getCourse(slug: string | undefined): Course | undefined {
  return COURSES.find((course) => course.slug === slug);
}
