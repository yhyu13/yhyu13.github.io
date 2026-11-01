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
  test.describe(`screenshot ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of ROUTES) {
      test(`${route.name}`, async ({ page }) => {
        await page.goto(`http://localhost:5173${route.path}`);
        await page.waitForLoadState("networkidle");
        // Book transitions run 1100ms; wait for them to settle, plus lazy panels.
        await page.waitForTimeout(1400);
        await expect(page).toHaveScreenshot(
          `${viewport.name}-${route.name}.png`,
          { fullPage: true, maxDiffPixels: 120 },
        );
      });
    }
  });
}
