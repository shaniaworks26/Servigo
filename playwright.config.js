import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './backend/tests',
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: true,
  use: {
    baseURL: process.env.FRONTEND_URL || 'http://127.0.0.1:4173',
    actionTimeout: 15000,
    ignoreHTTPSErrors: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
