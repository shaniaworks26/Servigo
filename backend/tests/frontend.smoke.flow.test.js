import { test, expect } from '@playwright/test';

test.describe('frontend smoke flow', () => {
  test('home page loads successfully', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });

    expect(response).not.toBeNull();
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveURL(/\/?$/);
  });
});
