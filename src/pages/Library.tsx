import { lazy, Suspense, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QrShare, QrTrigger } from "../components/QrShare";
import { getManual, MANUALS, type Manual, type ManualId } from "../data/manuals";

const StageWash = lazy(() => import("../components/StageWash"));

const BLOSSOMS = [
  { x: "4%", size: "30px", r: "18deg", duration: "10s", delay: "-4s" },
  { x: "16%", size: "19px", r: "74deg", duration: "8.5s", delay: "-1s" },
  { x: "31%", size: "25px", r: "-20deg", duration: "11s", delay: "-7s" },
  { x: "44%", size: "17px", r: "48deg", duration: "9.5s", delay: "-5s" },
  { x: "58%", size: "28px", r: "12deg", duration: "12s", delay: "-8s" },
  { x: "69%", size: "20px", r: "92deg", duration: "9s", delay: "-3s" },
  { x: "79%", size: "32px", r: "32deg", duration: "11.5s", delay: "-6s" },
  { x: "89%", size: "22px", r: "-14deg", duration: "10.5s", delay: "-9s" },
  { x: "96%", size: "16px", r: "56deg", duration: "8s", delay: "-2s" },
];

type LibraryProps = {
  openId?: ManualId;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Library({ openId }: LibraryProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [toastShow, setToastShow] = useState(false);
  const selected = openId ? getManual(openId) : undefined;
  const mode = selected ? "detail" : "gallery";
  const stageRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const toastTimer = useRef(0);
  const frame = useRef(0);
  const pointer = useRef({ x: 0, y: 0, clientX: -10000, clientY: -10000 });
  const selectedRef = useRef<HTMLButtonElement | null>(null);

  const showToast = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    setToastShow(true);
    toastTimer.current = window.setTimeout(() => setToastShow(false), 1800);
  }, []);

  const closeDetail = useCallback(() => {
    if (mode !== "detail") return;
    navigate("/");
  }, [mode, navigate]);

  useEffect(() => {
    document.body.dataset.mode = mode;
    document.body.dataset.menu = menuOpen ? "open" : "closed";
    document.title = selected && selected.coverTitle !== "Hang Yu"
      ? `${selected.coverTitle} · Hang Yu`
      : "Hang Yu";
    return () => {
      document.body.dataset.mode = "gallery";
      document.body.dataset.menu = "closed";
    };
  }, [mode, menuOpen, selected]);

  useEffect(() => {
    if (mode !== "detail") return;
    const delay = prefersReducedMotion() ? 0 : 700;
    const timer = window.setTimeout(() => {
      closeRef.current?.focus({ preventScroll: true });
      if (window.innerWidth > 900 && stageRef.current) stageRef.current.scrollTop = 0;
    }, delay);
    return () => window.clearTimeout(timer);
  }, [mode, selected?.id]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (qrOpen) {
        setQrOpen(false);
        return;
      }
      if (menuOpen) {
        setMenuOpen(false);
        return;
      }
      closeDetail();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, qrOpen, closeDetail]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateParallax = () => {
      frame.current = 0;
      if (reduced.matches) return;
      const { x, y, clientX, clientY } = pointer.current;
      if (mode === "detail" && selectedRef.current) {
        const bounds = selectedRef.current.getBoundingClientRect();
        const bookCenterX = bounds.left + bounds.width / 2;
        const bookCenterY = bounds.top + bounds.height / 2;
        const inView =
          clientX >= 0 && clientX <= window.innerWidth && clientY >= 0 && clientY <= window.innerHeight;
        const horizontalReach = clientX < bookCenterX
          ? Math.max(bookCenterX, 1)
          : Math.max(window.innerWidth - bookCenterX, 1);
        const verticalReach = clientY < bookCenterY
          ? Math.max(bookCenterY, 1)
          : Math.max(window.innerHeight - bookCenterY, 1);
        const viewportX = inView ? Math.max(-1, Math.min(1, (clientX - bookCenterX) / horizontalReach)) : -5 / 16;
        const viewportY = inView ? Math.max(-1, Math.min(1, (clientY - bookCenterY) / verticalReach)) : 0;
        selectedRef.current.style.setProperty("--detail-yaw", `${viewportX * 16}deg`);
        selectedRef.current.style.setProperty("--detail-pitch", `${viewportY * -10}deg`);
        selectedRef.current.dataset.orbiting = String(inView);
        return;
      }
      if (mode !== "gallery") return;
      document.documentElement.style.setProperty("--mx", `${x * 11}px`);
      document.documentElement.style.setProperty("--my", `${y * 8}px`);
      const cards = document.querySelectorAll<HTMLElement>(".book-card");
      cards.forEach((card, index) => {
        const depth = index === 1 ? 1 : 0.58;
        card.style.setProperty("--local-x", `${x * 15 * depth}px`);
        card.style.setProperty("--local-y", `${y * 9 * depth}px`);
      });
    };

    const onMove = (event: PointerEvent) => {
      pointer.current = {
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
        clientX: event.clientX,
        clientY: event.clientY,
      };
      if (!frame.current) frame.current = window.requestAnimationFrame(updateParallax);
    };
    const onLeave = () => {
      pointer.current = { x: 0, y: 0, clientX: -10000, clientY: -10000 };
      if (!frame.current) frame.current = window.requestAnimationFrame(updateParallax);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [mode]);

  return (
    <main className="stage" ref={stageRef} aria-label="Hang Yu field library">
      {mode === "gallery" ? (
        <Suspense fallback={null}>
          <StageWash />
        </Suspense>
      ) : null}

      <header className="topbar">
        <Link className="brand" to="/" aria-label="Hang Yu home">
          Hang Yu
        </Link>
        <div className="nav-actions">
          <QrTrigger onClick={() => setQrOpen(true)} />
          <button
            className="icon-button"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="menu-glyph" aria-hidden="true" />
          </button>
          <button
            className="ticket-button"
            type="button"
            onClick={() => {
              if (mode === "detail") {
                navigate("/");
                return;
              }
              showToast("The collection is complete.");
            }}
          >
            The Collection
          </button>
        </div>
      </header>

      <h1 className="hero-word" aria-hidden="true">
        躬行
      </h1>

      <section className="gallery" aria-label="Field manuals">
        {MANUALS.map((manual) => (
          <BookCard
            key={manual.id}
            manual={manual}
            selected={selected?.id === manual.id}
            tabIndex={mode === "detail" ? -1 : 0}
            onSelect={() => {
              if (mode === "detail") return;
              navigate(`/${manual.id}`);
            }}
            cardRef={selected?.id === manual.id ? selectedRef : undefined}
          />
        ))}
      </section>

      <DetailPanel manual={selected} />

      <button
        className="close-button"
        ref={closeRef}
        type="button"
        aria-label="Close detail view"
        tabIndex={mode === "detail" ? 0 : -1}
        onClick={closeDetail}
      >
        ×
      </button>

      <div className="blossom-field" aria-hidden="true">
        {BLOSSOMS.map((blossom) => (
          <span
            key={blossom.x}
            className="blossom"
            style={{
              ["--blossom-x" as string]: blossom.x,
              ["--blossom-size" as string]: blossom.size,
              ["--blossom-r" as string]: blossom.r,
              ["--blossom-duration" as string]: blossom.duration,
              ["--blossom-delay" as string]: blossom.delay,
            }}
          >
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        ))}
      </div>

      <nav className="menu-layer" aria-label="Site menu" inert={!menuOpen}>
        <ul className="menu-list">
          {MANUALS.map((manual) => (
            <li key={manual.id}>
              <Link
                className="menu-link"
                to={`/${manual.id}`}
                onClick={() => setMenuOpen(false)}
              >
                {manual.coverTitle}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="toast" data-show={toastShow ? "true" : "false"} role="status" aria-live="polite">
        {toast}
      </div>

      <QrShare open={qrOpen} onClose={() => setQrOpen(false)} />
    </main>
  );
}

function BookCard({
  manual,
  selected,
  tabIndex,
  onSelect,
  cardRef,
}: {
  manual: Manual;
  selected: boolean;
  tabIndex: number;
  onSelect: () => void;
  cardRef?: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      ref={cardRef}
      className={`book-card${selected ? " selected" : ""}`}
      type="button"
      data-book={manual.id}
      aria-label={`Open ${manual.coverTitle} details`}
      tabIndex={tabIndex}
      style={{
        ["--cover-color" as string]: manual.coverColor,
        ["--cover-ink" as string]: manual.coverInk,
      }}
      onClick={onSelect}
      onPointerEnter={(event) => {
        event.currentTarget.dataset.hovered = "true";
      }}
      onPointerLeave={(event) => {
        event.currentTarget.dataset.hovered = "false";
      }}
    >
      <span className="book" aria-hidden="true">
        <span className="book-shadow" />
        <span className="book-back" />
        <span className="page-block" />
        <span className="page-fan">
          <i />
          <i />
          <i />
          <i />
        </span>
        <span className="front-cover">
          <span className="cover-copy" style={{ ["--cover-ink" as string]: manual.coverInk }}>
            <span className="cover-kicker">{manual.kicker}</span>
            <span className="cover-title">{manual.coverTitle}</span>
            <span className="cover-subtitle">{manual.subtitle}</span>
            <span />
            <span className="cover-footer">{manual.footer}</span>
          </span>
        </span>
        <span className="open-badge">Read</span>
      </span>
    </button>
  );
}

function DetailPanel({ manual }: { manual?: Manual }) {
  const hidden = !manual;
  return (
    <section
      className="detail-panel"
      aria-live="polite"
      aria-hidden={hidden}
      inert={hidden}
    >
      {manual ? (
        <>
          <h2 className="detail-title">{manual.coverTitle}</h2>
          <div className="detail-scroll" tabIndex={0} aria-label={`${manual.coverTitle} guide`}>
            {manual.photo ? (
              <img className="identity-photo" src={manual.photo} alt="Hang Yu, University of Illinois i-card" width={148} height={96} />
            ) : null}
            <p className="detail-description">{manual.description}</p>
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
          <div className="bottom-dock">
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
        </>
      ) : null}
    </section>
  );
}
