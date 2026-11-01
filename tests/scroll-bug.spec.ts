import { test, expect } from "@playwright/test";

test.describe("mobile detail scroll", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true });

  test("can scroll down and back up in craft detail", async ({ page }) => {
    await page.goto("http://localhost:5173/craft");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1200);

    const html = page.locator("html");
    const initialScroll = await html.evaluate((el) => el.scrollTop);
    expect(initialScroll).toBe(0);

    // Scroll down through the detail content.
    await html.evaluate((el) => el.scrollBy({ top: 500, behavior: "instant" }));
    await page.waitForTimeout(200);
    const afterDown = await html.evaluate((el) => el.scrollTop);
    expect(afterDown).toBeGreaterThan(100);

    // Scroll back up to the top.
    await html.evaluate((el) => el.scrollBy({ top: -1000, behavior: "instant" }));
    await page.waitForTimeout(200);
    const afterUp = await html.evaluate((el) => el.scrollTop);
    expect(afterUp).toBe(0);

    // The close button must still be reachable at the top.
    await expect(page.locator(".close-button")).toBeVisible();
  });
});

test.describe("mobile gallery shelf swipe", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true });

  test("swipe left opens the next book", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);

    const gallery = page.locator(".gallery");
    const box = await gallery.boundingBox();
    if (!box) throw new Error("gallery not found");

    // Dispatch a touch-like pointer swipe from right to left.
    await page.evaluate(() => {
      const gallery = document.querySelector(".gallery");
      if (!gallery) throw new Error("no gallery");
      const opts = {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: "touch",
        isPrimary: true,
        clientY: 500,
      };
      gallery.dispatchEvent(new PointerEvent("pointerdown", { ...opts, clientX: 200 }));
      gallery.dispatchEvent(new PointerEvent("pointerup", { ...opts, clientX: 80 }));
    });

    await page.waitForURL("**/decks");
    await expect(page.locator(".detail-title")).toHaveText("Video Slides");
  });

  test("swipe right opens the previous book", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);

    await page.evaluate(() => {
      const gallery = document.querySelector(".gallery");
      if (!gallery) throw new Error("no gallery");
      const opts = {
        bubbles: true,
        cancelable: true,
        pointerId: 2,
        pointerType: "touch",
        isPrimary: true,
        clientY: 500,
      };
      gallery.dispatchEvent(new PointerEvent("pointerdown", { ...opts, clientX: 175 }));
      gallery.dispatchEvent(new PointerEvent("pointerup", { ...opts, clientX: 295 }));
    });

    await page.waitForURL("**/craft");
    await expect(page.locator(".detail-title")).toHaveText("Craft");
  });
});
