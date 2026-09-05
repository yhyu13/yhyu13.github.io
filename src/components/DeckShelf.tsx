import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { DECKS, type Deck } from "../data/decks";
import { loadPdf, renderPage } from "../lib/pdf";

export function DeckShelf() {
  return (
    <section className="deck-shelf" aria-label="Decks">
      <h2 className="detail-title">Decks</h2>
      <p className="detail-description">
        Slide decks, mostly adapted from YouTube and Bilibili. Open to read, or download the PDF.
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
    loadPdf(deck.pdf)
      .then((pdf) => {
        if (cancelled || !canvasRef.current) return;
        return renderPage(pdf, 1, canvasRef.current, 210).catch(() => {});
      })
      .catch(() => {});
    return () => { cancelled = true; didLoad.current = false; };
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
        {deck.source ? <p className="deck-card-source">{deck.source}</p> : null}
        <div className="action-rail">
          <Link className="pill" to={`/decks/${deck.slug}`}>Read</Link>
          <a className="pill" href={deck.pdf} download>Download PDF</a>
        </div>
      </div>
    </article>
  );
}
