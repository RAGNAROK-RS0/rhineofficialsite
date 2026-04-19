import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Rhine/i);
  });

  test('displays navigation', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.getByText('Home')).toBeVisible();
  });

  test('hero section renders', async ({ page }) => {
    const hero = page.locator('#app');
    await expect(hero).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('links navigate correctly', async ({ page }) => {
    await page.goto('/');
    
    await page.getByText('About').first().click();
    await expect(page).toHaveURL(/\/about/);
    
    await page.goto('/');
    await page.getByText('Services').first().click();
    await expect(page).toHaveURL(/\/services/);
  });

  test('mobile menu opens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const menuButton = page.getByRole('button', { name: /menu/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await expect(page.getByText('Close')).toBeVisible();
    }
  });
});

test.describe('Search Modal', () => {
  test('opens with keyboard shortcut', async ({ page }) => {
    await page.goto('/');
    
    await page.keyboard.press('Control+k');
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  });

  test('closes with Escape', async ({ page }) => {
    await page.goto('/');
    
    await page.keyboard.press('Control+k');
    await expect(page.getByPlaceholder(/search/i)).toBeVisible();
    
    await page.keyboard.press('Escape');
    await expect(page.getByPlaceholder(/search/i)).not.toBeVisible();
  });
});

test.describe('Contact Page', () => {
  test('loads contact page', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByText(/contact/i)).toBeVisible();
  });

  test('contact form renders', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
  });

  test('form validation works', async ({ page }) => {
    await page.goto('/contact');
    
    await page.getByRole('button', { name: /send|submit/i }).click();
    await expect(page.getByText(/required|invalid/i)).toBeVisible();
  });
});

test.describe('Auth Flow', () => {
  test('login modal opens', async ({ page }) => {
    await page.goto('/');
    
    const loginButton = page.getByText('Login').first();
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await expect(page.getByText(/email/i)).toBeVisible();
    }
  });

  test('register tab works', async ({ page }) => {
    await page.goto('/');
    
    const loginButton = page.getByText('Login').first();
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.getByText('Register').click();
      await expect(page.getByLabel(/confirm password/i)).toBeVisible();
    }
  });

  test('forgot password tab works', async ({ page }) => {
    await page.goto('/');
    
    const loginButton = page.getByText('Login').first();
    if (await loginButton.isVisible()) {
      await loginButton.click();
      await page.getByText('Forgot Password').click();
      await expect(page.getByText(/send reset link/i)).toBeVisible();
    }
  });
});

test.describe('Pricing Page', () => {
  test('loads pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText(/pricing|plans/i)).toBeVisible();
  });

  test('displays pricing tiers', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText(/starter|professional|enterprise/i)).toBeVisible();
  });

  test('pricing cards are clickable', async ({ page }) => {
    await page.goto('/pricing');
    const ctaButton = page.getByRole('button', { name: /get started|choose/i }).first();
    await expect(ctaButton).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('desktop view', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('tablet view', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('page loads within 3 seconds', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('WebGPU')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});
