import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const canonical = readFileSync(new URL("../public/profile/hang-yu.md", import.meta.url), "utf8");
const pdf = readFileSync(new URL("../public/profile/hang-yu.pdf", import.meta.url));
const hash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");

test.use({ reducedMotion: "reduce" });

test("canonical profile renders safely and native downloads match real bytes", async ({ page }) => {
  await page.goto("/identity");
  await expect(page.getByRole("heading", { name: "俞航 · Hang (Yohan) Yu" })).toBeVisible();
  for (const block of canonical.trim().split(/\r?\n/).filter(Boolean)) {
    await expect(page.locator(".profile-text")).toContainText(block.replace(/^#{1,2} |^- |^> /g, "").replace(/\*\*/g, ""));
  }
  await expect(page.locator(".identity-photo")).toBeVisible();
  await expect(page.locator(".bottom-dock a")).toHaveCount(2);
  await expect(page.getByRole("link", { name: "Zhihu", exact: true })).toHaveAttribute("href", "https://www.zhihu.com/people/ao-ta-kang-007");
  await expect(page.getByRole("link", { name: "Bilibili", exact: true })).toHaveAttribute("href", "https://space.bilibili.com/1526329479");
  for (const [name, expected, filename] of [
    ["下载 PDF", pdf, "hang-yu.pdf"],
    ["下载 Markdown", Buffer.from(canonical), "hang-yu.md"],
  ] as const) {
    const anchor = page.getByRole("link", { name, exact: true });
    await expect(anchor).toHaveAttribute("href", `/profile/${filename}`);
    await expect(anchor).toHaveAttribute("download", filename);
    const pending = page.waitForEvent("download");
    await anchor.click();
    const download = await pending;
    expect(download.suggestedFilename()).toBe(filename);
    const path = await download.path();
    expect(path).not.toBeNull();
    expect(hash(readFileSync(path!))).toBe(hash(expected));
    expect(new URL(page.url()).pathname).toBe("/identity");
  }
});

test("clipboard awaits success and copies the exact fetched Markdown", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: {
      writeText: (text: string) => new Promise<void>((resolve) => {
        Object.assign(window, { copiedProfile: text, finishProfileCopy: resolve });
      }),
    } });
  });
  await page.goto("/identity");
  await page.getByRole("button", { name: "复制给 Agent" }).click();
  await expect(page.getByRole("button", { name: "正在复制…" })).toBeDisabled();
  await expect(page.locator(".profile-status")).not.toContainText("已复制");
  expect(await page.evaluate(() => (window as unknown as { copiedProfile: string }).copiedProfile)).toBe(canonical);
  await page.evaluate(() => (window as unknown as { finishProfileCopy: () => void }).finishProfileCopy());
  await expect(page.locator(".profile-status")).toContainText("已复制公开介绍");
});

for (const mode of ["rejected", "unavailable"] as const) {
  test(`clipboard ${mode} exposes focused selected readonly fallback`, async ({ page }) => {
    await page.addInitScript((mode) => {
      Object.defineProperty(navigator, "clipboard", { configurable: true, value: mode === "unavailable" ? undefined : {
        writeText: () => Promise.reject(new Error("Permission denied")),
      } });
    }, mode);
    await page.goto("/identity");
    await page.getByRole("button", { name: "复制给 Agent" }).click();
    const fallback = page.getByRole("textbox", { name: "手动复制 Markdown" });
    await expect(fallback).toBeFocused();
    await expect(fallback).toHaveValue(canonical);
    await expect(fallback).toHaveAttribute("readonly", "");
    expect(await fallback.evaluate((el: HTMLTextAreaElement) => [el.selectionStart, el.selectionEnd])).toEqual([0, canonical.length]);
    await expect(page.locator(".profile-status")).toContainText("自动复制不可用");
    await expect(page.locator(".profile-status")).not.toContainText("已复制");
  });
}

test("failed fetch disables copying; retry recovers canonical source", async ({ page }) => {
  let fail = true;
  await page.route("**/profile/hang-yu.md", async (route) => {
    // StrictMode may mount/abort/remount in development: fail until retry.
    if (fail) await route.fulfill({ status: 503, body: "Unavailable" });
    else await route.continue();
  });
  await page.goto("/identity");
  await expect(page.locator(".profile-status")).toContainText("加载失败");
  await expect(page.getByRole("button", { name: "复制给 Agent" })).toBeDisabled();
  await expect(page.getByRole("link", { name: "下载 Markdown" })).toBeVisible();
  fail = false;
  await page.getByRole("button", { name: "重新加载" }).click();
  await expect(page.getByRole("heading", { name: "工作方法" })).toBeVisible();
  await expect(page.getByRole("button", { name: "复制给 Agent" })).toBeEnabled();
});

test("restricted Markdown never injects HTML or interprets unsafe links", async ({ page }) => {
  await page.route("**/profile/hang-yu.md", (route) => route.fulfill({ body: '# Safe\n\n<script>window.injected=true</script>\n\n[unsafe](javascript:alert(1))\n\n- **Bold**\n\n> Quote' }));
  await page.goto("/identity");
  await expect(page.locator(".profile-text")).toContainText("<script>");
  await expect(page.locator(".profile-text script, .profile-text a")).toHaveCount(0);
  await expect(page.locator(".profile-text strong")).toHaveText("Bold");
  expect(await page.evaluate(() => "injected" in window)).toBe(false);
});

test("leaving during load aborts the request without stale content", async ({ page }) => {
  let requested = false;
  await page.route("**/profile/hang-yu.md", async (route) => {
    requested = true;
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.fulfill({ body: canonical }).catch(() => {});
  });
  await page.goto("/identity");
  await expect.poll(() => requested).toBe(true);
  await page.getByRole("button", { name: "Close detail view" }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".identity-profile")).toHaveCount(0);
});

for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 812, height: 375 }, { width: 1440, height: 900 }]) {
  test(`profile controls and final text reachable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/identity");
    const last = page.locator(".profile-text p").last();
    await expect(last).toHaveText("最后更新：2026-11-09。");
    await last.scrollIntoViewIfNeeded();
    await expect(last).toBeInViewport();
    await page.getByRole("link", { name: "下载 PDF" }).scrollIntoViewIfNeeded();
    for (const el of await page.locator(".profile-actions .pill").all()) {
      const box = await el.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
    await page.getByRole("link", { name: "下载 PDF" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "下载 Markdown" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "复制给 Agent" })).toBeFocused();
  });
}
