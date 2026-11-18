import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ARCHIVE_POSTS } from "../data/archivePosts";
import { COURSES } from "../data/courses";
import { CRAFT_WORKS } from "../data/craft";
import { DECKS } from "../data/decks";

type Kind = "deck" | "course" | "work" | "note";

type Entry = {
  key: string;
  kind: Kind;
  title: string;
  meta: string;
  description: string;
  href: string;
  /** true when the target is a static page under /labs/, not an SPA route */
  static?: boolean;
  haystack: string;
};

/** Slugs and paths are searchable too ("wuxia", "mit-14-13"); fold them into words. */
const slugWords = (value: string) =>
  value
    .replace(/^https?:\/\/[^/]+/, "")
    .replace(/[\/_.-]+/g, " ")
    .trim()
    .toLowerCase();

const KIND_LABEL: Record<Kind, string> = {
  deck: "Deck",
  course: "Course",
  work: "Work",
  note: "Note",
};

const KIND_PLURAL: Record<Kind, string> = {
  deck: "decks",
  course: "courses",
  work: "works",
  note: "notes",
};

/** Every published thing on the site, flattened into one list. */
const ENTRIES: Entry[] = [
  ...DECKS.map((deck) => ({
    key: `deck:${deck.slug}`,
    kind: "deck" as const,
    title: deck.title,
    meta: [deck.date, deck.source].filter(Boolean).join(" · "),
    description: deck.description,
    href: `/decks/${deck.slug}`,
    haystack: [deck.title, deck.description, deck.source, deck.date, deck.year, slugWords(deck.slug)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  })),
  ...COURSES.map((course) => ({
    key: `course:${course.slug}`,
    kind: "course" as const,
    title: course.title,
    meta: [course.term, course.institution, course.instructor].filter(Boolean).join(" · "),
    description: course.blurb ?? course.sections[0]?.description ?? "",
    href: `/courses/${course.slug}`,
    haystack: [
      course.title,
      course.titleEn,
      course.blurb,
      course.institution,
      course.instructor,
      course.term,
      slugWords(course.slug),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  })),
  ...CRAFT_WORKS.map((work) => ({
    key: `work:${work.id}`,
    kind: "work" as const,
    title: work.title,
    meta: [work.kind, work.meta].filter(Boolean).join(" · "),
    description: work.description,
    href: work.href,
    static: work.href.startsWith("/labs/"),
    haystack: [work.title, work.kind, work.description, work.meta, ...(work.tags ?? []), slugWords(work.id), slugWords(work.href)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  })),
  ...ARCHIVE_POSTS.map((post) => ({
    key: `note:${post.slug}`,
    kind: "note" as const,
    title: post.title,
    meta: [post.date, post.authors].filter(Boolean).join(" · "),
    description: post.tags.map((t) => `# ${t}`).join(" "),
    href: `/archive/${post.slug}`,
    haystack: [post.title, post.date, post.authors, ...post.tags, slugWords(post.slug)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  })),
];

const TOTAL = ENTRIES.length;
const COUNT: Record<Kind, number> = {
  deck: ENTRIES.filter((e) => e.kind === "deck").length,
  course: ENTRIES.filter((e) => e.kind === "course").length,
  work: ENTRIES.filter((e) => e.kind === "work").length,
  note: ENTRIES.filter((e) => e.kind === "note").length,
};

type Filter = "all" | Kind;
const FILTERS: Filter[] = ["all", "deck", "course", "work", "note"];

function score(entry: Entry, needle: string) {
  if (!needle) return 0;
  const title = entry.title.toLowerCase();
  if (title.startsWith(needle)) return 3;
  if (title.includes(needle)) return 2;
  return entry.haystack.includes(needle) ? 1 : -1;
}

export function BrowsePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    return q ?? "";
  });
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const needle = query.trim().toLowerCase();

  const results = useMemo(() => {
    const pool = filter === "all" ? ENTRIES : ENTRIES.filter((e) => e.kind === filter);
    if (!needle) return pool;
    return pool
      .map((entry) => ({ entry, s: score(entry, needle) }))
      .filter((row) => row.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((row) => row.entry);
  }, [needle, filter]);

  useEffect(() => {
    document.title = "Index · Hang Yu";
    return () => {
      document.title = "Hang Yu";
    };
  }, []);

  useEffect(() => {
    setActive(0);
  }, [needle, filter]);

  // `/` or ⌘K focuses the field, the way every index page should behave.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      if (!typing && (event.key === "/" || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k"))) {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Keep the highlighted row in view while arrowing through the list.
  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelectorAll<HTMLElement>(".browse-row")[active];
    row?.scrollIntoView({ block: "nearest" });
  }, [active, results]);

  const open = (entry: Entry) => {
    // A static page under /labs/ is outside the router; a full load is correct.
    if (entry.static) window.location.assign(entry.href);
    else navigate(entry.href);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (event.key === "Enter") {
      const entry = results[active];
      if (entry) open(entry);
    } else if (event.key === "Escape") {
      if (query) setQuery("");
      else navigate("/");
    }
  };

  return (
    <main className="browse">
      <header className="browse-top">
        <Link className="brand" to="/" aria-label="Hang Yu home">
          Hang Yu
        </Link>
        <div className="browse-top-actions">
          <Link className="browse-close" to="/" aria-label="Back to the collection">
            ×
          </Link>
        </div>
      </header>

      <div className="browse-inner">
        <p className="browse-kicker">Field Manual · Index</p>
        <h1 className="browse-title">Everything on this site</h1>
        <p className="browse-lede">
          {TOTAL} 项：{COUNT.deck} 个 deck、{COUNT.course} 门课、{COUNT.work} 个作品、{COUNT.note} 篇长文。
          按标题、来源、分类、简介或路径搜。
        </p>

        <div className="browse-bar">
          <label className="browse-search">
            <span aria-hidden="true">⌕</span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              placeholder="搜索 deck / 课程 / 作品 / 长文…"
              aria-label="Search everything on this site"
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <kbd className="browse-kbd" aria-hidden="true">/</kbd>
          </label>
        </div>

        <div className="browse-filters" role="group" aria-label="Filter by kind">
          {FILTERS.map((f) => {
            const label = f === "all" ? "All" : KIND_LABEL[f];
            const count = f === "all" ? TOTAL : COUNT[f];
            return (
              <button
                key={f}
                type="button"
                className="browse-chip"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {label} <span>{count}</span>
              </button>
            );
          })}
        </div>

        <p className="browse-count" aria-live="polite">
          {results.length} 项{needle ? ` · “${query.trim()}”` : ""}
          {results.length ? " · ↑↓ 选择，回车打开" : ""}
        </p>

        {results.length === 0 ? (
          <p className="browse-empty">
            没有匹配的条目。试试更短的关键词，或者点 <button type="button" onClick={() => { setQuery(""); setFilter("all"); }}>清空</button>。
          </p>
        ) : (
          <ul className="browse-list" ref={listRef}>
            {results.map((entry, index) => (
              <li key={entry.key}>
                <RowLink
                  entry={entry}
                  active={index === active}
                  onActivate={() => setActive(index)}
                >
                  <span className={`browse-kind browse-kind-${entry.kind}`}>{KIND_LABEL[entry.kind]}</span>
                  <span className="browse-body">
                    <span className="browse-row-title">{entry.title}</span>
                    {entry.meta ? <span className="browse-row-meta">{entry.meta}</span> : null}
                    {entry.description ? (
                      <span className="browse-row-desc">{entry.description}</span>
                    ) : null}
                  </span>
                </RowLink>
              </li>
            ))}
          </ul>
        )}

        <p className="browse-foot">
          这不是搜索引擎：只索引本站已发布的 {TOTAL} 项。{COUNT.deck} 个 deck 的 PDF 都在{" "}
          <Link to="/decks">Video Slides</Link>，{COUNT.course} 门课的讲义在 <Link to="/courses">Courses</Link>，
          作品在 <Link to="/craft">Craft</Link>，长文在 <Link to="/archive">Archive</Link>。
        </p>
      </div>
    </main>
  );
}

/** Rows point at SPA routes (Link) or static lab pages (plain anchor). */
function RowLink({
  entry,
  active,
  onActivate,
  children,
}: {
  entry: Entry;
  active: boolean;
  onActivate: () => void;
  children: React.ReactNode;
}) {
  const props = {
    className: "browse-row",
    "data-active": active,
    onMouseEnter: onActivate,
    onFocus: onActivate,
  } as const;
  if (entry.static) {
    return (
      <a href={entry.href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link to={entry.href} {...props}>
      {children}
    </Link>
  );
}

export const BROWSE_KIND_PLURAL = KIND_PLURAL;
