import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerUrl;

export function loadPdf(url: string): Promise<PDFDocumentProxy> {
  return getDocument({ url }).promise;
}

export function getNumPages(pdf: PDFDocumentProxy): number {
  return pdf.numPages;
}

export async function renderPage(
  pdf: PDFDocumentProxy,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  maxWidth?: number,
) {
  const page = await pdf.getPage(pageNumber);
  const base = page.getViewport({ scale: 1 });
  const target = maxWidth ? Math.min(maxWidth, base.width) : base.width;
  const viewport = page.getViewport({ scale: target / base.width });
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  return viewport;
}
