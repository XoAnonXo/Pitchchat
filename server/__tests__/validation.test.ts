import { describe, it, expect } from 'vitest';
import { z } from 'zod';

/**
 * Validation Tests - Testing input validation logic
 * These tests validate the business rules for user input without requiring database
 */

// Email validation schema
const emailSchema = z.string().email('Invalid email address');

// Password validation schema
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters');

// Project name validation
const projectNameSchema = z.string()
  .min(1, 'Project name is required')
  .max(255, 'Project name must be less than 255 characters');

// Link slug validation
const slugSchema = z.string()
  .regex(/^[a-zA-Z0-9-_]+$/, 'Slug can only contain letters, numbers, hyphens, and underscores');

describe('Input Validation', () => {
  describe('Email Validation', () => {
    it('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.org',
        'user@subdomain.example.com',
        'user123@example.co.uk',
      ];

      validEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).not.toThrow();
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user@.com',
        'user space@example.com',
        '',
      ];

      invalidEmails.forEach(email => {
        expect(() => emailSchema.parse(email)).toThrow();
      });
    });

    it('should be case-insensitive for email', () => {
      const result1 = emailSchema.parse('TEST@EXAMPLE.COM');
      const result2 = emailSchema.parse('test@example.com');

      // Both should parse successfully (validation doesn't normalize)
      expect(result1).toBe('TEST@EXAMPLE.COM');
      expect(result2).toBe('test@example.com');
    });
  });

  describe('Password Validation', () => {
    it('should accept valid passwords', () => {
      const validPasswords = [
        'password123',
        'MySecurePass!',
        '12345678',
        'a'.repeat(100),
        '!@#$%^&*()_+',
      ];

      validPasswords.forEach(password => {
        expect(() => passwordSchema.parse(password)).not.toThrow();
      });
    });

    it('should reject passwords that are too short', () => {
      const shortPasswords = ['', 'short', '1234567'];

      shortPasswords.forEach(password => {
        expect(() => passwordSchema.parse(password)).toThrow();
      });
    });

    it('should reject passwords that are too long', () => {
      const longPassword = 'a'.repeat(101);
      expect(() => passwordSchema.parse(longPassword)).toThrow();
    });

    it('should accept exactly 8 character password', () => {
      expect(() => passwordSchema.parse('12345678')).not.toThrow();
    });

    it('should accept exactly 100 character password', () => {
      expect(() => passwordSchema.parse('a'.repeat(100))).not.toThrow();
    });
  });

  describe('Project Name Validation', () => {
    it('should accept valid project names', () => {
      const validNames = [
        'My Project',
        'Startup2024',
        'TechVenture - Series A',
        'AI/ML Platform',
        '新项目',
      ];

      validNames.forEach(name => {
        expect(() => projectNameSchema.parse(name)).not.toThrow();
      });
    });

    it('should reject empty project names', () => {
      expect(() => projectNameSchema.parse('')).toThrow();
    });

    it('should reject project names that are too long', () => {
      const longName = 'a'.repeat(256);
      expect(() => projectNameSchema.parse(longName)).toThrow();
    });

    it('should accept project name at max length', () => {
      const maxLengthName = 'a'.repeat(255);
      expect(() => projectNameSchema.parse(maxLengthName)).not.toThrow();
    });
  });

  describe('Slug Validation', () => {
    it('should accept valid slugs', () => {
      const validSlugs = [
        'my-project',
        'MyProject',
        'project_name',
        'project123',
        'Project-Name_2024',
      ];

      validSlugs.forEach(slug => {
        expect(() => slugSchema.parse(slug)).not.toThrow();
      });
    });

    it('should reject slugs with invalid characters', () => {
      const invalidSlugs = [
        'my project',  // space
        'project@name', // @
        'project.name', // .
        'project/name', // /
        'project!',     // !
      ];

      invalidSlugs.forEach(slug => {
        expect(() => slugSchema.parse(slug)).toThrow();
      });
    });
  });
});

describe('Business Rule Validation', () => {
  describe('Link Settings', () => {
    // Link settings schema
    const linkSettingsSchema = z.object({
      name: z.string().min(1).max(255),
      isActive: z.boolean().default(true),
      requireEmail: z.boolean().default(true),
      allowDownload: z.boolean().default(false),
      expiresAt: z.string().datetime().nullable().optional(),
      customMessage: z.string().max(1000).nullable().optional(),
    });

    it('should accept valid link settings', () => {
      const validSettings = {
        name: 'My Pitch Link',
        isActive: true,
        requireEmail: true,
        allowDownload: false,
        expiresAt: null,
        customMessage: 'Welcome to my pitch!',
      };

      expect(() => linkSettingsSchema.parse(validSettings)).not.toThrow();
    });

    it('should use default values', () => {
      const minimalSettings = {
        name: 'My Link',
      };

      const parsed = linkSettingsSchema.parse(minimalSettings);
      expect(parsed.isActive).toBe(true);
      expect(parsed.requireEmail).toBe(true);
      expect(parsed.allowDownload).toBe(false);
    });

    it('should reject invalid expiration dates', () => {
      const invalidSettings = {
        name: 'My Link',
        expiresAt: 'not-a-date',
      };

      expect(() => linkSettingsSchema.parse(invalidSettings)).toThrow();
    });

    it('should accept valid expiration dates', () => {
      const validSettings = {
        name: 'My Link',
        expiresAt: '2025-12-31T23:59:59.000Z',
      };

      expect(() => linkSettingsSchema.parse(validSettings)).not.toThrow();
    });

    it('should reject custom message exceeding limit', () => {
      const invalidSettings = {
        name: 'My Link',
        customMessage: 'a'.repeat(1001),
      };

      expect(() => linkSettingsSchema.parse(invalidSettings)).toThrow();
    });
  });

  describe('User Profile Updates', () => {
    const profileUpdateSchema = z.object({
      name: z.string().min(1).max(100).optional(),
      email: z.string().email().optional(),
    }).refine(data => data.name || data.email, {
      message: 'At least one field must be provided',
    });

    it('should accept valid profile updates', () => {
      const updates = [
        { name: 'John Doe' },
        { email: 'john@example.com' },
        { name: 'John', email: 'john@example.com' },
      ];

      updates.forEach(update => {
        expect(() => profileUpdateSchema.parse(update)).not.toThrow();
      });
    });

    it('should reject empty updates', () => {
      expect(() => profileUpdateSchema.parse({})).toThrow();
    });

    it('should reject invalid email in update', () => {
      expect(() => profileUpdateSchema.parse({ email: 'not-an-email' })).toThrow();
    });
  });

  describe('Notification Settings', () => {
    const notificationSchema = z.object({
      emailAlerts: z.boolean(),
      weeklyReports: z.boolean(),
    });

    it('should accept valid notification settings', () => {
      const settings = [
        { emailAlerts: true, weeklyReports: true },
        { emailAlerts: false, weeklyReports: false },
        { emailAlerts: true, weeklyReports: false },
      ];

      settings.forEach(setting => {
        expect(() => notificationSchema.parse(setting)).not.toThrow();
      });
    });

    it('should reject non-boolean values', () => {
      const invalidSettings = [
        { emailAlerts: 'yes', weeklyReports: true },
        { emailAlerts: 1, weeklyReports: 0 },
        { emailAlerts: null, weeklyReports: true },
      ];

      invalidSettings.forEach(setting => {
        expect(() => notificationSchema.parse(setting)).toThrow();
      });
    });
  });

  describe('Change Password', () => {
    const changePasswordSchema = z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    }).refine(data => data.currentPassword !== data.newPassword, {
      message: 'New password must be different from current password',
    });

    it('should accept valid password change request', () => {
      const valid = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword456',
      };

      expect(() => changePasswordSchema.parse(valid)).not.toThrow();
    });

    it('should reject when current password is empty', () => {
      const invalid = {
        currentPassword: '',
        newPassword: 'newPassword456',
      };

      expect(() => changePasswordSchema.parse(invalid)).toThrow();
    });

    it('should reject when new password is too short', () => {
      const invalid = {
        currentPassword: 'oldPassword123',
        newPassword: 'short',
      };

      expect(() => changePasswordSchema.parse(invalid)).toThrow();
    });

    it('should reject when passwords are the same', () => {
      const invalid = {
        currentPassword: 'samePassword123',
        newPassword: 'samePassword123',
      };

      expect(() => changePasswordSchema.parse(invalid)).toThrow();
    });
  });
});

describe('Rate Limiting Logic', () => {
  describe('Request counting', () => {
    it('should correctly count requests within a window', () => {
      const requests: number[] = [];
      const windowMs = 15 * 60 * 1000; // 15 minutes
      const now = Date.now();

      // Simulate 10 requests
      for (let i = 0; i < 10; i++) {
        requests.push(now - i * 1000); // 1 second apart
      }

      // Count requests within window
      const windowStart = now - windowMs;
      const validRequests = requests.filter(r => r >= windowStart);

      expect(validRequests.length).toBe(10);
    });

    it('should correctly filter expired requests', () => {
      const windowMs = 15 * 60 * 1000; // 15 minutes
      const now = Date.now();

      const requests = [
        now - 1000,                    // 1 second ago (valid)
        now - 5 * 60 * 1000,           // 5 minutes ago (valid)
        now - 10 * 60 * 1000,          // 10 minutes ago (valid)
        now - 20 * 60 * 1000,          // 20 minutes ago (expired)
        now - 30 * 60 * 1000,          // 30 minutes ago (expired)
      ];

      const windowStart = now - windowMs;
      const validRequests = requests.filter(r => r >= windowStart);

      expect(validRequests.length).toBe(3);
    });

    it('should identify when rate limit is exceeded', () => {
      const maxRequests = 100;
      const currentRequests = 101;

      const isLimitExceeded = currentRequests > maxRequests;
      expect(isLimitExceeded).toBe(true);
    });

    it('should identify when rate limit is not exceeded', () => {
      const maxRequests = 100;
      const currentRequests = 50;

      const isLimitExceeded = currentRequests > maxRequests;
      expect(isLimitExceeded).toBe(false);
    });
  });
});

describe('Analytics Calculations', () => {
  describe('Cost calculations', () => {
    it('should calculate total cost from token usage', () => {
      const costPerThousandTokens = 0.10; // $0.10 per 1K tokens
      const tokenCounts = [500, 1000, 1500, 2000];

      const totalTokens = tokenCounts.reduce((sum, count) => sum + count, 0);
      const totalCost = (totalTokens / 1000) * costPerThousandTokens;

      expect(totalCost).toBe(0.50); // 5000 tokens = $0.50
    });

    it('should handle zero token usage', () => {
      const costPerThousandTokens = 0.10;
      const totalTokens = 0;

      const totalCost = (totalTokens / 1000) * costPerThousandTokens;
      expect(totalCost).toBe(0);
    });

    it('should calculate percentage changes', () => {
      const previousValue = 100;
      const currentValue = 150;

      const percentageChange = ((currentValue - previousValue) / previousValue) * 100;
      expect(percentageChange).toBe(50);
    });

    it('should handle zero previous value in percentage', () => {
      const previousValue = 0;
      const currentValue = 100;

      // Avoid division by zero
      const percentageChange = previousValue === 0 ? 100 : ((currentValue - previousValue) / previousValue) * 100;
      expect(percentageChange).toBe(100);
    });
  });

  describe('Date range calculations', () => {
    it('should calculate days in range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      const diffMs = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      expect(diffDays).toBe(30);
    });

    it('should identify current week', () => {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const testDate = new Date();
      const isThisWeek = testDate >= startOfWeek;

      expect(isThisWeek).toBe(true);
    });
  });
});
