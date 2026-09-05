export type Deck = {
  slug: string;
  title: string;
  year: string;
  date: string; // ISO 2026-09-05
  source?: string;
  sourceUrl?: string;
  pdf: string; // "/decks/<slug>.pdf"
  description: string;
  color?: string;
};

export const DECKS: Deck[] = [
  {
    slug: "smoke",
    title: "Pipeline smoke deck",
    year: "2026",
    date: "2026-09-05",
    source: "generated placeholder",
    pdf: "/decks/smoke.pdf",
    description: "A generated placeholder deck used to exercise the reader before real decks are added.",
  },
];

export function getDeck(slug: string | undefined): Deck | undefined {
  return DECKS.find((deck) => deck.slug === slug);
}
