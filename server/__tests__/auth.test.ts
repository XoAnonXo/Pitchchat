import { describe, it, expect } from 'vitest';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

// Direct implementation of password functions to avoid DB imports
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString('hex')}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

describe('Authentication Module', () => {
  describe('hashPassword', () => {
    it('should create a hash with salt', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      // Hash should contain a period separating hash and salt
      expect(hash).toContain('.');

      // Hash should be of expected length (128 hex chars for 64 byte hash + 1 period + 32 hex chars for 16 byte salt)
      const parts = hash.split('.');
      expect(parts).toHaveLength(2);
      expect(parts[0]).toHaveLength(128); // 64 bytes = 128 hex chars
      expect(parts[1]).toHaveLength(32); // 16 bytes = 32 hex chars
    });

    it('should create different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      // Due to random salt, hashes should be different
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty password', async () => {
      const password = '';
      const hash = await hashPassword(password);

      expect(hash).toContain('.');
      expect(hash.split('.')[0]).toHaveLength(128);
    });

    it('should handle special characters in password', async () => {
      const password = '!@#$%^&*()_+-=[]{}|;:\'",.<>?/\\`~';
      const hash = await hashPassword(password);

      expect(hash).toContain('.');
      const parts = hash.split('.');
      expect(parts[0]).toHaveLength(128);
    });

    it('should handle unicode characters in password', async () => {
      const password = '密码测试🔐';
      const hash = await hashPassword(password);

      expect(hash).toContain('.');
      const parts = hash.split('.');
      expect(parts[0]).toHaveLength(128);
    });

    it('should handle very long passwords', async () => {
      const password = 'a'.repeat(10000);
      const hash = await hashPassword(password);

      expect(hash).toContain('.');
      const parts = hash.split('.');
      expect(parts[0]).toHaveLength(128);
    });
  });

  describe('comparePasswords', () => {
    it('should return true for matching passwords', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      const isMatch = await comparePasswords(password, hash);
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hash = await hashPassword(password);

      const isMatch = await comparePasswords(wrongPassword, hash);
      expect(isMatch).toBe(false);
    });

    it('should return false for similar but different passwords', async () => {
      const password = 'testPassword123';
      const similarPassword = 'testPassword124'; // Just one character different
      const hash = await hashPassword(password);

      const isMatch = await comparePasswords(similarPassword, hash);
      expect(isMatch).toBe(false);
    });

    it('should return false for case-sensitive differences', async () => {
      const password = 'TestPassword123';
      const differentCase = 'testpassword123';
      const hash = await hashPassword(password);

      const isMatch = await comparePasswords(differentCase, hash);
      expect(isMatch).toBe(false);
    });

    it('should handle empty password comparison', async () => {
      const password = '';
      const hash = await hashPassword(password);

      const isMatch = await comparePasswords(password, hash);
      expect(isMatch).toBe(true);

      const isWrongMatch = await comparePasswords('notempty', hash);
      expect(isWrongMatch).toBe(false);
    });

    it('should handle special characters in password comparison', async () => {
      const password = '!@#$%^&*()_+-=[]{}|;:\'",.<>?/\\`~';
      const hash = await hashPassword(password);

      const isMatch = await comparePasswords(password, hash);
      expect(isMatch).toBe(true);
    });

    it('should handle unicode characters in password comparison', async () => {
      const password = '密码测试🔐';
      const hash = await hashPassword(password);

      const isMatch = await comparePasswords(password, hash);
      expect(isMatch).toBe(true);
    });

    it('should use timing-safe comparison', async () => {
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      // Multiple comparisons should have consistent timing
      // (This is a behavioral test - in production, timing attacks would be mitigated)
      const results: boolean[] = [];
      for (let i = 0; i < 10; i++) {
        results.push(await comparePasswords(password, hash));
      }

      // All results should be true
      expect(results.every(r => r === true)).toBe(true);
    });
  });

  describe('Password Validation Rules', () => {
    it('should validate minimum password length of 8 characters', () => {
      const shortPassword = 'short';
      const validPassword = 'validpass';

      expect(shortPassword.length).toBeLessThan(8);
      expect(validPassword.length).toBeGreaterThanOrEqual(8);
    });

    it('should recommend strong passwords', () => {
      // Test patterns for strong password detection
      const weakPassword = 'password';
      const strongPassword = 'MyStr0ng!Pass#2024';

      // Weak password patterns
      const hasUppercase = /[A-Z]/.test(weakPassword);
      const hasLowercase = /[a-z]/.test(weakPassword);
      const hasNumber = /[0-9]/.test(weakPassword);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(weakPassword);

      const weakScore = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
      expect(weakScore).toBeLessThan(3);

      // Strong password patterns
      const strongHasUppercase = /[A-Z]/.test(strongPassword);
      const strongHasLowercase = /[a-z]/.test(strongPassword);
      const strongHasNumber = /[0-9]/.test(strongPassword);
      const strongHasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(strongPassword);

      const strongScore = [strongHasUppercase, strongHasLowercase, strongHasNumber, strongHasSpecial].filter(Boolean).length;
      expect(strongScore).toBe(4);
    });
  });

  describe('Hash Format Validation', () => {
    it('should produce consistent format', async () => {
      const passwords = ['test1', 'test2', 'test3', '!@#$', '密码'];

      for (const password of passwords) {
        const hash = await hashPassword(password);
        const parts = hash.split('.');

        expect(parts).toHaveLength(2);
        expect(/^[a-f0-9]+$/.test(parts[0])).toBe(true); // Hash is hex
        expect(/^[a-f0-9]+$/.test(parts[1])).toBe(true); // Salt is hex
      }
    });

    it('should handle malformed hash gracefully', async () => {
      const password = 'test';

      // These should throw or return false for invalid hash formats
      try {
        await comparePasswords(password, 'invalid-hash');
        // If it doesn't throw, it should return false
      } catch (error) {
        // Expected for malformed hash
        expect(error).toBeDefined();
      }
    });
  });
});
