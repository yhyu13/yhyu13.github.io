const { chromium } = require("@playwright/test");
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  const page = await ctx.newPage();
  const pdfs = [];
  page.on("request", (r) => { if (r.url().includes(".pdf")) pdfs.push(r.url()); });

  await page.goto("http://localhost:5173/decks", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(120);
  await page.screenshot({ path: "tmp-decks-120.png" });
  await page.waitForTimeout(600);
  await page.screenshot({ path: "tmp-decks-720.png" });
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "tmp-decks-settled.png" });

  const initial = await page.evaluate(() => {
    const book = document.querySelector(".book-card.selected .book");
    const fan = document.querySelector(".book-card.selected .page-fan");
    const card = document.querySelector(".book-card.selected");
    return {
      bookTransform: book ? getComputedStyle(book).transform : null,
      fanDisplay: fan ? getComputedStyle(fan).display : null,
      cardTransition: card ? getComputedStyle(card).transition : null,
      card: card ? card.getBoundingClientRect().toJSON() : null,
    };
  });

  const initialPdfs = pdfs.length;
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(1500);
  const afterScrollPdfs = pdfs.length;
  console.log(JSON.stringify({ initialPdfs, afterScrollPdfs, pdfs: pdfs.map((u) => u.split("/").pop()), geometry: initial }, null, 2));
  await browser.close();
})();
