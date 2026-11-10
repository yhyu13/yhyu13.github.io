import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link, useParams } from "react-router-dom";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { getDeck } from "../data/decks";
import { destroyPdf, getNumPages, loadPdf, renderPage } from "../lib/pdf";

export function DeckReader() {
  const { slug } = useParams();
  const deck = slug ? getDeck(slug) : undefined;
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [num, setNum] = useState(0);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLAnchorElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const swipeRef = useRef({ id: -1, x: 0, y: 0, t: 0, active: false });

  const retry = useCallback(() => {
    setError("");
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!deck) {
      setError("Unknown deck.");
      return;
    }
    let cancelled = false;
    setError("");
    loadPdf(deck.pdf)
      .then((doc) => {
        if (cancelled) return;
        setPdf(doc);
        setNum(getNumPages(doc));
      })
      .catch(() => {
        if (!cancelled) setError("Could not open this deck.");
      });
    return () => {
      cancelled = true;
    };
  }, [deck, reloadKey]);

  // Destroy the loaded document when replaced (deck/reload change) or on unmount.
  useEffect(() => {
    return () => destroyPdf(pdf);
  }, [pdf]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    let cancelled = false;
    renderPage(pdf, page, canvasRef.current, undefined, (task) => {
      if (!cancelled) renderTaskRef.current = task;
    }).catch(() => {
      if (!cancelled) setError("Could not render this page.");
    });
    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
    };
  }, [pdf, page]);

  useEffect(() => {
    const timer = window.setTimeout(() => backRef.current?.focus(), 500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const root = rootRef.current;
    const sync = () => {
      if (!root) return;
      root.dataset.touch = coarse.matches ? "true" : "false";
      root.classList.toggle("is-touch", coarse.matches);
      root.style.setProperty("--reader-touch", coarse.matches ? "1" : "0");
    };
    sync();
    coarse.addEventListener("change", sync);
    return () => coarse.removeEventListener("change", sync);
  }, [deck?.pdf]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" || !event.isPrimary) return;
    const target = event.target;
    if (target instanceof Element && target.closest("button, a, input, textarea, select")) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Older browsers may reject capture; the swipe still works in place.
    }
    swipeRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      t: Date.now(),
      active: true,
    };
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const swipe = swipeRef.current;
    if (!swipe.active || swipe.id !== event.pointerId) return;
    swipeRef.current = { ...swipe, active: false };
    if (!num) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    if (Date.now() - swipe.t > 700) return;
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy) * 1.2) return;
    if (dx < 0) {
      setPage((p) => Math.min(num, p + 1));
    } else {
      setPage((p) => Math.max(1, p - 1));
    }
  };

  const onPointerCancel = () => {
    swipeRef.current = { ...swipeRef.current, active: false };
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setPage((p) => Math.min(num, p + 1));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setPage((p) => Math.max(1, p - 1));
      } else if (e.key === "Escape") {
        window.history.back();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [num]);

  const pageNumbers = useMemo(() => Array.from({ length: num }, (_, i) => i + 1), [num]);

  if (!deck) {
    return (
      <main className="stage">
        <header className="topbar">
          <Link className="brand" to="/decks">Video Slides</Link>
          <div className="nav-actions">
            <Link className="icon-button" to="/decks" aria-label="Back to video slides">×</Link>
          </div>
        </header>
        <p className="detail-title">Deck not found.</p>
      </main>
    );
  }

  return (
    <main className="stage deck-reader" ref={rootRef} data-mode="detail" aria-keyshortcuts="ArrowLeft ArrowRight Space PageUp PageDown Escape">
      <header className="topbar">
        <Link className="brand" to="/decks" ref={backRef}>Favorites</Link>
        <div className="nav-actions">
          {deck.links?.map((link) => (
            <a key={link.href} className="pill pill-extra" href={link.href}>
              {link.label}
            </a>
          ))}
          <a className="pill" href={deck.pdf} download>Download PDF</a>
          <Link className="icon-button" to="/decks" aria-label="Back to video slides">×</Link>
        </div>
      </header>

      <div className="reader-stage">
        <button className="reader-arrow reader-prev" type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</button>
        <div
          className="reader-page"
          style={{ touchAction: "pan-y" }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          <canvas ref={canvasRef} className="reader-canvas" aria-label={`Slide ${page} of ${num}`} />
          {error ? (
            <div className="reader-error">
              <p className="qr-error">{error}</p>
              <button className="pill" type="button" onClick={retry}>Retry</button>
            </div>
          ) : null}
        </div>
        <button className="reader-arrow reader-next" type="button" aria-label="Next page" disabled={page >= num} onClick={() => setPage((p) => Math.min(num, p + 1))}>›</button>
      </div>

      <footer className="reader-foot">
        <span className="reader-count">{page} / {num}</span>
        <div className="thumb-strip" role="list" aria-label="Slides">
          {pageNumbers.map((n) => (
            <Thumb key={n} pdf={pdf} n={n} active={n === page} scale={0.18} onPick={() => setPage(n)} />
          ))}
        </div>
      </footer>
    </main>
  );
}

function Thumb({ pdf, n, active, scale, onPick }: { pdf: PDFDocumentProxy | null; n: number; active: boolean; scale: number; onPick: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!pdf || !ref.current) return;
    let cancelled = false;
    pdf.getPage(n)
      .then((pg) => {
        if (cancelled || !ref.current) return;
        const vp = pg.getViewport({ scale });
        ref.current.width = Math.floor(vp.width);
        ref.current.height = Math.floor(vp.height);
        return pg.render({ canvas: ref.current, canvasContext: ref.current.getContext("2d")!, viewport: vp }).promise;
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [pdf, n, scale]);
  return (
    <button className={`thumb${active ? " active" : ""}`} type="button" onClick={onPick} aria-label={`Go to slide ${n}`} aria-current={active ? "true" : undefined}>
      <canvas ref={ref} />
    </button>
  );
}
