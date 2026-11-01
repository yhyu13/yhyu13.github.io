import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "phone-portrait", width: 375, height: 812 },
  { name: "tablet-portrait", width: 768, height: 1024 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
] as const;

const ROUTES = [
  { path: "/", name: "home" },
  { path: "/identity", name: "identity-detail" },
  { path: "/craft", name: "craft-detail" },
  { path: "/archive", name: "archive-detail" },
  { path: "/decks", name: "decks-detail" },
  { path: "/courses", name: "courses-detail" },
] as const;

for (const viewport of VIEWPORTS) {
  test.describe(`viewport ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of ROUTES) {
      test(`${route.name} has no horizontal overflow and key elements visible`, async ({ page }) => {
        await page.goto(`http://localhost:5173${route.path}`);
        await page.waitForLoadState("networkidle");
        // Wait for CSS transitions / lazy panels to settle.
        await page.waitForTimeout(600);

        // No horizontal overflow.
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

        // Brand and at least one book card exist.
        await expect(page.locator(".brand")).toBeVisible();
        await expect(page.locator(".book-card").first()).toBeVisible();

        // On detail routes, the close button is in the DOM.
        if (route.path !== "/") {
          await expect(page.locator(".close-button")).toBeVisible();
        }
      });
    }
  });
}

test.describe("touch affordance", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true });

  test("Read badge is visible on touch devices", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(300);
    const firstBook = page.locator(".book-card").first();
    await expect(firstBook.locator(".open-badge")).toBeVisible();
  });
});

test.describe("deck reader touch", () => {
  test.use({ viewport: { width: 375, height: 812 }, hasTouch: true });

  test("deck reader renders without horizontal overflow", async ({ page }) => {
    // Use a known deck slug from the data; if it changes, update here.
    await page.goto("http://localhost:5173/decks/atlas-fei-fei-li-world-model");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(600);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});
