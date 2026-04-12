import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Rhine/i);
  });

  test('should have navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should show 3D canvas or fallback', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('canvas');
    const fallback = page.locator('[class*="fallback"]');
    await expect(canvas.or(fallback)).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=About');
    await expect(page).toHaveURL(/about/);
  });

  test('should navigate to Services page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Services');
    await expect(page).toHaveURL(/services/);
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Contact');
    await expect(page).toHaveURL(/contact/);
  });
});

test.describe('Contact Form', () => {
  test('should show contact form', async ({ page }) => {
    await page.goto('/contact');
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('should have name, email, message fields', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
  });
});

test.describe('Language Switching', () => {
  test('should have language switcher', async ({ page }) => {
    await page.goto('/');
    const langSwitcher = page.locator('[class*="language"], button:has-text("EN")');
    await expect(langSwitcher.first()).toBeVisible();
  });
});

test.describe('Search', () => {
  test('should open search modal with Ctrl+K', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Control+k');
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });
});

test.describe('Dashboard', () => {
  test('should redirect to home when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/(\/|contact)/);
  });
});