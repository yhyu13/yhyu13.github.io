import { test, expect } from "@playwright/test";

test.describe("in-site QR", () => {
  test("uses the current origin on a local preview", async ({ page }) => {
    await page.goto("http://localhost:5173/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(400);

    await page.locator(".qr-trigger").click();
    await page.waitForSelector(".qr-image");

    const origin = new URL(page.url()).origin;
    expect(origin).not.toBe("https://yhyu13.github.io");

    await expect(page.locator(".qr-url")).toHaveText(origin);
    await expect(page.locator(".qr-image")).toHaveAttribute(
      "alt",
      `QR code for ${origin}`,
    );
  });
});
