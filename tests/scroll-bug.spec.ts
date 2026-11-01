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

test.describe("mobile gallery shelf swipe previews, tap opens", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true });

  async function swipe(page, fromX: number, toX: number, pointerId: number) {
    await page.evaluate(
      ({ fromX, toX, pointerId }) => {
        const gallery = document.querySelector(".gallery");
        if (!gallery) throw new Error("no gallery");
        const opts = {
          bubbles: true,
          cancelable: true,
          pointerId,
          pointerType: "touch",
          isPrimary: true,
          clientY: 500,
        };
        gallery.dispatchEvent(new PointerEvent("pointerdown", { ...opts, clientX: fromX }));
        gallery.dispatchEvent(new PointerEvent("pointerup", { ...opts, clientX: toX }));
      },
      { fromX, toX, pointerId },
    );
  }

  test("swipe left previews the next book without navigating", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);

    await swipe(page, 200, 80, 1);
    await page.waitForTimeout(300);

    // Still on the gallery.
    expect(new URL(page.url()).pathname).toBe("/");
    // Focus moved from archive (index 2) to decks (index 3).
    await expect(page.locator('.book-card[data-book="decks"]')).toHaveAttribute(
      "data-focused",
      "true",
    );
    await expect(page.locator('.book-card[data-book="archive"]')).toHaveAttribute(
      "data-focused",
      "false",
    );
  });

  test("tap after swipe opens the previewed book", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);

    await swipe(page, 200, 80, 2);
    await page.waitForTimeout(300);
    await page.locator('.book-card[data-book="decks"]').click();

    await page.waitForURL("**/decks");
    await expect(page.locator(".detail-title")).toHaveText("Video Slides");
  });

  test("swipe right previews the previous book", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);

    await swipe(page, 175, 295, 3);
    await page.waitForTimeout(300);

    expect(new URL(page.url()).pathname).toBe("/");
    await expect(page.locator('.book-card[data-book="craft"]')).toHaveAttribute(
      "data-focused",
      "true",
    );
  });

  test("first tap focuses a different book, second tap opens it", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);

    const craft = page.locator('.book-card[data-book="craft"]');

    // First tap only previews.
    await craft.click();
    await page.waitForTimeout(300);
    expect(new URL(page.url()).pathname).toBe("/");
    await expect(craft).toHaveAttribute("data-focused", "true");

    // Second tap opens the previewed book.
    await craft.click();
    await page.waitForURL("**/craft");
    await expect(page.locator(".detail-title")).toHaveText("Craft");
  });
});
