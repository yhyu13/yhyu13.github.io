import { useEffect, useId, useMemo, useState } from "react";
import QRCode from "qrcode";
import { getShareEntry, shareMessage, type ShareEntry } from "../data/share";

export const SITE_URL = "https://yhyu13.github.io";

/**
 * Share the address the visitor is actually on. On GitHub Pages this is the
 * production origin; on a local dev server or LAN preview it is that address,
 * so a phone scanning the in-site QR reaches the running build.
 */
async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function currentShareUrl(path?: string) {
  if (typeof window === "undefined") return path ? SITE_URL + path : SITE_URL;
  return window.location.origin + window.location.pathname;
}

type ShareDialogProps = {
  open: boolean;
  onClose: () => void;
  /** Entry for the page being shared; falls back to the current path. */
  entry?: ShareEntry;
  /** Overrides the entry, for pages not in the inventory (the gallery). */
  fallbackTitle?: string;
  fallbackDescription?: string;
};

/**
 * One dialog for both ways of sharing: the text that should travel with the
 * link (so a paste into a chat is not a bare URL), and the QR for handing a
 * phone to someone in the room.
 */
export function ShareDialog({ open, onClose, entry, fallbackTitle, fallbackDescription }: ShareDialogProps) {
  const titleId = useId();
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<"none" | "text" | "url">("none");
  const [shareError, setShareError] = useState("");

  const resolved = useMemo(() => {
    const fromPath = entry ?? getShareEntry(typeof window === "undefined" ? "/" : window.location.pathname);
    if (fromPath) return fromPath;
    return undefined;
  }, [entry]);

  const title = resolved?.title ?? fallbackTitle ?? "Hang Yu · Field Manuals";
  const description = resolved?.description ?? fallbackDescription ?? "纸上得来终觉浅，绝知此事要躬行";
  const url = currentShareUrl(resolved?.path);
  const text = resolved
    ? shareMessage(resolved, url)
    : [title, description, url].filter(Boolean).join("\n");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setCopied("none");
    setShareError("");
    QRCode.toDataURL(url, {
      width: 512,
      margin: 2,
      color: { dark: "#29251d", light: "#eadfc7" },
      errorCorrectionLevel: "M",
    })
      .then((value) => {
        if (!cancelled) {
          setDataUrl(value);
          setError("");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not draw the code.");
      });
    return () => {
      cancelled = true;
    };
  }, [open, url]);

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

  const onCopy = async (kind: "text" | "url") => {
    const ok = await copyToClipboard(kind === "text" ? text : url);
    if (ok) setCopied(kind);
    else setShareError("浏览器不让写剪贴板，请手动全选下面的文字。");
  };

  // Size the box to the message instead of clipping it mid-sentence on a phone.
  const textRows = Math.min(8, Math.max(3, Math.ceil(text.length / 30) + text.split("\n").length));

  const nativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const onNativeShare = async () => {
    try {
      await navigator.share({ title, text: description, url });
      onClose();
    } catch {
      /* the reader dismissed the sheet — nothing to report */
    }
  };

  return (
    <div className="qr-layer" role="presentation" onClick={onClose}>
      <div
        className="qr-dialog share-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="qr-kicker">Share · 复制就能发</p>
        <h2 id={titleId} className="qr-title">
          {title}
        </h2>

        <label className="share-field">
          <span className="share-field-label">分享文案（标题 · 简介 · 链接）</span>
          <textarea
            className="share-text"
            readOnly
            rows={textRows}
            value={text}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>

        <div className="qr-actions share-actions">
          <button className="pill" type="button" onClick={() => onCopy("text")}>
            {copied === "text" ? "已复制文案" : "复制文案"}
          </button>
          <button className="pill" type="button" onClick={() => onCopy("url")}>
            {copied === "url" ? "已复制链接" : "只复制链接"}
          </button>
          {nativeShare ? (
            <button className="pill" type="button" onClick={onNativeShare}>
              用系统分享
            </button>
          ) : null}
          <button className="pill qr-dismiss" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        {shareError ? <p className="qr-error">{shareError}</p> : null}

        <details className="share-qr">
          <summary>给别人扫码</summary>
          {error ? (
            <p className="qr-error">{error}</p>
          ) : dataUrl ? (
            <img className="qr-image" src={dataUrl} alt={`QR code for ${url}`} width={200} height={200} />
          ) : (
            <p className="qr-error">Drawing…</p>
          )}
          <p className="qr-url">{url}</p>
          {dataUrl ? (
            <a className="pill" href={dataUrl} download="hang-yu-share.png">
              Download PNG
            </a>
          ) : null}
        </details>
      </div>
    </div>
  );
}
