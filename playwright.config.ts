import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 3,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 30000, // 30 second timeout per test

  use: {
    baseURL: 'http://localhost:5050',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Increased timeouts for React hydration
    actionTimeout: 15000,
    navigationTimeout: 20000,
  },

  // Only test on Chromium for now (most reliable)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'PORT=5050 npm run dev',
    url: 'http://localhost:5050',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
