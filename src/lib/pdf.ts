import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy, type PageViewport, type RenderTask } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerUrl;

/**
 * One worker per page session, not one per document.
 *
 * `getDocument()` spawns its own worker when none is supplied, so the deck
 * gallery (two covers in view) plus the reader used to start three workers and
 * download the 1236 kB `pdf.worker.min.mjs` three times. Supplying a single
 * port means pdf.js routes every document over the same worker thread.
 *
 * The worker is deliberately not torn down when a document is destroyed: it
 * lives for the page session, which is what makes the second and later PDFs
 * free. Creating it lazily keeps `/archive`, `/craft` and `/courses` at zero
 * PDF bytes.
 */
let sharedWorker: Worker | null = null;
// `PDFDocumentLoadingTask.destroy()` marks a borrowed worker `_pendingDestroy`
// and drops it from pdf.js's port cache, so creating a document *while that
// destroy is in flight* throws "PDFWorker.create - the worker is being
// destroyed". Serialising destroys and waiting for them before the next load
// keeps the single port reusable across route changes.
let destroyChain: Promise<void> = Promise.resolve();

function ensureWorker(): void {
  if (sharedWorker) return;
  if (typeof Worker === "undefined") return; // SSR / test environments
  try {
    sharedWorker = new Worker(workerUrl, { type: "module" });
    GlobalWorkerOptions.workerPort = sharedWorker;
  } catch {
    // Worker construction blocked (CSP, old browser): fall back to the
    // per-document worker that `GlobalWorkerOptions.workerSrc` provides.
    sharedWorker = null;
  }
}

export async function loadPdf(url: string): Promise<PDFDocumentProxy> {
  await destroyChain;
  ensureWorker();
  return getDocument({ url }).promise;
}

export function getNumPages(pdf: PDFDocumentProxy): number {
  return pdf.numPages;
}

/** Destroys the document, never the shared worker. */
export function destroyPdf(pdf: PDFDocumentProxy | null | undefined): void {
  const task = pdf?.loadingTask;
  if (!task) return;
  destroyChain = destroyChain.then(() => task.destroy()).catch(() => {
    /* already destroyed */
  });
}

export async function renderPage(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  maxWidth?: number,
  onTask?: (task: RenderTask) => void,
): Promise<PageViewport> {
  const page = await pdf.getPage(pageNumber);
  const base = page.getViewport({ scale: 1 });
  const target = maxWidth ? Math.min(maxWidth, base.width) : base.width;
  const viewport = page.getViewport({ scale: target / base.width });
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  const task = page.render({ canvas, canvasContext: ctx, viewport });
  onTask?.(task);
  await task.promise;
  return viewport;
}
