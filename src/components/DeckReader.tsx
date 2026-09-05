import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { getDeck } from "../data/decks";
import { getNumPages, loadPdf, renderPage } from "../lib/pdf";

export function DeckReader() {
  const { slug } = useParams();
  const deck = slug ? getDeck(slug) : undefined;
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [page, setPage] = useState(1);
  const [num, setNum] = useState(0);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLAnchorElement>(null);

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
  }, [deck]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    let cancelled = false;
    renderPage(pdf, page, canvasRef.current).catch(() => {
      if (!cancelled) setError("Could not render this page.");
    });
    return () => {
      cancelled = true;
    };
  }, [pdf, page]);

  useEffect(() => {
    const timer = window.setTimeout(() => backRef.current?.focus(), 500);
    return () => window.clearTimeout(timer);
  }, []);

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
        <header className="topbar"><Link className="brand" to="/decks">Decks</Link></header>
        <p className="detail-title">Deck not found.</p>
      </main>
    );
  }

  return (
    <main className="stage deck-reader" data-mode="detail">
      <header className="topbar">
        <Link className="brand" to="/decks" ref={backRef}>Decks</Link>
        <div className="nav-actions">
          <a className="pill" href={deck.pdf} download>Download PDF</a>
          <Link className="icon-button" to="/decks" aria-label="Back to decks">×</Link>
        </div>
      </header>

      <div className="reader-stage">
        <button className="reader-arrow reader-prev" type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</button>
        <div className="reader-page">
          <canvas ref={canvasRef} className="reader-canvas" aria-label={`Slide ${page} of ${num}`} />
          {error ? <p className="qr-error">{error}</p> : null}
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
