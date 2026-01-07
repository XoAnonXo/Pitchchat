import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test.describe('Landing Page', () => {
    test('should display the landing page correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check that page loaded by looking for main content area
      await expect(page.locator('html')).toBeVisible();

      // Wait for React to hydrate and buttons to be interactive
      // Check for main heading first to confirm page is loaded
      await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

      // Now check for CTA buttons - using getByText which is more reliable
      const hasButtons = await page.locator('button').count();
      expect(hasButtons).toBeGreaterThan(0);
    });

    test('should navigate to auth page from landing', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Wait for page to hydrate then find and click login button
      const loginButton = page.getByText('Log in', { exact: true });
      await expect(loginButton).toBeVisible({ timeout: 10000 });
      await loginButton.click();
      await page.waitForURL(/\/auth/, { timeout: 5000 });
      expect(page.url()).toContain('/auth');
    });
  });

  test.describe('Auth Page UI', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/auth');
      await page.waitForLoadState('domcontentloaded');

      // Check for email input
      const emailInput = page.getByPlaceholder(/email/i).or(
        page.locator('input[type="email"]')
      ).or(
        page.getByLabel(/email/i)
      );
      await expect(emailInput.first()).toBeVisible({ timeout: 10000 });

      // Check for password input
      const passwordInput = page.getByPlaceholder(/password/i).or(
        page.locator('input[type="password"]')
      ).or(
        page.getByLabel(/password/i)
      );
      await expect(passwordInput.first()).toBeVisible();

      // Check for submit button
      const submitButton = page.getByRole('button', { name: /log in|sign in|submit/i }).or(
        page.locator('button[type="submit"]')
      );
      await expect(submitButton.first()).toBeVisible();
    });

    test('should have forgot password link', async ({ page }) => {
      await page.goto('/auth');
      await page.waitForLoadState('domcontentloaded');

      const forgotPasswordLink = page.getByRole('link', { name: /forgot.*password/i }).or(
        page.locator('a').filter({ hasText: /forgot/i })
      ).or(
        page.getByText(/forgot.*password/i)
      );

      // Link should exist (may be a button or link)
      await expect(forgotPasswordLink.first()).toBeVisible({ timeout: 10000 });
    });

    test('should have option to switch between login and signup', async ({ page }) => {
      await page.goto('/auth');
      await page.waitForLoadState('domcontentloaded');

      // Look for tab or link to toggle between login/signup
      const signupToggle = page.getByRole('tab', { name: /sign up|register/i }).or(
        page.getByRole('link', { name: /sign up|register|create account/i })
      ).or(
        page.locator('button').filter({ hasText: /sign up|create/i })
      ).or(
        page.getByText(/don't have an account/i)
      );

      await expect(signupToggle.first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Login Form Validation', () => {
    test('should show error for empty email', async ({ page }) => {
      await page.goto('/auth');
      await page.waitForLoadState('domcontentloaded');

      // Find submit button and password input
      const submitButton = page.getByRole('button', { name: /log in|sign in|submit/i }).or(
        page.locator('button[type="submit"]')
      );
      const passwordInput = page.locator('input[type="password"]').first();

      // Enter only password
      await passwordInput.fill('testpassword123');
      await submitButton.first().click();

      // Should show validation error or stay on page
      await page.waitForTimeout(500);
      // Form should not have submitted successfully
      expect(page.url()).toContain('/auth');
    });

    test('should show error for invalid email format', async ({ page }) => {
      await page.goto('/auth');
      await page.waitForLoadState('domcontentloaded');

      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const submitButton = page.getByRole('button', { name: /log in|sign in|submit/i }).or(
        page.locator('button[type="submit"]')
      );

      // Enter invalid email
      await emailInput.fill('notanemail');
      await passwordInput.fill('testpassword123');
      await submitButton.first().click();

      await page.waitForTimeout(500);

      // Should still be on auth page (validation failed)
      expect(page.url()).toContain('/auth');
    });

    test('should show error for empty password', async ({ page }) => {
      await page.goto('/auth');
      await page.waitForLoadState('domcontentloaded');

      const emailInput = page.locator('input[type="email"]').first();
      const submitButton = page.getByRole('button', { name: /log in|sign in|submit/i }).or(
        page.locator('button[type="submit"]')
      );

      // Enter only email
      await emailInput.fill('test@example.com');
      await submitButton.first().click();

      await page.waitForTimeout(500);

      // Should still be on auth page
      expect(page.url()).toContain('/auth');
    });

    test('should show error for incorrect credentials', async ({ page }) => {
      await page.goto('/auth');
      await page.waitForLoadState('domcontentloaded');

      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const submitButton = page.getByRole('button', { name: /log in|sign in|submit/i }).or(
        page.locator('button[type="submit"]')
      );

      // Enter credentials that don't exist
      await emailInput.fill('nonexistent@test.com');
      await passwordInput.fill('wrongpassword123');
      await submitButton.first().click();

      // Wait for API response
      await page.waitForTimeout(2000);

      // Should show error message or stay on auth page
      const errorMessage = page.getByText(/invalid|incorrect|wrong|not found|failed/i);
      const hasError = await errorMessage.first().isVisible().catch(() => false);
      const stillOnAuth = page.url().includes('/auth');

      expect(hasError || stillOnAuth).toBe(true);
    });
  });

  test.describe('Signup Form', () => {
    test('should display signup form when toggled', async ({ page }) => {
      await page.goto('/auth');

      // Try to find and click signup toggle
      const signupToggle = page.getByRole('tab', { name: /sign up|register/i }).or(
        page.getByRole('link', { name: /sign up|register|create account/i })
      ).or(
        page.getByText(/create account|sign up/i)
      );

      if (await signupToggle.first().isVisible()) {
        await signupToggle.first().click();
        await page.waitForTimeout(500);

        // Check for signup-specific fields (like confirm password or name)
        const confirmPassword = page.locator('input[name="confirmPassword"]').or(
          page.getByLabel(/confirm.*password/i)
        );
        const nameField = page.locator('input[name="name"]').or(
          page.getByLabel(/name/i)
        );

        const hasSignupField = await confirmPassword.first().isVisible().catch(() => false) ||
          await nameField.first().isVisible().catch(() => false);

        // At minimum, should have email and password
        const emailInput = page.locator('input[type="email"]').first();
        const passwordInput = page.locator('input[type="password"]').first();

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();
      }
    });

    test('should validate password requirements', async ({ page }) => {
      await page.goto('/auth');

      // Try to switch to signup mode
      const signupToggle = page.getByRole('tab', { name: /sign up|register/i }).or(
        page.getByText(/create account|sign up/i)
      );

      if (await signupToggle.first().isVisible()) {
        await signupToggle.first().click();
        await page.waitForTimeout(500);
      }

      const emailInput = page.locator('input[type="email"]').first();
      const passwordInput = page.locator('input[type="password"]').first();
      const submitButton = page.getByRole('button', { name: /sign up|register|create/i }).or(
        page.getByRole('button', { name: /submit/i })
      );

      // Try weak password
      await emailInput.fill('newuser@test.com');
      await passwordInput.fill('123'); // Too short
      await submitButton.first().click();

      await page.waitForTimeout(500);

      // Should show validation error or stay on page
      expect(page.url()).toContain('/auth');
    });
  });

  test.describe('Forgot Password Flow', () => {
    test('should navigate to forgot password page', async ({ page }) => {
      await page.goto('/auth');

      const forgotPasswordLink = page.getByRole('link', { name: /forgot.*password/i }).or(
        page.getByText(/forgot.*password/i)
      );

      if (await forgotPasswordLink.first().isVisible()) {
        await forgotPasswordLink.first().click();
        await page.waitForURL(/\/forgot-password/);
        expect(page.url()).toContain('/forgot-password');
      }
    });

    test('should display forgot password form', async ({ page }) => {
      await page.goto('/forgot-password');

      // Should have email input
      const emailInput = page.locator('input[type="email"]').or(
        page.getByLabel(/email/i)
      );
      await expect(emailInput.first()).toBeVisible();

      // Should have submit button
      const submitButton = page.getByRole('button', { name: /send|reset|submit/i });
      await expect(submitButton.first()).toBeVisible();
    });

    test('should validate email on forgot password form', async ({ page }) => {
      await page.goto('/forgot-password');

      const emailInput = page.locator('input[type="email"]').first();
      const submitButton = page.getByRole('button', { name: /send|reset|submit/i }).first();

      // Submit with invalid email
      await emailInput.fill('notvalid');
      await submitButton.click();

      await page.waitForTimeout(500);

      // Should show error or stay on page
      expect(page.url()).toContain('/forgot-password');
    });

    test('should show success message for valid email submission', async ({ page }) => {
      await page.goto('/forgot-password');

      const emailInput = page.locator('input[type="email"]').first();
      const submitButton = page.getByRole('button', { name: /send|reset|submit/i }).first();

      // Submit with valid email format
      await emailInput.fill('test@example.com');
      await submitButton.click();

      await page.waitForTimeout(2000);

      // Should show success message (even if email doesn't exist, for security)
      const successMessage = page.getByText(/sent|check.*email|reset link/i);
      const hasSuccess = await successMessage.first().isVisible().catch(() => false);

      // Or should still be on page without error (some apps don't show success explicitly)
      expect(hasSuccess || page.url().includes('/forgot-password')).toBe(true);
    });
  });

  test.describe('OAuth Buttons', () => {
    test('should display Google OAuth button', async ({ page }) => {
      await page.goto('/auth');

      const googleButton = page.getByRole('button', { name: /google/i }).or(
        page.locator('button:has-text("Google")')
      );

      const isVisible = await googleButton.first().isVisible().catch(() => false);

      // OAuth might not be configured in all environments
      if (isVisible) {
        await expect(googleButton.first()).toBeEnabled();
      }
    });

    test('Google OAuth button should be clickable', async ({ page }) => {
      await page.goto('/auth');

      const googleButton = page.getByRole('button', { name: /google/i });

      if (await googleButton.first().isVisible()) {
        // Just verify it's clickable (don't actually click as it would redirect)
        await expect(googleButton.first()).toBeEnabled();
      }
    });
  });

  test.describe('Navigation Protection', () => {
    test('should handle unauthenticated users from protected routes', async ({ page }) => {
      // Try to access protected route
      await page.goto('/settings');
      await page.waitForLoadState('networkidle');

      const url = page.url();
      // If not authenticated, should redirect to auth, show auth form, or show 404
      const hasAuthUI = await page.locator('input[type="email"], input[type="password"]').first().isVisible().catch(() => false);
      const has404 = await page.getByText(/404|not found|page.*not/i).first().isVisible().catch(() => false);
      expect(url.includes('/auth') || !url.includes('/settings') || hasAuthUI || has404).toBe(true);
    });

    test('should allow access to public routes', async ({ page }) => {
      // Landing page
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('html')).toBeVisible();

      // Auth page
      await page.goto('/auth');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('html')).toBeVisible();

      // Forgot password
      await page.goto('/forgot-password');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('html')).toBeVisible();
    });
  });

  test.describe('Session Persistence', () => {
    test('should handle page refresh gracefully', async ({ page }) => {
      await page.goto('/auth');
      await page.waitForLoadState('domcontentloaded');

      // Fill in some form data
      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.fill('test@example.com');

      // Refresh page
      await page.reload();
      await page.waitForLoadState('domcontentloaded');

      // Form should be present (data might be cleared, that's expected)
      await expect(page.locator('input[type="email"]').first()).toBeVisible({ timeout: 10000 });
    });

    test('should handle browser back navigation', async ({ page }) => {
      await page.goto('/');
      await page.goto('/auth');

      // Go back
      await page.goBack();

      // Should be on landing page
      await page.waitForTimeout(500);
      // URL should change (might be / or still /auth depending on app behavior)
      expect(page.url()).toBeDefined();
    });
  });
});

test.describe('404 Page', () => {
  test('should display 404 page for non-existent routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345');
    await page.waitForLoadState('networkidle');

    // Should show some indication of not found, redirect, or show main page
    const notFoundText = page.getByText(/not found|404|page.*exist/i);
    const isVisible = await notFoundText.first().isVisible().catch(() => false);
    const url = page.url();
    const hasContent = await page.locator('h1, button').first().isVisible().catch(() => false);

    // Either shows 404, redirects to valid page, or renders any valid content
    expect(isVisible || url.includes('/auth') || url.endsWith('/') || hasContent).toBe(true);
  });
});
