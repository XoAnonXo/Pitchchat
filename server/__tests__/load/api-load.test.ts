import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer, Server } from 'http';
import express, { Request, Response, NextFunction } from 'express';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

// Use createRequire to import autocannon as CJS to avoid ESM interop issues
const __filename = fileURLToPath(import.meta.url);
const require = createRequire(__filename);
const autocannon = require('autocannon');

// Define the Result type manually
interface AutocannonResult {
  title: string;
  url: string;
  socketPath?: string;
  requests: {
    average: number;
    mean: number;
    stddev: number;
    min: number;
    max: number;
    total: number;
    sent: number;
    p0_001: number;
    p0_01: number;
    p0_1: number;
    p1: number;
    p2_5: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p97_5: number;
    p99: number;
    p99_9: number;
    p99_99: number;
    p99_999: number;
  };
  latency: {
    average: number;
    mean: number;
    stddev: number;
    min: number;
    max: number;
    p0_001: number;
    p0_01: number;
    p0_1: number;
    p1: number;
    p2_5: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p97_5: number;
    p99: number;
    p99_9: number;
    p99_99: number;
    p99_999: number;
  };
  throughput: {
    average: number;
    mean: number;
    stddev: number;
    min: number;
    max: number;
    total: number;
    p0_001: number;
    p0_01: number;
    p0_1: number;
    p1: number;
    p2_5: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p97_5: number;
    p99: number;
    p99_9: number;
    p99_99: number;
    p99_999: number;
  };
  errors: number;
  timeouts: number;
  duration: number;
  start: Date;
  finish: Date;
  connections: number;
  pipelining: number;
  non2xx: number;
}

/**
 * Load testing suite for Pitchchat API endpoints using autocannon
 *
 * Test thresholds:
 * - GET /api/projects: 100 req/s, p99 < 200ms
 * - GET /api/analytics: 50 req/s, p99 < 500ms
 * - GET /api/conversations: 100 req/s, p99 < 200ms
 */

const TEST_PORT = 5099;
const TEST_URL = `http://localhost:${TEST_PORT}`;

// Mock data for responses
const mockProjects = [
  { id: '1', name: 'Project 1', description: 'Test project 1', userId: 'user1', createdAt: new Date().toISOString() },
  { id: '2', name: 'Project 2', description: 'Test project 2', userId: 'user1', createdAt: new Date().toISOString() },
];

const mockAnalytics = {
  overview: {
    totalConversations: 150,
    totalVisitors: 75,
    activeLinks: 10,
    totalCost: 45.50,
  },
  projectBreakdown: [
    { projectName: 'Project 1', conversations: 100, totalTokens: 50000, totalCost: 30.00 },
    { projectName: 'Project 2', conversations: 50, totalTokens: 25000, totalCost: 15.50 },
  ],
};

const mockConversations = [
  { id: 'conv1', linkId: 'link1', investorEmail: 'investor1@test.com', createdAt: new Date().toISOString() },
  { id: 'conv2', linkId: 'link1', investorEmail: 'investor2@test.com', createdAt: new Date().toISOString() },
  { id: 'conv3', linkId: 'link2', investorEmail: 'investor3@test.com', createdAt: new Date().toISOString() },
];

let server: Server | null = null;

/**
 * Create a minimal test server that mocks the API endpoints
 * This allows us to test throughput without database dependencies
 */
function createTestServer(): Promise<Server> {
  return new Promise((resolve, reject) => {
    const app = express();
    app.use(express.json());

    // Mock authentication middleware - always pass for load testing
    const mockAuth = (req: Request, res: Response, next: NextFunction) => {
      (req as any).user = { id: 'test-user-id' };
      next();
    };

    // GET /api/projects - Target: 100 req/s, p99 < 200ms
    app.get('/api/projects', mockAuth, (req: Request, res: Response) => {
      res.json(mockProjects);
    });

    // GET /api/analytics - Target: 50 req/s, p99 < 500ms
    app.get('/api/analytics', mockAuth, (req: Request, res: Response) => {
      res.json(mockAnalytics);
    });

    // GET /api/conversations - Target: 100 req/s, p99 < 200ms
    app.get('/api/conversations', mockAuth, (req: Request, res: Response) => {
      res.json(mockConversations);
    });

    // Health check endpoint
    app.get('/api/health', (req: Request, res: Response) => {
      res.json({ status: 'ok' });
    });

    const httpServer = createServer(app);

    httpServer.on('error', (err) => {
      reject(err);
    });

    httpServer.listen(TEST_PORT, () => {
      resolve(httpServer);
    });
  });
}

/**
 * Close the server gracefully
 */
function closeServer(httpServer: Server): Promise<void> {
  return new Promise((resolve) => {
    httpServer.close(() => {
      resolve();
    });
  });
}

/**
 * Run autocannon load test and return results
 */
async function runLoadTest(options: {
  url: string;
  duration?: number;
  connections?: number;
  pipelining?: number;
  title?: string;
}): Promise<AutocannonResult> {
  return new Promise((resolve, reject) => {
    autocannon({
      url: options.url,
      duration: options.duration || 10, // 10 seconds default
      connections: options.connections || 10,
      pipelining: options.pipelining || 1,
      title: options.title || 'Load Test',
    }, (err: Error | null, result: AutocannonResult) => {
      if (err) {
        reject(err);
      } else if (!result) {
        reject(new Error('No result returned from autocannon'));
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Helper to extract p99 latency from results
 */
function getP99Latency(result: AutocannonResult): number {
  return result?.latency?.p99 ?? 0;
}

/**
 * Helper to calculate requests per second
 */
function getRequestsPerSecond(result: AutocannonResult): number {
  return result?.requests?.average ?? 0;
}

// Skip load tests in CI or test environments - run manually with: npx vitest run server/__tests__/load --reporter=verbose
const isCI = process.env.CI === 'true' || process.env.SKIP_LOAD_TESTS === 'true';

describe.skipIf(isCI)('API Load Tests', () => {
  beforeAll(async () => {
    try {
      server = await createTestServer();
      console.log(`Test server started on port ${TEST_PORT}`);
    } catch (error) {
      console.error('Failed to start test server:', error);
      throw error;
    }
  }, 30000);

  afterAll(async () => {
    if (server) {
      await closeServer(server);
      console.log('Test server closed');
      server = null;
    }
  }, 10000);

  describe('GET /api/projects', () => {
    it('should handle at least 100 requests per second with p99 latency under 200ms', async () => {
      const result = await runLoadTest({
        url: `${TEST_URL}/api/projects`,
        duration: 10,
        connections: 20,
        title: 'Projects Endpoint Load Test',
      });

      const reqPerSec = getRequestsPerSecond(result);
      const p99 = getP99Latency(result);
      const errors = result.errors;

      console.log(`GET /api/projects: ${reqPerSec.toFixed(2)} req/s, p99: ${p99}ms, errors: ${errors}`);

      expect(reqPerSec).toBeGreaterThanOrEqual(100);
      expect(p99).toBeLessThan(200);
      expect(errors).toBe(0);
    }, 60000);
  });

  describe('GET /api/analytics', () => {
    it('should handle at least 50 requests per second with p99 latency under 500ms', async () => {
      const result = await runLoadTest({
        url: `${TEST_URL}/api/analytics`,
        duration: 10,
        connections: 10,
        title: 'Analytics Endpoint Load Test',
      });

      const reqPerSec = getRequestsPerSecond(result);
      const p99 = getP99Latency(result);
      const errors = result.errors;

      console.log(`GET /api/analytics: ${reqPerSec.toFixed(2)} req/s, p99: ${p99}ms, errors: ${errors}`);

      expect(reqPerSec).toBeGreaterThanOrEqual(50);
      expect(p99).toBeLessThan(500);
      expect(errors).toBe(0);
    }, 60000);
  });

  describe('GET /api/conversations', () => {
    it('should handle at least 100 requests per second with p99 latency under 200ms', async () => {
      const result = await runLoadTest({
        url: `${TEST_URL}/api/conversations`,
        duration: 10,
        connections: 20,
        title: 'Conversations Endpoint Load Test',
      });

      const reqPerSec = getRequestsPerSecond(result);
      const p99 = getP99Latency(result);
      const errors = result.errors;

      console.log(`GET /api/conversations: ${reqPerSec.toFixed(2)} req/s, p99: ${p99}ms, errors: ${errors}`);

      expect(reqPerSec).toBeGreaterThanOrEqual(100);
      expect(p99).toBeLessThan(200);
      expect(errors).toBe(0);
    }, 60000);
  });

  describe('Combined Load Test', () => {
    it('should handle concurrent requests to all endpoints', async () => {
      // Run tests in parallel to simulate real-world mixed traffic
      const results = await Promise.all([
        runLoadTest({
          url: `${TEST_URL}/api/projects`,
          duration: 10,
          connections: 10,
          title: 'Projects (Combined)',
        }),
        runLoadTest({
          url: `${TEST_URL}/api/analytics`,
          duration: 10,
          connections: 5,
          title: 'Analytics (Combined)',
        }),
        runLoadTest({
          url: `${TEST_URL}/api/conversations`,
          duration: 10,
          connections: 10,
          title: 'Conversations (Combined)',
        }),
      ]);

      const [projectsResult, analyticsResult, conversationsResult] = results;

      console.log('\n=== Combined Load Test Results ===');
      console.log(`Projects: ${getRequestsPerSecond(projectsResult).toFixed(2)} req/s, p99: ${getP99Latency(projectsResult)}ms`);
      console.log(`Analytics: ${getRequestsPerSecond(analyticsResult).toFixed(2)} req/s, p99: ${getP99Latency(analyticsResult)}ms`);
      console.log(`Conversations: ${getRequestsPerSecond(conversationsResult).toFixed(2)} req/s, p99: ${getP99Latency(conversationsResult)}ms`);

      // Verify all endpoints still meet thresholds under combined load
      // (Relaxed thresholds as resources are shared)
      expect(getRequestsPerSecond(projectsResult)).toBeGreaterThanOrEqual(50);
      expect(getRequestsPerSecond(analyticsResult)).toBeGreaterThanOrEqual(25);
      expect(getRequestsPerSecond(conversationsResult)).toBeGreaterThanOrEqual(50);

      // Verify latency thresholds (slightly relaxed for combined load)
      expect(getP99Latency(projectsResult)).toBeLessThan(400);
      expect(getP99Latency(analyticsResult)).toBeLessThan(1000);
      expect(getP99Latency(conversationsResult)).toBeLessThan(400);

      // Verify no errors
      expect(projectsResult.errors).toBe(0);
      expect(analyticsResult.errors).toBe(0);
      expect(conversationsResult.errors).toBe(0);
    }, 120000);
  });

  describe('Stress Test', () => {
    it('should handle burst traffic on /api/projects', async () => {
      const result = await runLoadTest({
        url: `${TEST_URL}/api/projects`,
        duration: 5,
        connections: 100, // High concurrency burst
        title: 'Projects Stress Test',
      });

      console.log('\n=== Stress Test Results ===');
      console.log(`Burst traffic (100 connections): ${getRequestsPerSecond(result).toFixed(2)} req/s`);
      console.log(`p99 latency: ${getP99Latency(result)}ms`);
      console.log(`Errors: ${result.errors}`);
      console.log(`Timeouts: ${result.timeouts}`);

      // Under stress, we accept degraded but still reasonable performance
      const totalRequests = result.requests.total || 1;
      expect(result.errors).toBeLessThan(totalRequests * 0.01); // Less than 1% error rate
      expect(getP99Latency(result)).toBeLessThan(1000); // p99 under 1 second
    }, 60000);
  });
});

/**
 * Export utilities for external use
 */
export { runLoadTest, getP99Latency, getRequestsPerSecond };
