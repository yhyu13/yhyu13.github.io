import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QrShare, QrTrigger } from "../components/QrShare";
import {
  getCourse,
  type Course,
  type CourseSection,
  type CourseAsset,
} from "../data/courses";

type ManifestAsset = {
  label: string;
  href: string;
  bytes?: number;
  slides?: number | null;
  meta?: string;
  poster?: string;
  desc?: string;
  scope?: string;
  group?: string;
};

type Manifest = {
  groups: Record<string, ManifestAsset[] | undefined>;
  notice?: string;
};

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

const TEXT_GROUPS: [string, string][] = [
  ["notes", "页面笔记"],
  ["slides", "讲义逐页文本"],
  ["transcript", "字幕 SRT"],
];

const TEXT_GROUP_LABELS: Record<string, string> = Object.fromEntries(TEXT_GROUPS);

function human(bytes?: number) {
  if (bytes == null) return "";
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

export function CoursePage() {
  const { slug } = useParams();
  const course = slug ? getCourse(slug) : undefined;
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [error, setError] = useState("");
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    if (!course) return;
    let cancelled = false;
    fetch(`/courses/${course.slug}/files/manifest.json`)
      .then((r) => {
        if (!r.ok) throw new Error("manifest missing");
        return r.json();
      })
      .then((data: Manifest) => {
        if (!cancelled) setManifest(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load this course's file list.");
      });
    return () => {
      cancelled = true;
    };
  }, [course]);

  useEffect(() => {
    document.title = course ? `${course.title} · Hang Yu` : "Hang Yu";
    document.body.dataset.mode = "gallery";
    document.body.dataset.menu = "closed";
    return () => {
      document.title = "Hang Yu";
    };
  }, [course]);

  if (!course) {
    // An unknown slug renders the page shell with an honest message, like
    // DeckReader does for an unknown deck — never a blank page.
    return (
      <article className="article-page course-page">
        <div className="article-toolbar">
          <Link className="article-back" to="/courses">
            ← Courses
          </Link>
        </div>
        <div className="article-inner">
          <h1>Unknown course.</h1>
        </div>
      </article>
    );
  }

  return (
    <article className="article-page course-page">
      <div className="article-toolbar">
        <Link className="article-back" to="/courses">
          ← Courses
        </Link>
        <QrTrigger onClick={() => setQrOpen(true)} />
      </div>
      <div className="article-inner">
        <p className="article-kicker">
          {course.term} · {course.institution}
        </p>
        <h1>{course.title}</h1>
        <p className="article-meta">
          {course.titleEn} · {course.instructor} ·{" "}
          <a href={course.sourceUrl} target="_blank" rel="noopener noreferrer">
            官方课程页
          </a>
        </p>
        {error ? (
          <div className="course-manifest-error">
            <p className="qr-error">{error}</p>
            <p>
              <a href={`/courses/${course.slug}/files/text.html`}>浏览课程文件目录</a>
              {" · "}
              <Link to="/courses">返回 Courses</Link>
            </p>
          </div>
        ) : null}
        {course.sections.map((section) => (
          <section key={section.kind} className="course-section">
            {/* a real heading per section: the page is a document, and the
                label paragraphs would leave it a single bare H1 */}
            <h2 className="doc-label">{section.label}</h2>
            <p className="detail-description">{section.description}</p>
            <CourseSectionBody section={section} course={course} manifest={manifest} />
          </section>
        ))}
        <p className="article-tags">
          <span># 课程归档</span>
          <span># {course.term}</span>
        </p>
      </div>
      <QrShare open={qrOpen} onClose={() => setQrOpen(false)} />
    </article>
  );
}

function CourseSectionBody({
  section,
  course,
  manifest,
}: {
  section: CourseSection;
  course: Course;
  manifest: Manifest | null;
}) {
  const assets = manifest?.groups[section.kind];

  switch (section.kind) {
    case "site":
      return (
        <ul className="course-asset-list">
          {(section.groups ?? []).flatMap((group) =>
            group.assets.map((asset) => (
              <SiteEntry key={asset.href} asset={asset} />
            )),
          )}
        </ul>
      );
    case "decks":
      if (!assets) return <ManifestPending error={!manifest} />;
      return (
        <ul className="course-asset-list">
          {assets.map((asset) => (
            <li key={asset.href} className="course-asset">
              <a href={fileHref(course.slug, asset.href)} download>
                {asset.label}
              </a>
              <span className="course-asset-meta">
                {asset.slides != null ? `${asset.slides} 页` : ""}
                {asset.slides != null && asset.bytes != null ? " · " : ""}
                {human(asset.bytes)}
              </span>
            </li>
          ))}
        </ul>
      );
    case "videos":
      if (!assets) return <ManifestPending error={!manifest} />;
      return (
        <ul className="course-asset-list">
          {assets.map((asset) => (
            <li key={asset.href} className="course-asset course-asset-video">
              {asset.poster ? (
                <img
                  className="course-asset-poster"
                  src={fileHref(course.slug, asset.poster)}
                  alt={`${asset.label} 的画面索引（${asset.meta ?? ""}）`}
                  loading="lazy"
                  width={320}
                />
              ) : null}
              <div className="course-asset-copy">
                <span className="course-asset-label">{asset.label}</span>
                {asset.desc ? <span className="course-asset-desc">{asset.desc}</span> : null}
                {asset.meta ? <span className="course-asset-meta">{asset.meta}</span> : null}
                {isExternal(asset.href) ? (
                  <a
                    href={asset.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="course-asset-link"
                  >
                    下载视频（GitHub Release）
                  </a>
                ) : (
                  <span className="course-asset-meta">视频暂未提供下载</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      );
    case "text": {
      if (!assets) return <ManifestPending error={!manifest} />;
      // Groups are data, not a fixed pair: CS2680 has notes + slides, the
      // networking course adds transcript. Keep the two original labels so
      // the CS2680 page does not change.
      const groups = new Map<string, ManifestAsset[]>();
      for (const asset of assets) {
        const key = asset.group ?? "other";
        groups.set(key, [...(groups.get(key) ?? []), asset]);
      }
      const known = TEXT_GROUPS.map(([key]) => key);
      const order = [
        ...known,
        ...[...groups.keys()].filter((key) => !known.includes(key)),
      ];
      return (
        <>
          {order
            .filter((key) => groups.has(key))
            .map((key) => (
              <AssetGroup
                key={key}
                slug={course.slug}
                label={`${TEXT_GROUP_LABELS[key] ?? "其他"}（${groups.get(key)?.length ?? 0}）`}
                assets={groups.get(key) ?? []}
              />
            ))}
        </>
      );
    }
    case "digest":
      if (!assets) return <ManifestPending error={!manifest} />;
      return (
        <ul className="course-asset-list">
          {assets.map((asset) => (
            <li key={asset.href} className="course-asset">
              <a href={fileHref(course.slug, asset.href)} target="_blank" rel="noopener noreferrer">
                {asset.label}
              </a>
              <span className="course-asset-meta">
                {asset.scope ? `${asset.scope} · ` : ""}
                {human(asset.bytes)}
              </span>
            </li>
          ))}
        </ul>
      );
    case "notice":
      return (
        <div className="course-notice">
          <p>{course.licence}</p>
          <p>
            官方课程页：<a href={course.sourceUrl} target="_blank" rel="noopener noreferrer">{course.sourceUrl}</a>
            {" · "}
            <a href={`/courses/${course.slug}/files/NOTICE.txt`} target="_blank" rel="noopener noreferrer">
              NOTICE.txt
            </a>
          </p>
        </div>
      );
    default:
      return null;
  }
}

function SiteEntry({ asset }: { asset: CourseAsset }) {
  return (
    <li className="course-asset">
      <a href={asset.href} target="_blank" rel="noopener noreferrer" className="pill">
        {asset.label}
      </a>
    </li>
  );
}

function AssetGroup({
  slug,
  label,
  assets,
}: {
  slug: string;
  label: string;
  assets: ManifestAsset[];
}) {
  if (assets.length === 0) return null;
  return (
    <div className="course-asset-group">
      <p className="course-asset-group-label">{label}</p>
      <ul className="course-asset-list">
        {assets.map((asset) => (
          <li key={asset.href} className="course-asset">
            <a href={fileHref(slug, asset.href)} target="_blank" rel="noopener noreferrer">
              {asset.label}
            </a>
            <span className="course-asset-meta">{human(asset.bytes)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ManifestPending({ error }: { error: boolean }) {
  return (
    <p className="course-asset-meta">
      {error ? "文件清单不可用，可从上方链接浏览课程文件。" : "正在载入文件清单…"}
    </p>
  );
}

function fileHref(slug: string, href: string) {
  return `/courses/${slug}/files/${href}`;
}
