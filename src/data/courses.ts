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
  /** one-line description for the shelf card */
  blurb?: string;
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
    blurb: "一门课的完整学习包：读学习站、下讲义、看带旁白的导览视频。",
    sections: [
      {
        kind: "site",
        label: "学习站",
        description:
          "17 个页面、251 张幻灯片：概念索引（143 条，逐条深链到讲它的那一页）、离线全文搜索（212 张幻灯片 + 433 页课程文本）、三条阅读路线。打开后是一个独立页面；固定视口的横屏排版，请在横屏窗口打开。",
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
    sections: [
      {
        kind: "decks",
        label: "讲义",
        description:
          "1 份 PowerPoint 讲义，107 页：104 页内容 + 课程封面 + 课程地图 + 全课总结，与 6 集视频同源。",
      },
      {
        kind: "videos",
        label: "视频",
        description:
          "6 段讲解视频，共 17 分 25 秒，1280×720，带旁白与可开关的中文字幕。视频存放在 GitHub Release，不在本站。",
      },
      {
        kind: "text",
        label: "文字",
        description:
          "三层文字：6 份页面笔记、6 份屏幕文字、6 份 SRT 字幕，共 18 份。",
      },
      {
        kind: "digest",
        label: "摘要",
        description:
          "两份摘要：全课 5 条结论与六模块地图；每个模块的 takeaway 与讲稿原句。",
      },
      {
        kind: "notice",
        label: "版权与出处",
        description:
          "材料版权归 University of Michigan 与 Coursera 所有；原课程视频与音频未收录，请访问官方课程页。",
      },
    ],
  },
];

export function getCourse(slug: string | undefined): Course | undefined {
  return COURSES.find((course) => course.slug === slug);
}
