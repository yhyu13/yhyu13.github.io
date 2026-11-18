/**
 * The share button on its own, with no heavy imports: the gallery header needs
 * it while the dialog itself stays behind a lazy chunk.
 */
export function ShareTrigger({ onClick, label }: { onClick: () => void; label?: string }) {
  if (label) {
    return (
      <button className="pill share-trigger" type="button" onClick={onClick}>
        {label}
      </button>
    );
  }
  return (
    <button className="icon-button qr-trigger" type="button" aria-label="Share this page" onClick={onClick}>
      <span className="qr-glyph" aria-hidden="true" />
    </button>
  );
}
