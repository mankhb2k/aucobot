import { defineConfig, devices } from "@playwright/test";

const PORT = 8386;
const baseURL = `http://localhost:${PORT}`;

const config = defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL,
  },
  webServer: {
    command: "pnpm dev",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

export { config as default };
