import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BILIBILI_PROFILE,
  BILIBILI_STATS,
  GITEE_PROFILE,
  GITEE_STATS,
  GITHUB_PROFILE,
  GITHUB_STATS,
  type PlatformStats,
  ZHIHU_PROFILE,
  ZHIHU_STATS,
} from "../data/craft";
import type { Manual } from "../data/manuals";
import { CraftShowcase, formatDate } from "./CraftShowcase";

type Tab = "overview" | "showcase";

export function CraftPanel({ manual }: { manual: Manual }) {
  const [tab, setTab] = useState<Tab>("overview");
  const scrollRef = useRef<HTMLDivElement>(null);

  // The overview is the only scrollable region; let the wheel work even when
  // the pointer sits over the selected book or empty space (mirrors DeckShelf).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.target instanceof Node && el.contains(e.target)) return;
      if (el.scrollHeight <= el.clientHeight) return;
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
        el.scrollTop += e.deltaY;
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // New tab, top of the list.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [tab]);

  return (
    <section className="craft-shelf" aria-label={`${manual.coverTitle} showcase`}>
      <div className="craft-shelf-head">
        <h2 className="detail-title">{manual.coverTitle}</h2>
        <div className="craft-tabs" role="tablist" aria-label="Craft views">
          <button
            className={`craft-tab${tab === "overview" ? " active" : ""}`}
            role="tab"
            aria-selected={tab === "overview"}
            type="button"
            onClick={() => setTab("overview")}
          >
            Overview
          </button>
          <button
            className={`craft-tab${tab === "showcase" ? " active" : ""}`}
            role="tab"
            aria-selected={tab === "showcase"}
            type="button"
            onClick={() => setTab("showcase")}
          >
            Showcase
          </button>
        </div>
      </div>

      <div
        className="craft-shelf-scroll"
        ref={scrollRef}
        tabIndex={0}
        aria-label={`${manual.coverTitle} ${tab}`}
      >
        {tab === "overview" ? (
          <CraftOverview manual={manual} />
        ) : (
          <div className="craft-tab-panel">
            <p className="detail-description craft-lede">
              A rotating showcase of AI projects, repos, articles, and videos. Use Refresh or Auto to shuffle cards.
            </p>
            <CraftShowcase />
          </div>
        )}
      </div>

      <div className="craft-shelf-foot">
        <div className="meta-row" aria-label="Field edition and publication year">
          <div className="stars" aria-label="Field edition">
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
            <span>✦</span>
            <span className="dim">◇</span>
          </div>
          <span className="meta-divider" aria-hidden="true" />
          <span className="review-source">Field Notes</span>
          <span className="year">{manual.year}</span>
        </div>
        <hr className="detail-rule" />
        <div className="action-rail" aria-label="Field manual actions">
          {manual.actions.map((action) =>
            action.external ? (
              <a
                key={action.label}
                className="pill"
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {action.label}
              </a>
            ) : (
              <Link key={action.label} className="pill" to={action.href}>
                {action.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function CraftOverview({ manual }: { manual: Manual }) {
  return (
    <div className="craft-tab-panel">
      <p className="detail-description craft-lede">{manual.description}</p>

      <section className="craft-stats-board">
        <h3 className="craft-stats-heading">Platform pulse</h3>
        <div className="craft-stats-grid">
          <StatCard platform="github" label="GitHub" href={GITHUB_PROFILE} stats={GITHUB_STATS} />
          <StatCard platform="gitee" label="Gitee" href={GITEE_PROFILE} stats={GITEE_STATS} />
          <StatCard platform="zhihu" label="Zhihu" href={ZHIHU_PROFILE} stats={ZHIHU_STATS} />
          <StatCard platform="bilibili" label="Bilibili" href={BILIBILI_PROFILE} stats={BILIBILI_STATS} />
        </div>
      </section>

      {GITHUB_STATS.chartUrl ? (
        <section className="craft-contrib">
          <h3 className="craft-stats-heading">GitHub · contribution density</h3>
          <a
            className="craft-contrib-frame"
            href={GITHUB_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open GitHub profile"
          >
            <img
              className="craft-contrib-chart"
              src={GITHUB_STATS.chartUrl}
              alt="GitHub contribution activity graph"
              loading="lazy"
            />
          </a>
        </section>
      ) : null}

      <section className="doc-section">
        <p className="doc-label">{manual.stepsLabel}</p>
        <ol className="doc-steps">
          {manual.steps.map((step) => (
            <li key={step.title}>
              <span className="doc-step-copy">
                <strong>{step.title}</strong>
                <span>{step.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
      <section className="doc-section">
        <p className="doc-label">{manual.excerptLabel}</p>
        <div className="prompt-block">
          <code>{manual.excerpt}</code>
        </div>
      </section>
      <section className="doc-section">
        <p className="doc-label">{manual.reviewLabel}</p>
        <p className="doc-review">{manual.review}</p>
      </section>
    </div>
  );
}

const STAT_COLORS = {
  github: "#945a3e",
  gitee: "#c71d23",
  zhihu: "#0066ff",
  bilibili: "#00a1d6",
} as const;

function StatCard({
  platform,
  label,
  href,
  stats,
}: {
  platform: keyof typeof STAT_COLORS;
  label: string;
  href: string;
  stats: PlatformStats;
}) {
  return (
    <a
      className="craft-stat-card"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ["--stat-color" as string]: STAT_COLORS[platform] }}
    >
      <div className="craft-stat-header">
        <span className="craft-stat-platform">{label}</span>
      </div>
      <div className="craft-stat-numbers">
        {stats.publicRepos ? <StatNumber value={stats.publicRepos} unit="public repos" /> : null}
        {stats.followers ? <StatNumber value={stats.followers} unit="followers" /> : null}
        {stats.following ? <StatNumber value={stats.following} unit="following" /> : null}
        {stats.articles ? <StatNumber value={stats.articles} unit="articles" /> : null}
        {stats.answers ? <StatNumber value={stats.answers} unit="answers" /> : null}
        {stats.upvotes ? <StatNumber value={stats.upvotes} unit="upvotes" /> : null}
        {stats.videos ? <StatNumber value={stats.videos} unit="videos" /> : null}
        {stats.likes ? <StatNumber value={stats.likes} unit="likes" /> : null}
        {stats.joinedAt ? (
          <div className="craft-stat-number">
            <span className="craft-stat-value">{formatDate(stats.joinedAt)}</span>
            <span className="craft-stat-unit">joined</span>
          </div>
        ) : null}
      </div>
      {stats.flavor ? <p className="craft-stat-flavor">{stats.flavor}</p> : null}
    </a>
  );
}

function StatNumber({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="craft-stat-number">
      <span className="craft-stat-value">{value}</span>
      <span className="craft-stat-unit">{unit}</span>
    </div>
  );
}
