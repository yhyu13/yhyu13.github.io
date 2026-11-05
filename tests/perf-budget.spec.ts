import { test, expect, type Page } from "@playwright/test";

/**
 * Budgets from docs/superpowers/specs/2026-11-02-mobile-performance-design.md.
 *
 * These run against the dev server, so they assert *which* modules a phone
 * asks for (the chunk decisions), not byte sizes — byte budgets live in
 * scripts/check-budget.mjs, which reads the real build output.
 */

const collect = (page: Page) => {
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  return requests;
};

const matches = (requests: string[], fragment: string) =>
  requests.filter((url) => url.includes(fragment));

test.describe("phone 390x844", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("home does not download the three.js backdrop", async ({ page }) => {
    const requests = collect(page);
    await page.goto("/", { waitUntil: "load" });
    await page.waitForSelector(".gallery");
    await page.waitForTimeout(1500);

    expect(matches(requests, "StageWash")).toHaveLength(0);
    // The backdrop is the only three.js consumer, so nothing should pull it.
    expect(matches(requests, "threeui")).toHaveLength(0);
  });

  test("archive does not download pdf.js", async ({ page }) => {
    const requests = collect(page);
    await page.goto("/archive", { waitUntil: "load" });
    await page.waitForSelector(".detail-panel");
    await page.waitForTimeout(1000);

    expect(matches(requests, "lib/pdf")).toHaveLength(0);
    expect(matches(requests, "pdfjs-dist")).toHaveLength(0);
  });

  test("the deck shelf still lazy-loads a handful of covers, not all of them", async ({ page }) => {
    const requests = collect(page);
    await page.goto("/decks", { waitUntil: "load" });
    await page.waitForSelector(".deck-shelf");
    await page.waitForTimeout(2500);

    const covers = matches(requests, ".pdf");
    expect(covers.length).toBeGreaterThan(0);
    expect(covers.length).toBeLessThan(8);
  });
});

test.describe("desktop 1440x900", () => {
  test.use({ viewport: { width: 1440, height: 900 }, hasTouch: false, isMobile: false });

  test("keeps the three.js backdrop", async ({ page }) => {
    const requests = collect(page);
    await page.goto("/", { waitUntil: "load" });
    await page.waitForSelector(".gallery");
    await page.waitForTimeout(2500);

    expect(matches(requests, "StageWash").length).toBeGreaterThan(0);
    await expect(page.locator(".stage-wash canvas").first()).toBeVisible();
  });

  test("the deck reader still loads pdf.js on a detail route", async ({ page }) => {
    const requests = collect(page);
    await page.goto("/decks/atlas-fei-fei-li-world-model", { waitUntil: "load" });
    await page.waitForSelector(".deck-reader", { timeout: 15000 });
    await page.waitForTimeout(2500);

    expect(matches(requests, "pdfjs-dist").length).toBeGreaterThan(0);
  });
});

test.describe("PDF worker lifetime", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("one worker serves the gallery and every deck opened afterwards", async ({ page }) => {
    const requests = collect(page);
    await page.goto("/decks", { waitUntil: "load" });
    await page.waitForSelector(".deck-cover");
    await page.waitForTimeout(2000);

    const firstDeck = page.locator(".deck-cover").first();
    const secondDeck = page.locator(".deck-cover").nth(1);

    await firstDeck.click();
    await page.waitForSelector(".deck-reader", { timeout: 15000 });
    await page.waitForTimeout(1500);
    await page.goBack({ waitUntil: "load" });
    await page.waitForSelector(".deck-cover");

    await secondDeck.click();
    await page.waitForSelector(".deck-reader", { timeout: 15000 });
    await page.waitForTimeout(1500);

    // `?url` is the constant module that exports the worker path, not a worker.
    const workerScripts = matches(requests, "pdf.worker.min.mjs").filter(
      (url) => !url.includes("?url"),
    );
    expect(workerScripts.length).toBe(1);
  });
});
