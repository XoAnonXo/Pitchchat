import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Request, Response, NextFunction } from 'express';

vi.mock('express-rate-limit', () => ({
  default: () => (_req: Request, _res: Response, next: NextFunction) => next(),
}));

vi.mock('../storage', () => ({
  storage: {
    getUserConversations: vi.fn(),
    getConversationMessages: vi.fn(),
    getConversationById: vi.fn(),
    getLink: vi.fn(),
    updateConversationContactDetails: vi.fn(),
    getProject: vi.fn(),
    getUser: vi.fn(),
  },
}));

vi.mock('../customAuth', () => ({
  isAuthenticated: (_req: Request, _res: Response, next: NextFunction) => next(),
}));

vi.mock('../brevo', () => ({
  sendInvestorContactEmail: vi.fn().mockResolvedValue(undefined),
  sendFounderContactAlert: vi.fn().mockResolvedValue(undefined),
}));

import { storage } from '../storage';
import conversationRouter from '../routes/conversationRoutes';

const mockStorage = storage as {
  getUserConversations: Mock;
  getConversationMessages: Mock;
  getConversationById: Mock;
  getLink: Mock;
  updateConversationContactDetails: Mock;
  getProject: Mock;
  getUser: Mock;
};

const VALID_UUID = {
  link: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  conversation: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
  project: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  user: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
};

const createMockLink = (overrides = {}) => ({
  id: VALID_UUID.link,
  projectId: VALID_UUID.project,
  slug: 'test-slug',
  name: 'Test Link',
  status: 'active',
  expiresAt: null,
  limitTokens: 1000,
  allowDownloads: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

const createMockConversation = (overrides = {}) => ({
  id: VALID_UUID.conversation,
  linkId: VALID_UUID.link,
  investorEmail: 'investor@example.com',
  startedAt: new Date('2024-01-15'),
  totalTokens: 1500,
  costUsd: 0.015,
  isActive: true,
  contactName: null,
  contactPhone: null,
  contactCompany: null,
  contactWebsite: null,
  contactProvidedAt: null,
  ...overrides,
});

const createMockProject = (overrides = {}) => ({
  id: VALID_UUID.project,
  userId: VALID_UUID.user,
  name: 'Test Project',
  description: 'A test project description',
  defaultModel: 'gpt-4o',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

const createMockUser = (overrides = {}) => ({
  id: VALID_UUID.user,
  email: 'founder@example.com',
  emailAlerts: false,
  ...overrides,
});

function getContactHandler() {
  const layer = (conversationRouter as any).stack.find(
    (entry: any) => entry.route?.path === '/:conversationId/contact' && entry.route?.methods?.post,
  );
  const handlers = layer.route.stack.map((entry: any) => entry.handle);
  return handlers[handlers.length - 1];
}

function createMockResponse() {
  const res: Partial<Response> & { statusCode?: number; body?: unknown } = {
    statusCode: 200,
    status(code: number) {
      this.statusCode = code;
      return this as Response;
    },
    json(payload: unknown) {
      this.body = payload;
      return this as Response;
    },
  };
  return res as Response & { statusCode?: number; body?: unknown };
}

describe('Conversation Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('POST /:conversationId/contact', () => {
    it('rejects contact submission when link does not match conversation', async () => {
      const conversation = createMockConversation({ linkId: 'mismatch-link' });
      const link = createMockLink();

      mockStorage.getConversationById.mockResolvedValue(conversation);
      mockStorage.getLink.mockResolvedValue(link);

      const req = {
        params: { conversationId: VALID_UUID.conversation },
        body: { name: 'Investor', linkSlug: link.slug },
      } as Request;
      const res = createMockResponse();

      const handler = getContactHandler();
      await handler(req, res);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'Conversation not found for link' });
      expect(mockStorage.updateConversationContactDetails).not.toHaveBeenCalled();
    });

    it('accepts contact submission when link matches conversation', async () => {
      const conversation = createMockConversation();
      const link = createMockLink();
      const project = createMockProject();
      const user = createMockUser();

      mockStorage.getConversationById.mockResolvedValue(conversation);
      mockStorage.getLink.mockResolvedValue(link);
      mockStorage.getProject.mockResolvedValue(project);
      mockStorage.getUser.mockResolvedValue(user);
      mockStorage.updateConversationContactDetails.mockResolvedValue(undefined);

      const req = {
        params: { conversationId: VALID_UUID.conversation },
        body: {
          name: 'Investor Name',
          phone: '555-555-5555',
          company: 'Pitch Co',
          website: 'https://pitch.example',
          linkSlug: link.slug,
        },
      } as Request;
      const res = createMockResponse();

      const handler = getContactHandler();
      await handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ success: true });
      expect(mockStorage.updateConversationContactDetails).toHaveBeenCalledWith(
        VALID_UUID.conversation,
        expect.objectContaining({
          contactName: 'Investor Name',
          contactPhone: '555-555-5555',
          contactCompany: 'Pitch Co',
          contactWebsite: 'https://pitch.example',
          contactProvidedAt: expect.any(Date),
        }),
      );
    });
  });
});
