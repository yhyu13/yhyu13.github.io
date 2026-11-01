import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { DECKS, type Deck } from "../data/decks";
import { destroyPdf, loadPdf, renderPage } from "../lib/pdf";

export function DeckShelf() {
  const shelfRef = useRef<HTMLElement>(null);

  // The overview is the only scrollable element on this page; make the wheel
  // work anywhere (over the hero book / empty space too), not just over the panel.
  useEffect(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    const onWheel = (e: WheelEvent) => {
      if (e.target instanceof Node && shelf.contains(e.target)) return; // native scroll over the panel
      if (getComputedStyle(shelf).overflowY !== "auto") return; // mobile page-scroll layout
      if (shelf.scrollHeight <= shelf.clientHeight) return; // nothing to scroll
      const dy = e.deltaY;
      const atTop = shelf.scrollTop <= 0;
      const atBottom = shelf.scrollTop + shelf.clientHeight >= shelf.scrollHeight;
      if ((dy < 0 && !atTop) || (dy > 0 && !atBottom)) {
        shelf.scrollTop += dy;
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section className="deck-shelf" ref={shelfRef} aria-label="Video Slides">
      <h2 className="detail-title">Video Slides</h2>
      <p className="detail-description">
        Beloved video collections from YouTube and Bilibili. Open the slides, watch the original, or download the PDF.
      </p>
      <div className="deck-grid">
        {DECKS.map((deck) => <DeckCard key={deck.slug} deck={deck} />)}
      </div>
    </section>
  );
}

function DeckCard({ deck }: { deck: Deck }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const didLoad = useRef(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let pdfDoc: PDFDocumentProxy | null = null;

    const loadCover = () => {
      if (didLoad.current) return;
      didLoad.current = true;
      loadPdf(deck.pdf)
        .then((pdf) => {
          pdfDoc = pdf;
          if (cancelled || !canvasRef.current) return;
          return renderPage(pdf, 1, canvasRef.current, 210).catch(() => {});
        })
        .catch(() => {});
    };

    // Render a PDF cover only when the card approaches the viewport. Opening
    // Video Slides used to fetch all 15 PDFs at once, which made the first
    // seconds on a phone very janky.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        loadCover();
      },
      { rootMargin: "240px" },
    );
    observer.observe(canvas);

    return () => {
      cancelled = true;
      observer.disconnect();
      didLoad.current = false;
      destroyPdf(pdfDoc);
    };
  }, [deck.pdf]);

  return (
    <article className="deck-card">
      <Link className="deck-cover" to={`/decks/${deck.slug}`} aria-label={`Open ${deck.title}`}>
        <span className="deck-cover-placeholder" aria-hidden="true">{deck.title}</span>
        <canvas ref={canvasRef} className="deck-thumb" />
      </Link>
      <div className="deck-card-body">
        <p className="kicker">{deck.date}</p>
        <h3 className="deck-card-title">{deck.title}</h3>
        <p className="deck-card-desc">{deck.description}</p>
        {deck.sourceUrl ? (
          <a className="deck-card-source" href={deck.sourceUrl} target="_blank" rel="noreferrer">
            Watch original · {deck.source ?? "video"}
          </a>
        ) : deck.source ? (
          <p className="deck-card-source">{deck.source}</p>
        ) : null}
        <div className="action-rail">
          <Link className="pill" to={`/decks/${deck.slug}`}>Read</Link>
          <a className="pill" href={deck.pdf} download>Download PDF</a>
        </div>
      </div>
    </article>
  );
}
