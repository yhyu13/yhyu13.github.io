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
      if (shelf.scrollHeight <= shelf.clientHeight) return; // nothing to scroll (e.g. mobile page-scroll layout)
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
    if (didLoad.current) return;
    didLoad.current = true;
    let cancelled = false;
    let pdfDoc: PDFDocumentProxy | null = null;
    loadPdf(deck.pdf)
      .then((pdf) => {
        pdfDoc = pdf;
        if (cancelled || !canvasRef.current) return;
        return renderPage(pdf, 1, canvasRef.current, 210).catch(() => {});
      })
      .catch(() => {});
    return () => { cancelled = true; didLoad.current = false; destroyPdf(pdfDoc); };
  }, [deck.pdf]);

  return (
    <article className="deck-card">
      <Link className="deck-cover" to={`/decks/${deck.slug}`} aria-label={`Open ${deck.title}`}>
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
