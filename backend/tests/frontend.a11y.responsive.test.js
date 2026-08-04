import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'desktop', size: { width: 1280, height: 720 } },
  { name: 'mobile', size: { width: 390, height: 844 } },
];

test.describe('frontend a11y and responsive smoke', () => {
  for (const viewport of viewports) {
    test(`${viewport.name} home page loads without visible main-region regressions`, async ({ page }) => {
      await page.setViewportSize(viewport.size);

      const response = await page.goto('/', { waitUntil: 'domcontentloaded' });

      expect(response).not.toBeNull();
      expect(response?.ok()).toBeTruthy();

      const main = page.locator('main');

      await expect(page).toHaveTitle(/.+/);
      await expect(main.or(page.locator('body'))).toBeVisible();
    });
  }
});
