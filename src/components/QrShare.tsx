import { useEffect, useId, useState } from "react";
import QRCode from "qrcode";

export const SITE_URL = "https://yhyu13.github.io";

/**
 * Share the address the visitor is actually on. On GitHub Pages this is the
 * production origin; on a local dev server or LAN preview it is that address,
 * so a phone scanning the in-site QR reaches the running build.
 */
function currentShareUrl() {
  if (typeof window === "undefined") return SITE_URL;
  return window.location.origin;
}

type QrShareProps = {
  open: boolean;
  onClose: () => void;
};

export function QrShare({ open, onClose }: QrShareProps) {
  const titleId = useId();
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");
  const shareUrl = currentShareUrl();

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    QRCode.toDataURL(shareUrl, {
      width: 512,
      margin: 2,
      color: { dark: "#29251d", light: "#eadfc7" },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) {
          setDataUrl(url);
          setError("");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not draw the code.");
      });
    return () => {
      cancelled = true;
    };
  }, [open, shareUrl]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="qr-layer" role="presentation" onClick={onClose}>
      <div
        className="qr-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="qr-kicker">Field ticket</p>
        <h2 id={titleId} className="qr-title">
          Scan this shelf
        </h2>
        <p className="qr-url">{shareUrl}</p>
        {error ? (
          <p className="qr-error">{error}</p>
        ) : dataUrl ? (
          <img className="qr-image" src={dataUrl} alt={`QR code for ${shareUrl}`} width={220} height={220} />
        ) : (
          <p className="qr-error">Drawing…</p>
        )}
        <div className="qr-actions">
          {dataUrl ? (
            <a className="pill" href={dataUrl} download="hang-yu-shelf.png">
              Download PNG
            </a>
          ) : null}
          <button className="pill qr-dismiss" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function QrTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button className="icon-button qr-trigger" type="button" aria-label="Show site QR code" onClick={onClick}>
      <span className="qr-glyph" aria-hidden="true" />
    </button>
  );
}
