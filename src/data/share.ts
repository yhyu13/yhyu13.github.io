import { ARCHIVE_POSTS } from "./archivePosts";
import { COURSES } from "./courses";
import { CRAFT_WORKS } from "./craft";
import { DECKS } from "./decks";
import { MANUALS } from "./manuals";

/**
 * One inventory of everything the site can be linked to, with the text that
 * should travel with the link. Consumed twice:
 *
 *   - the app, to build a share message (title + blurb + URL);
 *   - `scripts/gen-share-pages.mjs`, to write a static HTML shell per route so
 *     crawlers (WeChat, Slack, Twitter, iMessage) see real Open Graph tags
 *     instead of the generic single-page shell.
 *
 * Keep this module dependency-free: it is bundled with esbuild at build time.
 */

export type ShareEntry = {
  /** Site path, no trailing slash: "/decks/bci-industry-survey". */
  path: string;
  title: string;
  description: string;
  /** Absolute image URL for og:image; empty falls back to the site card. */
  image?: string;
  /** Grouping used in the index and in error messages. */
  kind: "deck" | "course" | "work" | "note" | "volume" | "index";
};

export const SITE = "https://yhyu13.github.io";

/** Trim a blurb so it reads as a share card, not a paragraph. */
const blurb = (value: string, max = 150) => {
  const flat = value.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  const stop = Math.max(cut.lastIndexOf("。"), cut.lastIndexOf("，"), cut.lastIndexOf(". "), cut.lastIndexOf(";"));
  return `${(stop > max * 0.6 ? cut.slice(0, stop + 1) : cut).trim()}…`;
};

const deckEntries: ShareEntry[] = DECKS.map((deck) => ({
  path: `/decks/${deck.slug}`,
  title: deck.title,
  description: blurb(deck.description),
  image: `${SITE}/og/deck-${deck.slug}.jpg`,
  kind: "deck",
}));

const courseEntries: ShareEntry[] = COURSES.map((course) => ({
  path: `/courses/${course.slug}`,
  title: course.title,
  description: blurb(course.blurb ?? course.sections[0]?.description ?? ""),
  image: `${SITE}/og/course-${course.slug}.jpg`,
  kind: "course",
}));

const workEntries: ShareEntry[] = CRAFT_WORKS.map((work) => ({
  path: work.href.replace(/\/index\.html$/, ""),
  title: work.title,
  description: blurb(work.description),
  image: `${SITE}/og/work-${work.id}.jpg`,
  kind: "work",
}));

const noteEntries: ShareEntry[] = ARCHIVE_POSTS.map((post) => ({
  path: `/archive/${post.slug}`,
  title: post.title,
  description: blurb(`Field Notes · ${post.date}${post.tags.length ? ` · ${post.tags.join(" / ")}` : ""}`),
  image: `${SITE}/og/note-${post.slug}.jpg`,
  kind: "note",
}));

const volumeDescriptions: Record<string, string> = {
  identity: "Hang Yu 的自我介绍与公开渠道：这个人在写什么、在哪里写。",
  craft: "写作与教学：GitHub、Gitee、知乎、B 站，加上九个可当场打开的作品。",
  archive: "2017 年的两份复现笔记，与 2026 年的六篇研究长文。",
  decks: "64 份视频讲义：每份都能翻页读、下载 PDF。",
  courses: "三门课的完整学习包：讲义、讲解视频、逐字转写。",
};

const manualEntries: ShareEntry[] = MANUALS.map((manual) => ({
  path: manual.id === "identity" ? "/identity" : `/${manual.id}`,
  title: `${manual.coverTitle} · ${manual.subtitle}`,
  description: volumeDescriptions[manual.id] ?? manual.description,
  image: `${SITE}/og/volume-${manual.id}.jpg`,
  kind: "volume",
}));

export const SHARE_ENTRIES: ShareEntry[] = [
  {
    path: "/browse",
    title: "Everything on this site",
    description: `一处索引：${DECKS.length} 个 deck、${COURSES.length} 门课、${CRAFT_WORKS.length} 个作品、${ARCHIVE_POSTS.length} 篇长文，可搜索。`,
    image: `${SITE}/og/index.jpg`,
    kind: "index",
  },
  ...manualEntries,
  ...deckEntries,
  ...courseEntries,
  ...workEntries,
  ...noteEntries,
];

export function getShareEntry(path: string): ShareEntry | undefined {
  const clean = path.split("#")[0].split("?")[0].replace(/\/+$/, "") || "/";
  return SHARE_ENTRIES.find((entry) => entry.path === clean);
}

/**
 * The text that goes out with the link. Three lines at most: what it is, why
 * it is worth opening, then the URL — that is what reads well pasted into a
 * chat, not a bare URL.
 */
export function shareMessage(entry: ShareEntry, url = SITE + entry.path) {
  return [entry.title, entry.description, url].filter(Boolean).join("\n");
}
