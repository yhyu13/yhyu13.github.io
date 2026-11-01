import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  // Pixel screenshots are local evidence with gitignored baselines; run them
  // with `npm run test:visual`, not the default e2e pass.
  testIgnore: ["**/screenshots.spec.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  snapshotPathTemplate: "tests/screenshots.spec.ts-snapshots/{arg}{ext}",
  reporter: "list",
  timeout: 60000,
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    actionTimeout: 20000,
  },
  webServer: {
    command: "npx vite --port 5173",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  expect: {
    timeout: 15000,
  },
});
