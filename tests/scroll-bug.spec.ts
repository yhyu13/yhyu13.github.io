import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5173";

test.describe("mobile detail vertical scroll", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  for (const [path, pane] of [
    ["/craft", ".craft-shelf-scroll"],
    ["/archive", ".detail-scroll"],
    ["/courses", ".course-shelf"],
    ["/decks", ".deck-shelf"],
  ] as const) {
    test(`${path} scrolls down and back to the top`, async ({ page }) => {
      await page.goto(`${BASE}${path}`);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1500);

      const html = page.locator("html");
      expect(await html.evaluate((el) => el.scrollTop)).toBe(0);

      await html.evaluate((el) => el.scrollBy({ top: 400, behavior: "instant" }));
      await page.waitForTimeout(250);
      const down = await html.evaluate((el) => el.scrollTop);
      expect(down).toBeGreaterThan(50);

      await html.evaluate((el) => el.scrollBy({ top: -2000, behavior: "instant" }));
      await page.waitForTimeout(250);
      expect(await html.evaluate((el) => el.scrollTop)).toBe(0);

      // The pane must not be a nested scroll container that swallows the
      // touch gesture.
      const overflow = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el).overflowY : null;
      }, pane);
      expect(overflow).toBe("visible");

      await expect(page.locator(".close-button")).toBeVisible();
    });
  }
});

test.describe("mobile shelf rail", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("is a horizontal snap rail with the centre cover focused", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(900);

    const metrics = await page.locator(".gallery").evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        scrollSnapType: cs.scrollSnapType,
        overflowX: cs.overflowX,
        focused: document
          .querySelector('.book-card[data-focused="true"]')
          ?.getAttribute("data-book"),
      };
    });
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
    expect(metrics.scrollSnapType).toContain("x");
    expect(metrics.overflowX).toBe("auto");
    expect(metrics.focused).toBe("archive");
  });

  test("scrolling the rail moves focus without navigating", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(900);

    await page.locator(".gallery").evaluate((el) => {
      const card = el.querySelector('.book-card[data-book="decks"]') as HTMLElement | null;
      if (!card) throw new Error("no decks card");
      el.scrollLeft = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
      el.dispatchEvent(new Event("scroll"));
    });
    await page.waitForTimeout(500);

    expect(new URL(page.url()).pathname).toBe("/");
    await expect(page.locator('.book-card[data-book="decks"]')).toHaveAttribute(
      "data-focused",
      "true",
    );
    await expect(page.locator('.book-card[data-book="archive"]')).toHaveAttribute(
      "data-focused",
      "false",
    );
  });

  test("one tap opens a cover", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(900);

    await page.locator('.book-card[data-book="craft"]').tap();
    await page.waitForURL("**/craft");
    await expect(page.locator(".detail-title")).toHaveText("Craft");
  });

  test("recentres the focused cover on orientation change", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(900);

    await page.locator(".gallery").evaluate((el) => {
      const card = el.querySelector('.book-card[data-book="decks"]') as HTMLElement | null;
      if (!card) throw new Error("no decks card");
      el.scrollLeft = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
      el.dispatchEvent(new Event("scroll"));
    });
    await page.waitForTimeout(500);
    await expect(page.locator('.book-card[data-book="decks"]')).toHaveAttribute(
      "data-focused",
      "true",
    );

    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(800);

    const centered = await page.locator(".gallery").evaluate((el) => {
      const cards = Array.from(el.querySelectorAll(".book-card")) as HTMLElement[];
      const center = el.scrollLeft + el.clientWidth / 2;
      let best: HTMLElement | null = null;
      let bestDistance = Number.POSITIVE_INFINITY;
      for (const card of cards) {
        const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = card;
        }
      }
      return best?.getAttribute("data-book") ?? null;
    });
    expect(centered).toBe("decks");
    await expect(page.locator('.book-card[data-book="decks"]')).toHaveAttribute(
      "data-focused",
      "true",
    );
  });

  test("a real touch swipe moves the rail and focus", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(900);

    const before = await page.locator(".gallery").evaluate((el) => el.scrollLeft);
    const client = await page.context().newCDPSession(page);
    const y = 500;
    await client.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 320, y }],
    });
    for (let x = 300; x >= 100; x -= 20) {
      await client.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x, y }],
      });
      await page.waitForTimeout(16);
    }
    await client.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await page.waitForTimeout(900);

    const after = await page.locator(".gallery").evaluate((el) => el.scrollLeft);
    expect(after).toBeGreaterThan(before + 40);
    expect(new URL(page.url()).pathname).toBe("/");
    await expect(page.locator('.book-card[data-book="decks"]')).toHaveAttribute(
      "data-focused",
      "true",
    );
  });
});
