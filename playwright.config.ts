import { defineConfig } from "@playwright/test";

const useExistingPreview = process.env.PLAYWRIGHT_USE_EXISTING_SERVER === "1";
const previewBaseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  expect: {
    timeout: 10_000
  },
  use: {
    baseURL: previewBaseUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off"
  },
  webServer: useExistingPreview
    ? undefined
    : {
        command: "npm run serve",
        url: previewBaseUrl,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000
      },
  projects: [
    {
      name: "mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 1
      }
    },
    {
      name: "tablet",
      use: {
        browserName: "chromium",
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 1
      }
    },
    {
      name: "desktop",
      use: {
        browserName: "chromium",
        viewport: { width: 1440, height: 1200 },
        deviceScaleFactor: 1
      }
    }
  ]
});
