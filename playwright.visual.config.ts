import baseConfig from "./playwright.config";

/** Visual-only config: `npm run test:visual`. */
export default {
  ...baseConfig,
  testIgnore: [],
  testMatch: "**/screenshots.spec.ts",
};
