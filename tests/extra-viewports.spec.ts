import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:5173";

type ViewportSpec = {
  name: string;
  width: number;
  height: number;
  hasTouch: boolean;
};

const VIEWPORTS: ViewportSpec[] = [
  { name: "small-phone-320x568", width: 320, height: 568, hasTouch: false },
  { name: "iphone14-390x844", width: 390, height: 844, hasTouch: false },
  { name: "ipad-air-portrait-820x1180", width: 820, height: 1180, hasTouch: false },
  { name: "ipad-air-landscape-1180x820", width: 1180, height: 820, hasTouch: false },
  { name: "phone-landscape-812x375", width: 812, height: 375, hasTouch: true },
];

const ROUTES = ["/", "/craft", "/archive", "/decks", "/courses"] as const;

const BOOKS = ["identity", "craft", "archive", "decks", "courses"] as const;

const PANEL_MARKER: Record<string, string> = {
  "/": ".gallery",
  "/craft": ".craft-shelf",
  "/archive": ".detail-panel",
  "/decks": ".deck-shelf",
  "/courses": ".course-shelf",
};

async function settle(page: Page, route: string) {
  await page.waitForLoadState("networkidle");
  const marker = PANEL_MARKER[route];
  if (marker) await expect(page.locator(marker).first()).toBeAttached();
  // Lazy panels mount on their own chunk; let transitions finish before measuring.
  await page.waitForTimeout(700);
}

async function overflow(page: Page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
}

for (const viewport of VIEWPORTS) {
  test.describe(`viewport ${viewport.name}`, () => {
    test.use({
      viewport: { width: viewport.width, height: viewport.height },
      hasTouch: viewport.hasTouch,
    });

    for (const route of ROUTES) {
      test(`${route} fits the viewport and keeps its key elements visible`, async ({ page }) => {
        await page.goto(`${BASE}${route}`);
        await settle(page, route);

        const { scrollWidth, clientWidth } = await overflow(page);
        expect(
          scrollWidth,
          `horizontal overflow on ${route} at ${viewport.width}x${viewport.height}: scrollWidth=${scrollWidth} clientWidth=${clientWidth}`,
        ).toBeLessThanOrEqual(clientWidth);

        await expect(page.locator(".brand")).toBeVisible();

        if (route === "/") {
          await expect(page.locator(".book-card")).toHaveCount(5);
          for (const book of BOOKS) {
            await expect(page.locator(`.book-card[data-book="${book}"]`)).toBeVisible();
          }
        } else {
          await expect(page.locator(".close-button")).toBeVisible();
          await expect(page.locator(".book-card.selected")).toBeVisible();
          await expect(page.locator(".book-card.selected")).toHaveCount(1);
        }
      });
    }
  });
}

test.describe("landscape phone geometry at 812x375", () => {
  test.use({ viewport: { width: 812, height: 375 }, hasTouch: true });

  test("all books stay inside the viewport height", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(900);
    const boxes = await page.locator(".book-card").evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { book: el.getAttribute("data-book"), top: r.top, bottom: r.bottom };
      }),
    );
    for (const box of boxes) {
      expect(box.top, `${box.book} top`).toBeGreaterThanOrEqual(-1);
      expect(box.bottom, `${box.book} bottom`).toBeLessThanOrEqual(378);
    }
  });

  test("detail book does not overlap its shelf", async ({ page }) => {
    await page.goto(`${BASE}/craft`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1200);
    const geometry = await page.evaluate(() => {
      const book = document.querySelector(".book-card.selected")?.getBoundingClientRect();
      const shelf = document.querySelector(".craft-shelf")?.getBoundingClientRect();
      return book && shelf ? { bookBottom: book.bottom, shelfTop: shelf.top } : null;
    });
    expect(geometry).not.toBeNull();
    expect(geometry!.bookBottom).toBeLessThanOrEqual(geometry!.shelfTop + 2);
  });
});

test.describe("tablet landscape touch at 1180x820", () => {
  test.use({ viewport: { width: 1180, height: 820 }, hasTouch: true });

  test("one tap opens a book (no invisible preview step)", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(900);
    await page.locator('.book-card[data-book="identity"]').tap();
    await page.waitForURL("**/identity");
    expect(new URL(page.url()).pathname).toBe("/identity");
  });
});

test.describe("touch shelf behaviour at 390x844", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("brand link meets the 44px touch target", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");
    const box = await page.locator(".brand").boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("rail scroll focuses the centred cover without navigating", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);

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
    await page.waitForTimeout(800);

    const identity = page.locator('.book-card[data-book="identity"]');
    await identity.tap();
    await page.waitForURL("**/identity");
    expect(new URL(page.url()).pathname).toBe("/identity");
  });

  test("craft detail scrolls down and returns to the top", async ({ page }) => {
    await page.goto(`${BASE}/craft`);
    await settle(page, "/craft");

    const html = page.locator("html");
    expect(await html.evaluate((el) => el.scrollTop)).toBe(0);

    await html.evaluate((el) => el.scrollBy({ top: 500, behavior: "instant" }));
    await page.waitForTimeout(250);
    const afterDown = await html.evaluate((el) => el.scrollTop);

    await html.evaluate((el) => el.scrollBy({ top: -2000, behavior: "instant" }));
    await page.waitForTimeout(250);
    const afterUp = await html.evaluate((el) => el.scrollTop);

    test.info().annotations.push({
      type: "measurement",
      description: `scrollTop after +500px = ${afterDown}, after -2000px = ${afterUp}`,
    });

    expect(afterUp).toBe(0);
    await expect(page.locator(".close-button")).toBeVisible();
  });
});
