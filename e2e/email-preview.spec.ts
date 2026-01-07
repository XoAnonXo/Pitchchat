import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Email Templates Preview', () => {
  test('should display all 8 email templates correctly', async ({ page }) => {
    // Open the local HTML file
    const filePath = path.resolve(__dirname, '../email-preview.html');
    await page.goto(`file://${filePath}`);

    // Wait for fonts to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verify page title
    await expect(page.locator('h1').first()).toHaveText('PitchChat Email Templates');

    // Count email templates
    const emailWrappers = page.locator('.email-wrapper');
    await expect(emailWrappers).toHaveCount(15);

    // Verify each email type is present
    const emailLabels = [
      '1. Welcome Email',
      '2. Email Verification',
      '3. Password Reset',
      '4. Password Changed',
      '5. Payment Receipt',
      '6. Payment Failed',
      '7. Trial Expiring',
      '8. Subscription Canceled',
      '9. Investor Engagement',
      '10. Founder Contact Alert',
      '11. Investor Contact Email',
      '12. Weekly Report',
      '13. Document Processed',
      '14. Usage Limit Warning',
      '15. Account Deletion'
    ];

    for (const label of emailLabels) {
      await expect(page.locator('.email-label', { hasText: label })).toBeVisible();
    }

    // Take full page screenshot
    await page.screenshot({
      path: 'e2e/screenshots/email-templates-full.png',
      fullPage: true
    });

    // Take individual screenshots of each email
    for (let i = 0; i < 15; i++) {
      const wrapper = emailWrappers.nth(i);
      await wrapper.screenshot({
        path: `e2e/screenshots/email-template-${i + 1}.png`
      });
    }

    console.log('Screenshots saved to e2e/screenshots/');
  });

  test('should have correct styling elements', async ({ page }) => {
    const filePath = path.resolve(__dirname, '../email-preview.html');
    await page.goto(`file://${filePath}`);
    await page.waitForLoadState('networkidle');

    // Check for logo presence in all templates
    const logos = page.locator('.logo-icon');
    await expect(logos).toHaveCount(15);

    // Check for CTA buttons
    const buttons = page.locator('.btn');
    expect(await buttons.count()).toBeGreaterThanOrEqual(15);

    // Check for highlight boxes
    const highlightBoxes = page.locator('.highlight-box');
    expect(await highlightBoxes.count()).toBeGreaterThanOrEqual(15);

    // Verify dark theme boxes exist
    const darkBoxes = page.locator('.highlight-box.dark');
    await expect(darkBoxes).toHaveCount(2); // Weekly report and Founder alert
  });
});
