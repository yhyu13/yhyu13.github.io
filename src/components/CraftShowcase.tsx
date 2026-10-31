import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CARDS_PER_SECTION,
  CRAFT_SECTIONS,
  type CraftItem,
  type CraftSection,
} from "../data/craft";

function shuffle<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("zh-CN", { year: "numeric", month: "short" });
}

function PlatformIcon({ platform }: { platform: CraftSection["id"] }) {
  if (platform === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 1C5.925 1 1 5.925 1 12c0 4.86 3.152 8.986 7.523 10.437.55.1.748-.238.748-.53 0-.263-.009-.957-.015-1.88-3.065.665-3.71-1.477-3.71-1.477-.5-1.27-1.222-1.61-1.222-1.61-1-.682.076-.668.076-.668 1.105.078 1.686 1.134 1.686 1.134.982 1.683 2.576 1.197 3.204.916.1-.712.384-1.197.698-1.472-2.447-.278-5.02-1.224-5.02-5.446 0-1.203.43-2.187 1.134-2.955-.114-.278-.491-1.397.108-2.91 0 0 .927-.297 3.036 1.13A10.59 10.59 0 0 1 12 6.84c.937.005 1.88.126 2.762.37 2.107-1.426 3.032-1.13 3.032-1.13.601 1.513.224 2.632.11 2.91.706.768 1.133 1.752 1.133 2.955 0 4.233-2.576 5.165-5.023 5.438.395.34.746 1.01.746 2.037 0 1.472-.014 2.66-.014 3.02 0 .295.199.635.756.527C19.852 20.982 23 16.856 23 12c0-6.075-4.925-11-11-11Z" />
      </svg>
    );
  }
  if (platform === "gitee") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11.99 1C5.925 1 1 5.925 1 12s4.925 11 10.99 11C18.075 23 23 18.075 23 12S18.075 1 11.99 1Zm4.735 15.868a5.64 5.64 0 0 1-4.745 2.593 5.64 5.64 0 0 1-4.74-2.593 5.5 5.5 0 0 1-.848-3.382c0-3.062 2.48-5.543 5.543-5.543h.09c3.062 0 5.543 2.48 5.543 5.543a5.5 5.5 0 0 1-.843 3.382Zm-4.745-5.026c-2.013 0-3.645 1.632-3.645 3.645s1.632 3.645 3.645 3.645 3.645-1.632 3.645-3.645-1.632-3.645-3.645-3.645Z" />
      </svg>
    );
  }
  if (platform === "zhihu") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.751 2.252 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.249 21.75 0 18.281 0zm1.964 4.078c-.271.73-.5 1.434-.68 2.11h4.587c.545-.006.445 1.168.445 1.168H6.384c-.284.77-.528 1.469-.73 2.092h5.086c.61-.003.445 1.167.445 1.167H5.042l-.045.17c-.213.8-.37 1.457-.464 1.97h6.53c.53 0 .53 1.168 0 1.168H4.08c.065.448.158.902.28 1.36.503 1.86 1.627 2.977 3.355 3.32.777.16 1.658.203 2.642.13.984-.073 2.08-.24 3.29-.503a.54.54 0 0 1 .64.38l.04.16.246 1.07a.54.54 0 0 1-.38.64c-1.36.303-2.6.49-3.72.56-1.12.072-2.13.02-3.03-.155-2.64-.545-4.27-2.32-4.9-4.845-.427-1.778-.427-3.64 0-5.586.398-1.66 1.03-3.05 1.898-4.17a.54.54 0 0 1 .76-.1c.224.19.25.52.064.75z" />
      </svg>
    );
  }
  // bilibili
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .653.124.92.373.249.249.373.551.373.907 0 .356-.124.658-.373.907l-1.147 1.12zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.765.28 1.396.786 1.894.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.894V9.907c-.017-.764-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
    </svg>
  );
}

function RefreshIcon({ spinning }: { spinning?: boolean }) {
  return (
    <svg
      className={`craft-refresh-icon${spinning ? " spinning" : ""}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M17.65 6.35A7.95 7.95 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35Z" />
    </svg>
  );
}

function AutoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm1-8h3.5L13 15.5V12Zm-2 0V7.5L7.5 12H11Z" />
    </svg>
  );
}

function LazyImage({
  src,
  alt,
  fallback,
}: {
  src: string | undefined;
  alt: string;
  fallback: ReactNode;
}) {
  const [state, setState] = useState<"idle" | "loaded" | "error">("idle");
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!src) {
      setState("error");
      return;
    }

    let cancelled = false;
    setState("idle");

    const el = containerRef.current;
    if (!el) return;

    const startLoad = () => {
      if (cancelled) return;
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.onload = () => {
        if (!cancelled) setState("loaded");
      };
      img.onerror = () => {
        if (!cancelled) setState("error");
      };
      img.src = src;
    };

    // Already in the initial viewport: skip the observer round-trip.
    const rect = el.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight + 200 && rect.bottom > -200;
    if (inView) {
      startLoad();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            observer.disconnect();
            startLoad();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [src]);

  if (state === "loaded" && src) {
    return <img src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" />;
  }

  return (
    <span ref={containerRef} className="craft-card-image-fallback">
      {fallback}
    </span>
  );
}

export function CraftShowcase() {
  return (
    <div className="craft-showcase">
      {CRAFT_SECTIONS.map((section) => (
        <CraftSection key={section.id} section={section} />
      ))}
    </div>
  );
}

function CraftSection({ section }: { section: CraftSection }) {
  const [order, setOrder] = useState(() => shuffle(section.items));
  const [auto, setAuto] = useState(false);
  const [spin, setSpin] = useState(false);

  // Nothing to rotate when the pool is already fully on screen.
  const canRotate = section.items.length > CARDS_PER_SECTION;

  const visible = useMemo(
    () => order.slice(0, Math.min(CARDS_PER_SECTION, order.length)),
    [order],
  );

  const refresh = useCallback(() => {
    setSpin(true);
    setOrder(shuffle(section.items));
    window.setTimeout(() => setSpin(false), 600);
  }, [section.items]);

  useEffect(() => {
    if (!auto || !canRotate) return;
    const id = window.setInterval(refresh, 5000);
    return () => window.clearInterval(id);
  }, [auto, canRotate, refresh]);

  return (
    <section className="craft-section" aria-labelledby={`craft-${section.id}-heading`}>
      <div className="craft-section-header">
        <div className="craft-section-title">
          <span className="craft-platform-icon" aria-hidden="true">
            <PlatformIcon platform={section.id} />
          </span>
          <h3 id={`craft-${section.id}-heading`}>{section.label}</h3>
        </div>
        <div className="craft-section-actions">
          <a
            className="pill craft-profile-link"
            href={section.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {section.profileLabel}
          </a>
          {canRotate ? (
            <>
              <button
                className={`pill craft-auto${auto ? " active" : ""}`}
                type="button"
                onClick={() => setAuto((a) => !a)}
                aria-label={`Toggle auto-refresh for ${section.label}`}
                aria-pressed={auto}
                title="Auto-refresh every 5 seconds"
              >
                <AutoIcon />
                <span>{auto ? "Stop" : "Auto"}</span>
              </button>
              <button
                className="pill craft-refresh"
                type="button"
                onClick={refresh}
                aria-label={`Refresh ${section.label} cards`}
              >
                <RefreshIcon spinning={spin} />
                <span>Refresh</span>
              </button>
            </>
          ) : null}
        </div>
      </div>
      <div className="craft-grid">
        {visible.map((item) => (
          <CraftCard key={item.id} item={item} platform={section.id} />
        ))}
      </div>
    </section>
  );
}

function CraftCard({
  item,
  platform,
}: {
  item: CraftItem;
  platform: CraftSection["id"];
}) {
  return (
    <article className="craft-card">
      <a
        className="craft-card-cover"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${item.title}`}
      >
        <span className="craft-card-thumb">
          <LazyImage
            src={item.image}
            alt=""
            fallback={<PlatformIcon platform={platform} />}
          />
        </span>
        <span className="craft-card-main">
          <span className="craft-card-source">
            {item.source}
            {item.meta ? <span className="craft-card-meta"> · {item.meta}</span> : null}
          </span>
          <span className="craft-card-title">{item.title}</span>
          <span className="craft-card-desc">{item.description}</span>
          {item.tags && item.tags.length > 0 ? (
            <span className="craft-card-tags">
              {item.tags.map((tag) => (
                <span key={tag} className="craft-card-tag">
                  {tag}
                </span>
              ))}
            </span>
          ) : null}
        </span>
        <span className="craft-card-open" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>
    </article>
  );
}

export { formatDate };
