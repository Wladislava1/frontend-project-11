// @ts-check
import { test, expect } from '@playwright/test';

test('has title', ({ page }) => {
  page.goto('https://playwright.dev/').then(() => {
    expect(page).toHaveTitle(/Playwright/);
  });
});

test('get started link', ({ page }) => {
  page.goto('https://playwright.dev/').then(() => {
    page.getByRole('link', { name: 'Get started' }).click().then(() => {
      expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
    });
  });
});
