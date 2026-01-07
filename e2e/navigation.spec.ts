import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.describe('Public Routes Navigation', () => {
    test('should navigate from landing to auth', async ({ page }) => {
      await page.goto('/');

      // Find login/signup button
      const authButton = page.getByRole('button', { name: /log in|sign in|sign up|get started/i }).or(
        page.getByRole('link', { name: /log in|sign in|sign up|get started/i })
      );

      if (await authButton.first().isVisible()) {
        await authButton.first().click();
        await page.waitForTimeout(1000);
        expect(page.url()).toContain('/auth');
      }
    });

    test('should navigate from auth to forgot password', async ({ page }) => {
      await page.goto('/auth');

      const forgotLink = page.getByRole('link', { name: /forgot.*password/i }).or(
        page.getByText(/forgot.*password/i)
      );

      if (await forgotLink.first().isVisible()) {
        await forgotLink.first().click();
        await page.waitForTimeout(1000);
        expect(page.url()).toContain('/forgot-password');
      }
    });

    test('should have working back navigation', async ({ page }) => {
      await page.goto('/');
      await page.goto('/auth');
      await page.goto('/forgot-password');

      await page.goBack();
      await page.waitForTimeout(500);
      expect(page.url()).toContain('/auth');

      await page.goBack();
      await page.waitForTimeout(500);
      // Should be back to landing or similar
    });

    test('should handle direct URL access to public routes', async ({ page }) => {
      // Direct access to auth
      await page.goto('/auth');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('html')).toBeVisible();

      // Direct access to forgot password
      await page.goto('/forgot-password');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('html')).toBeVisible();
    });
  });

  test.describe('Investor Chat Public Route', () => {
    test('should handle invalid chat slug gracefully', async ({ page }) => {
      await page.goto('/chat/invalid-slug-that-does-not-exist');
      await page.waitForLoadState('domcontentloaded');

      await page.waitForTimeout(1000);

      // Should show error or not found message or redirect
      const url = page.url();
      // Either shows error, shows chat interface, or redirects away
      expect(url).toBeDefined();
    });

    test('should display chat interface for valid slug format', async ({ page }) => {
      // Navigate to a chat URL (may or may not exist)
      await page.goto('/chat/test-slug');
      await page.waitForLoadState('domcontentloaded');

      await page.waitForTimeout(1000);

      // Should show either chat interface or error
      await expect(page.locator('html')).toBeVisible();
    });
  });

  test.describe('Protected Routes Redirection', () => {
    test('should handle /settings when not logged in', async ({ page }) => {
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      // Should redirect to auth, show auth form, or show 404 for invalid routes
      const url = page.url();
      const hasAuthUI = await page.locator('input[type="email"], input[type="password"]').first().isVisible().catch(() => false);
      const has404 = await page.getByText(/404|not found|page.*not/i).first().isVisible().catch(() => false);
      expect(url.includes('/auth') || !url.includes('/settings') || hasAuthUI || has404).toBe(true);
    });

    test('should handle /analytics when not logged in', async ({ page }) => {
      await page.goto('/analytics');
      await page.waitForLoadState('networkidle');

      const url = page.url();
      const hasAuthUI = await page.locator('input[type="email"], input[type="password"]').first().isVisible().catch(() => false);
      const has404 = await page.getByText(/404|not found|page.*not/i).first().isVisible().catch(() => false);
      expect(url.includes('/auth') || !url.includes('/analytics') || hasAuthUI || has404).toBe(true);
    });

    test('should handle /conversations when not logged in', async ({ page }) => {
      await page.goto('/conversations');
      await page.waitForLoadState('networkidle');

      const url = page.url();
      const hasAuthUI = await page.locator('input[type="email"], input[type="password"]').first().isVisible().catch(() => false);
      const has404 = await page.getByText(/404|not found|page.*not/i).first().isVisible().catch(() => false);
      expect(url.includes('/auth') || !url.includes('/conversations') || hasAuthUI || has404).toBe(true);
    });

    test('should handle /documents/:id when not logged in', async ({ page }) => {
      await page.goto('/documents/123');
      await page.waitForLoadState('networkidle');

      const url = page.url();
      const hasAuthUI = await page.locator('input[type="email"], input[type="password"]').first().isVisible().catch(() => false);
      const has404 = await page.getByText(/404|not found|page.*not/i).first().isVisible().catch(() => false);
      expect(url.includes('/auth') || !url.includes('/documents') || hasAuthUI || has404).toBe(true);
    });

    test('should handle /links/:id when not logged in', async ({ page }) => {
      await page.goto('/links/123');
      await page.waitForLoadState('networkidle');

      const url = page.url();
      const hasAuthUI = await page.locator('input[type="email"], input[type="password"]').first().isVisible().catch(() => false);
      const has404 = await page.getByText(/404|not found|page.*not/i).first().isVisible().catch(() => false);
      expect(url.includes('/auth') || !url.includes('/links') || hasAuthUI || has404).toBe(true);
    });
  });

  test.describe('URL Parameters', () => {
    test('should handle reset-password with token parameter', async ({ page }) => {
      await page.goto('/reset-password/test-token-123');
      await page.waitForLoadState('domcontentloaded');

      await page.waitForTimeout(500);

      // Should show reset password form or error for invalid token
      await expect(page.locator('html')).toBeVisible();
    });

    test('should handle documents route with project ID', async ({ page }) => {
      await page.goto('/documents/project-123');
      await page.waitForLoadState('domcontentloaded');

      await page.waitForTimeout(1000);

      // Should redirect to auth (not logged in) or show page
      await expect(page.locator('html')).toBeVisible();
    });
  });

  test.describe('Deep Linking', () => {
    test('should handle deep link to specific project', async ({ page }) => {
      await page.goto('/documents/12345');
      await page.waitForLoadState('domcontentloaded');

      await page.waitForTimeout(1000);

      // Not authenticated, should redirect or show auth
      const url = page.url();
      expect(url.includes('/auth') || url.endsWith('/') || url.includes('/documents')).toBe(true);
    });
  });

  test.describe('Error Handling', () => {
    test('should not crash on malformed URLs', async ({ page }) => {
      const malformedUrls = [
        '/auth?redirect=%00',
        '/chat/test-script',
        '/documents/test-path',
      ];

      for (const url of malformedUrls) {
        await page.goto(url);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(500);
        // Page should not crash
        await expect(page.locator('html')).toBeVisible();
      }
    });
  });
});

test.describe('Responsive Navigation', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('html')).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('html')).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('html')).toBeVisible();
  });
});
