import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import express, { Express, Request, Response, NextFunction } from 'express';
import request from 'supertest';

// Mock rate limiter before importing routes - must be first
vi.mock('express-rate-limit', () => ({
  default: () => (_req: Request, _res: Response, next: NextFunction) => next(),
}));

// Mock the storage module before importing the routes
vi.mock('../storage', () => ({
  storage: {
    getLink: vi.fn(),
    getProject: vi.fn(),
    getProjectDocumentCount: vi.fn(),
    getProjectDocuments: vi.fn(),
    getDocument: vi.fn(),
    getConversation: vi.fn(),
    getConversationMessages: vi.fn(),
    createConversation: vi.fn(),
    createMessage: vi.fn(),
    searchChunks: vi.fn(),
    updateConversation: vi.fn(),
    getUserIdFromConversation: vi.fn(),
    getUserById: vi.fn(),
  },
}));

// Mock the AI models module
vi.mock('../aiModels', () => ({
  chatWithAI: vi.fn(),
  streamChatWithAI: vi.fn(),
}));

// Mock the pricing module
vi.mock('../pricing', () => ({
  calculatePlatformCost: vi.fn().mockReturnValue(0.001),
}));

// Mock the Brevo email module - return a Promise that has .catch method
vi.mock('../brevo', () => ({
  sendInvestorEngagementAlert: vi.fn().mockImplementation(() => Promise.resolve(undefined)),
}));

// Import after mocking
import { storage } from '../storage';
import { chatWithAI } from '../aiModels';
import { sendInvestorEngagementAlert } from '../brevo';
import chatRouter from '../routes/chatRoutes';

// Type assertions for mocked functions
const mockStorage = storage as {
  getLink: Mock;
  getProject: Mock;
  getProjectDocumentCount: Mock;
  getProjectDocuments: Mock;
  getDocument: Mock;
  getConversation: Mock;
  getConversationMessages: Mock;
  createConversation: Mock;
  createMessage: Mock;
  searchChunks: Mock;
  updateConversation: Mock;
  getUserIdFromConversation: Mock;
  getUserById: Mock;
};

const mockChatWithAI = chatWithAI as Mock;
const mockSendInvestorEngagementAlert = sendInvestorEngagementAlert as Mock;

// Valid UUID constants for testing
const VALID_UUID = {
  link: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  project: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  user: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
  document: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
  conversation: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55',
  message: 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
  chunk: '10eebc99-9c0b-4ef8-bb6d-6bb9bd380a77',
};

// Test data factories
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

const createMockDocument = (overrides = {}) => ({
  id: VALID_UUID.document,
  projectId: VALID_UUID.project,
  filename: 'test-file-uuid.pdf',
  originalName: 'test-document.pdf',
  fileSize: 1024000,
  mimeType: 'application/pdf',
  status: 'completed',
  tokens: 5000,
  pageCount: 10,
  source: 'Direct Upload',
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

const createMockMessage = (overrides = {}) => ({
  id: VALID_UUID.message,
  conversationId: VALID_UUID.conversation,
  role: 'user',
  content: 'What is the company valuation?',
  tokenCount: 10,
  citations: null,
  timestamp: new Date('2024-01-15T10:00:00Z'),
  ...overrides,
});

const createMockChunk = (overrides = {}) => ({
  id: VALID_UUID.chunk,
  documentId: VALID_UUID.document,
  content: 'The company valuation is $10M based on latest round.',
  embedding: [],
  metadata: { filename: 'pitch-deck.pdf', page: 5 },
  tokenCount: 15,
  chunkIndex: 0,
  createdAt: new Date('2024-01-01'),
  ...overrides,
});

// Create Express app for testing
function createTestApp(): Express {
  const app = express();
  app.use(express.json());
  app.use('/api/chat', chatRouter);
  return app;
}

describe('Chat Routes', () => {
  let app: Express;

  beforeEach(() => {
    app = createTestApp();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /:slug - Fetch chat link info', () => {
    describe('Valid link scenarios', () => {
      it('should return chat link info for a valid active link', async () => {
        const mockLink = createMockLink();
        const mockProject = createMockProject();

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getProject.mockResolvedValue(mockProject);
        mockStorage.getProjectDocumentCount.mockResolvedValue(5);

        const response = await request(app).get('/api/chat/test-slug');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          name: 'Test Link',
          projectName: 'Test Project',
          description: 'A test project description',
          documentCount: 5,
          allowDownloads: false,
        });
        expect(mockStorage.getLink).toHaveBeenCalledWith('test-slug');
        expect(mockStorage.getProject).toHaveBeenCalledWith(VALID_UUID.project);
        expect(mockStorage.getProjectDocumentCount).toHaveBeenCalledWith(VALID_UUID.project);
      });

      it('should return allowDownloads as true when enabled', async () => {
        const mockLink = createMockLink({ allowDownloads: true });
        const mockProject = createMockProject();

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getProject.mockResolvedValue(mockProject);
        mockStorage.getProjectDocumentCount.mockResolvedValue(3);

        const response = await request(app).get('/api/chat/test-slug');

        expect(response.status).toBe(200);
        expect(response.body.allowDownloads).toBe(true);
      });

      it('should handle link with null description in project', async () => {
        const mockLink = createMockLink();
        const mockProject = createMockProject({ description: null });

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getProject.mockResolvedValue(mockProject);
        mockStorage.getProjectDocumentCount.mockResolvedValue(0);

        const response = await request(app).get('/api/chat/test-slug');

        expect(response.status).toBe(200);
        expect(response.body.description).toBeNull();
      });

      it('should handle link with zero documents', async () => {
        const mockLink = createMockLink();
        const mockProject = createMockProject();

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getProject.mockResolvedValue(mockProject);
        mockStorage.getProjectDocumentCount.mockResolvedValue(0);

        const response = await request(app).get('/api/chat/test-slug');

        expect(response.status).toBe(200);
        expect(response.body.documentCount).toBe(0);
      });
    });

    describe('Invalid link scenarios', () => {
      it('should return 404 for non-existent link', async () => {
        mockStorage.getLink.mockResolvedValue(undefined);

        const response = await request(app).get('/api/chat/non-existent-slug');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Chat link not found or expired');
      });

      it('should return 404 for inactive link', async () => {
        const mockLink = createMockLink({ status: 'disabled' });

        mockStorage.getLink.mockResolvedValue(mockLink);

        const response = await request(app).get('/api/chat/disabled-slug');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Chat link not found or expired');
      });

      it('should return 404 for expired link', async () => {
        const expiredLink = createMockLink({
          expiresAt: new Date('2020-01-01'), // Past date
        });

        mockStorage.getLink.mockResolvedValue(expiredLink);

        const response = await request(app).get('/api/chat/expired-slug');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Chat link has expired');
      });

      it('should return 404 when project is not found', async () => {
        const mockLink = createMockLink();

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getProject.mockResolvedValue(undefined);

        const response = await request(app).get('/api/chat/valid-slug');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Project not found');
      });
    });

    describe('Error handling', () => {
      it('should return 500 when storage throws an error', async () => {
        mockStorage.getLink.mockRejectedValue(new Error('Database connection failed'));

        const response = await request(app).get('/api/chat/test-slug');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to fetch chat link');
      });

      it('should return 500 when getProject throws an error', async () => {
        const mockLink = createMockLink();
        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getProject.mockRejectedValue(new Error('Project query failed'));

        const response = await request(app).get('/api/chat/test-slug');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to fetch chat link');
      });
    });

    describe('Edge cases', () => {
      it('should handle special characters in slug', async () => {
        mockStorage.getLink.mockResolvedValue(undefined);

        const response = await request(app).get('/api/chat/special-slug-123');

        expect(response.status).toBe(404);
        expect(mockStorage.getLink).toHaveBeenCalledWith('special-slug-123');
      });

      it('should accept link that expires in the future', async () => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);

        const mockLink = createMockLink({ expiresAt: futureDate });
        const mockProject = createMockProject();

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getProject.mockResolvedValue(mockProject);
        mockStorage.getProjectDocumentCount.mockResolvedValue(5);

        const response = await request(app).get('/api/chat/future-expiry');

        expect(response.status).toBe(200);
      });
    });
  });

  describe('GET /:slug/download - List documents for download', () => {
    describe('Successful download listing', () => {
      it('should return list of documents when downloads are allowed', async () => {
        const mockLink = createMockLink({ allowDownloads: true });
        const mockDocuments = [
          createMockDocument({ id: VALID_UUID.document, originalName: 'pitch-deck.pdf' }),
          createMockDocument({ id: 'doc-002', originalName: 'financials.xlsx', mimeType: 'application/vnd.ms-excel' }),
        ];

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getProjectDocuments.mockResolvedValue(mockDocuments);

        const response = await request(app).get('/api/chat/test-slug/download');

        expect(response.status).toBe(200);
        expect(response.body.projectId).toBe(VALID_UUID.project);
        expect(response.body.documents).toHaveLength(2);
        expect(response.body.documents[0]).toEqual({
          id: VALID_UUID.document,
          name: 'pitch-deck.pdf',
          type: 'application/pdf',
          size: 1024000,
          downloadUrl: `/api/chat/test-slug/download/${VALID_UUID.document}`,
        });
      });

      it('should use filename when originalName is not available', async () => {
        const mockLink = createMockLink({ allowDownloads: true });
        const mockDocuments = [
          createMockDocument({ id: VALID_UUID.document, originalName: null, filename: 'stored-file.pdf' }),
        ];

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getProjectDocuments.mockResolvedValue(mockDocuments);

        const response = await request(app).get('/api/chat/test-slug/download');

        expect(response.status).toBe(200);
        expect(response.body.documents[0].name).toBe('stored-file.pdf');
      });
    });

    describe('Authorization errors', () => {
      it('should return 403 when downloads are not allowed', async () => {
        const mockLink = createMockLink({ allowDownloads: false });

        mockStorage.getLink.mockResolvedValue(mockLink);

        const response = await request(app).get('/api/chat/test-slug/download');

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Downloads are not allowed for this link');
      });

      it('should return 404 for non-existent link', async () => {
        mockStorage.getLink.mockResolvedValue(undefined);

        const response = await request(app).get('/api/chat/fake-slug/download');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Chat link not found or expired');
      });

      it('should return 404 for inactive link', async () => {
        const mockLink = createMockLink({ status: 'expired', allowDownloads: true });

        mockStorage.getLink.mockResolvedValue(mockLink);

        const response = await request(app).get('/api/chat/expired-slug/download');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Chat link not found or expired');
      });

      it('should return 404 for expired link even when downloads allowed', async () => {
        const mockLink = createMockLink({
          allowDownloads: true,
          expiresAt: new Date('2020-01-01'),
        });

        mockStorage.getLink.mockResolvedValue(mockLink);

        const response = await request(app).get('/api/chat/expired-slug/download');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Chat link has expired');
      });
    });

    describe('Empty documents', () => {
      it('should return 404 when no documents exist', async () => {
        const mockLink = createMockLink({ allowDownloads: true });

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getProjectDocuments.mockResolvedValue([]);

        const response = await request(app).get('/api/chat/test-slug/download');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No documents found');
      });

      it('should return 404 when documents is null', async () => {
        const mockLink = createMockLink({ allowDownloads: true });

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getProjectDocuments.mockResolvedValue(null);

        const response = await request(app).get('/api/chat/test-slug/download');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No documents found');
      });
    });

    describe('Error handling', () => {
      it('should return 500 when storage throws an error', async () => {
        mockStorage.getLink.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/api/chat/test-slug/download');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to prepare downloads');
      });
    });
  });

  describe('POST /:slug/messages - Send messages', () => {
    describe('Successful message sending', () => {
      it('should create a new conversation and return AI response', async () => {
        const mockLink = createMockLink();
        const mockProject = createMockProject();
        const mockConversation = createMockConversation();
        const mockChunks = [createMockChunk()];
        const mockUserMessage = createMockMessage();
        const mockAssistantMessage = createMockMessage({
          id: 'msg-002',
          role: 'assistant',
          content: 'The company valuation is $10M.',
          tokenCount: 20,
        });

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.createConversation.mockResolvedValue(mockConversation);
        mockStorage.createMessage
          .mockResolvedValueOnce(mockUserMessage)
          .mockResolvedValueOnce(mockAssistantMessage);
        mockStorage.getProject.mockResolvedValue(mockProject);
        mockStorage.searchChunks.mockResolvedValue(mockChunks);
        mockStorage.updateConversation.mockResolvedValue(mockConversation);

        mockChatWithAI.mockResolvedValue({
          content: 'The company valuation is $10M.',
          tokenCount: 20,
          citations: [{ source: 'pitch-deck.pdf', content: 'Valuation: $10M', page: 5 }],
        });

        const response = await request(app)
          .post('/api/chat/test-slug/messages')
          .send({ message: 'What is the company valuation?' });

        expect(response.status).toBe(200);
        expect(response.body.conversationId).toBe(VALID_UUID.conversation);
        expect(response.body.message).toBeDefined();
        expect(response.body.message.role).toBe('assistant');
        expect(mockStorage.createConversation).toHaveBeenCalledWith({
          linkId: VALID_UUID.link,
          investorEmail: null,
        });
      });

      it('should use existing conversation when conversationId is provided', async () => {
        const mockLink = createMockLink();
        const mockProject = createMockProject();
        const mockConversation = createMockConversation();
        const mockChunks = [createMockChunk()];
        const mockUserMessage = createMockMessage();
        const mockAssistantMessage = createMockMessage({
          id: 'msg-002',
          role: 'assistant',
          content: 'Response to follow-up question.',
          tokenCount: 15,
        });

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getConversation.mockResolvedValue(mockConversation);
        mockStorage.createMessage
          .mockResolvedValueOnce(mockUserMessage)
          .mockResolvedValueOnce(mockAssistantMessage);
        mockStorage.getProject.mockResolvedValue(mockProject);
        mockStorage.searchChunks.mockResolvedValue(mockChunks);
        mockStorage.updateConversation.mockResolvedValue(mockConversation);

        mockChatWithAI.mockResolvedValue({
          content: 'Response to follow-up question.',
          tokenCount: 15,
          citations: [],
        });

        const response = await request(app)
          .post('/api/chat/test-slug/messages')
          .send({
            message: 'What about the revenue?',
            conversationId: VALID_UUID.conversation,
          });

        expect(response.status).toBe(200);
        expect(response.body.conversationId).toBe(VALID_UUID.conversation);
        expect(mockStorage.createConversation).not.toHaveBeenCalled();
        expect(mockStorage.getConversation).toHaveBeenCalledWith(VALID_UUID.conversation);
      });

      it('should store investor email when provided for new conversation', async () => {
        const mockLink = createMockLink();
        const mockProject = createMockProject();
        const mockConversation = createMockConversation({ investorEmail: 'investor@test.com' });
        const mockChunks = [createMockChunk()];
        const mockUserMessage = createMockMessage();
        const mockAssistantMessage = createMockMessage({
          id: 'msg-002',
          role: 'assistant',
          content: 'AI response',
          tokenCount: 10,
        });

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.createConversation.mockResolvedValue(mockConversation);
        mockStorage.createMessage
          .mockResolvedValueOnce(mockUserMessage)
          .mockResolvedValueOnce(mockAssistantMessage);
        mockStorage.getProject.mockResolvedValue(mockProject);
        mockStorage.searchChunks.mockResolvedValue(mockChunks);
        mockStorage.updateConversation.mockResolvedValue(mockConversation);
        mockStorage.getUserIdFromConversation.mockResolvedValue(VALID_UUID.user);
        mockStorage.getUserById.mockResolvedValue({ emailAlerts: true, email: 'owner@test.com' });

        mockChatWithAI.mockResolvedValue({
          content: 'AI response',
          tokenCount: 10,
          citations: [],
        });

        // Must mock sendInvestorEngagementAlert to return a Promise
        mockSendInvestorEngagementAlert.mockReturnValue(Promise.resolve());

        const response = await request(app)
          .post('/api/chat/test-slug/messages')
          .send({
            message: 'Hello',
            investorEmail: 'investor@test.com',
          });

        expect(response.status).toBe(200);
        expect(mockStorage.createConversation).toHaveBeenCalledWith({
          linkId: VALID_UUID.link,
          investorEmail: 'investor@test.com',
        });
      });
    });

    describe('Input validation', () => {
      it('should return 400 when message is missing', async () => {
        const response = await request(app)
          .post('/api/chat/test-slug/messages')
          .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Message is required');
      });

      it('should return 400 when message is not a string', async () => {
        const response = await request(app)
          .post('/api/chat/test-slug/messages')
          .send({ message: 12345 });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Message is required');
      });

      it('should return 400 when message is null', async () => {
        const response = await request(app)
          .post('/api/chat/test-slug/messages')
          .send({ message: null });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Message is required');
      });

      it('should return 400 when message is an empty object', async () => {
        const response = await request(app)
          .post('/api/chat/test-slug/messages')
          .send({ message: {} });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Message is required');
      });
    });

    describe('Demo room rate limiting', () => {
      it('should return 429 when demo limit is reached', async () => {
        const mockLink = createMockLink({ slug: 'demo' });
        const existingMessages = [
          createMockMessage({ role: 'user' }),
          createMockMessage({ role: 'assistant' }),
          createMockMessage({ role: 'user' }),
          createMockMessage({ role: 'assistant' }),
          createMockMessage({ role: 'user' }), // 3rd user message
          createMockMessage({ role: 'assistant' }),
        ];

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getConversationMessages.mockResolvedValue(existingMessages);

        const response = await request(app)
          .post('/api/chat/demo/messages')
          .send({
            message: 'Another question',
            conversationId: VALID_UUID.conversation,
          });

        expect(response.status).toBe(429);
        expect(response.body).toEqual({
          message: 'Demo limit reached',
          limit: 3,
          current: 3,
          upgradeUrl: '/auth',
        });
      });

      it('should allow messages when demo limit not reached', async () => {
        const mockLink = createMockLink({ slug: 'demo' });
        const mockProject = createMockProject();
        const mockConversation = createMockConversation();
        const mockChunks = [createMockChunk()];
        const existingMessages = [
          createMockMessage({ role: 'user' }),
          createMockMessage({ role: 'assistant' }),
        ]; // Only 1 user message

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getConversationMessages.mockResolvedValue(existingMessages);
        mockStorage.getConversation.mockResolvedValue(mockConversation);
        mockStorage.getProject.mockResolvedValue(mockProject);
        mockStorage.searchChunks.mockResolvedValue(mockChunks);
        mockStorage.createMessage.mockResolvedValue(createMockMessage());
        mockStorage.updateConversation.mockResolvedValue(mockConversation);

        mockChatWithAI.mockResolvedValue({
          content: 'Response',
          tokenCount: 10,
          citations: [],
        });

        const response = await request(app)
          .post('/api/chat/demo/messages')
          .send({
            message: 'Second question',
            conversationId: VALID_UUID.conversation,
          });

        expect(response.status).toBe(200);
      });

      it('should not apply demo limit when no conversationId provided', async () => {
        const mockLink = createMockLink({ slug: 'demo' });
        const mockProject = createMockProject();
        const mockConversation = createMockConversation();
        const mockChunks = [createMockChunk()];

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.createConversation.mockResolvedValue(mockConversation);
        mockStorage.getProject.mockResolvedValue(mockProject);
        mockStorage.searchChunks.mockResolvedValue(mockChunks);
        mockStorage.createMessage.mockResolvedValue(createMockMessage());
        mockStorage.updateConversation.mockResolvedValue(mockConversation);

        mockChatWithAI.mockResolvedValue({
          content: 'Response',
          tokenCount: 10,
          citations: [],
        });

        const response = await request(app)
          .post('/api/chat/demo/messages')
          .send({ message: 'First question' });

        expect(response.status).toBe(200);
        expect(mockStorage.getConversationMessages).not.toHaveBeenCalled();
      });

      it('should not apply demo limit to non-demo links', async () => {
        const mockLink = createMockLink({ slug: 'regular-link' });
        const mockProject = createMockProject();
        const mockConversation = createMockConversation();
        const mockChunks = [createMockChunk()];
        const existingMessages = Array(10).fill(null).map((_, i) =>
          createMockMessage({ role: i % 2 === 0 ? 'user' : 'assistant' })
        ); // 5 user messages

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getConversation.mockResolvedValue(mockConversation);
        mockStorage.getProject.mockResolvedValue(mockProject);
        mockStorage.searchChunks.mockResolvedValue(mockChunks);
        mockStorage.createMessage.mockResolvedValue(createMockMessage());
        mockStorage.updateConversation.mockResolvedValue(mockConversation);

        mockChatWithAI.mockResolvedValue({
          content: 'Response',
          tokenCount: 10,
          citations: [],
        });

        const response = await request(app)
          .post('/api/chat/regular-link/messages')
          .send({
            message: 'Sixth question',
            conversationId: VALID_UUID.conversation,
          });

        expect(response.status).toBe(200);
      });
    });

    describe('Conversation validation', () => {
      it('should return 400 for invalid conversation ID format', async () => {
        const response = await request(app)
          .post('/api/chat/test-slug/messages')
          .send({
            message: 'Hello',
            conversationId: 'invalid-uuid-format',
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid conversation ID format');
      });

      it('should return 404 when conversation not found', async () => {
        const mockLink = createMockLink();
        const nonExistentUUID = '11111111-1111-1111-1111-111111111111';

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getConversation.mockResolvedValue(undefined);

        const response = await request(app)
          .post('/api/chat/test-slug/messages')
          .send({
            message: 'Hello',
            conversationId: nonExistentUUID,
          });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Conversation not found');
      });

      it('should return 404 when conversation belongs to different link', async () => {
        const mockLink = createMockLink({ id: VALID_UUID.link });
        const mockConversation = createMockConversation({ linkId: 'different-link-456' });

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getConversation.mockResolvedValue(mockConversation);

        const response = await request(app)
          .post('/api/chat/test-slug/messages')
          .send({
            message: 'Hello',
            conversationId: VALID_UUID.conversation,
          });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Conversation not found');
      });
    });

    describe('Link validation', () => {
      it('should return 404 for non-existent link', async () => {
        mockStorage.getLink.mockResolvedValue(undefined);

        const response = await request(app)
          .post('/api/chat/fake-slug/messages')
          .send({ message: 'Hello' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Chat link not found or expired');
      });

      it('should return 404 for inactive link', async () => {
        const mockLink = createMockLink({ status: 'disabled' });

        mockStorage.getLink.mockResolvedValue(mockLink);

        const response = await request(app)
          .post('/api/chat/disabled-slug/messages')
          .send({ message: 'Hello' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Chat link not found or expired');
      });

      it('should return 404 for expired link', async () => {
        const mockLink = createMockLink({ expiresAt: new Date('2020-01-01') });

        mockStorage.getLink.mockResolvedValue(mockLink);

        const response = await request(app)
          .post('/api/chat/expired-slug/messages')
          .send({ message: 'Hello' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Chat link has expired');
      });

      it('should return 404 when project is not found after conversation creation', async () => {
        const mockLink = createMockLink();
        const mockConversation = createMockConversation();

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.createConversation.mockResolvedValue(mockConversation);
        mockStorage.createMessage.mockResolvedValue(createMockMessage());
        mockStorage.getProject.mockResolvedValue(undefined);

        const response = await request(app)
          .post('/api/chat/test-slug/messages')
          .send({ message: 'Hello' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Project not found');
      });
    });

    describe('Token counting and cost calculation', () => {
      it('should update conversation with correct token and cost totals', async () => {
        const mockLink = createMockLink();
        const mockProject = createMockProject();
        const mockConversation = createMockConversation({ totalTokens: 100, costUsd: 0.01 });
        const mockChunks = [createMockChunk()];
        const mockUserMessage = createMockMessage({ tokenCount: 10 });
        const mockAssistantMessage = createMockMessage({
          id: 'msg-002',
          role: 'assistant',
          tokenCount: 50,
        });

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getConversation.mockResolvedValue(mockConversation);
        mockStorage.createMessage
          .mockResolvedValueOnce(mockUserMessage)
          .mockResolvedValueOnce(mockAssistantMessage);
        mockStorage.getProject.mockResolvedValue(mockProject);
        mockStorage.searchChunks.mockResolvedValue(mockChunks);
        mockStorage.updateConversation.mockResolvedValue(mockConversation);

        mockChatWithAI.mockResolvedValue({
          content: 'Response',
          tokenCount: 50,
          citations: [],
        });

        await request(app)
          .post('/api/chat/test-slug/messages')
          .send({
            message: 'Question',
            conversationId: VALID_UUID.conversation,
          });

        expect(mockStorage.updateConversation).toHaveBeenCalledWith(VALID_UUID.conversation, {
          totalTokens: 160, // 100 + 10 + 50
          costUsd: expect.any(Number),
        });
      });
    });

    describe('Error handling', () => {
      it('should return 500 when AI chat fails', async () => {
        const mockLink = createMockLink();
        const mockProject = createMockProject();
        const mockConversation = createMockConversation();
        const mockChunks = [createMockChunk()];

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.createConversation.mockResolvedValue(mockConversation);
        mockStorage.createMessage.mockResolvedValue(createMockMessage());
        mockStorage.getProject.mockResolvedValue(mockProject);
        mockStorage.searchChunks.mockResolvedValue(mockChunks);

        mockChatWithAI.mockRejectedValue(new Error('AI service unavailable'));

        const response = await request(app)
          .post('/api/chat/test-slug/messages')
          .send({ message: 'Hello' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to process message');
      });

      it('should return 500 when database operation fails', async () => {
        mockStorage.getLink.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
          .post('/api/chat/test-slug/messages')
          .send({ message: 'Hello' });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to process message');
      });
    });
  });

  describe('GET /:slug/messages/:conversationId - Fetch conversation messages', () => {
    describe('Successful message retrieval', () => {
      it('should return all messages for a valid conversation', async () => {
        const mockLink = createMockLink();
        const mockConversation = createMockConversation();
        const mockMessages = [
          createMockMessage({ id: VALID_UUID.message, role: 'user', content: 'Hello' }),
          createMockMessage({ id: 'msg-002', role: 'assistant', content: 'Hi there!' }),
          createMockMessage({ id: 'msg-003', role: 'user', content: 'What is the valuation?' }),
          createMockMessage({ id: 'msg-004', role: 'assistant', content: 'The valuation is $10M.' }),
        ];

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getConversation.mockResolvedValue(mockConversation);
        mockStorage.getConversationMessages.mockResolvedValue(mockMessages);

        const response = await request(app)
          .get(`/api/chat/test-slug/messages/${VALID_UUID.conversation}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(4);
        expect(response.body[0].role).toBe('user');
        expect(response.body[1].role).toBe('assistant');
      });

      it('should return empty array for conversation with no messages', async () => {
        const mockLink = createMockLink();
        const mockConversation = createMockConversation();

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getConversation.mockResolvedValue(mockConversation);
        mockStorage.getConversationMessages.mockResolvedValue([]);

        const response = await request(app)
          .get(`/api/chat/test-slug/messages/${VALID_UUID.conversation}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
      });

      it('should include message metadata like citations and timestamps', async () => {
        const mockLink = createMockLink();
        const mockConversation = createMockConversation();
        const mockMessages = [
          createMockMessage({
            id: VALID_UUID.message,
            role: 'assistant',
            content: 'Here is the information.',
            citations: [{ source: 'document.pdf', content: 'excerpt', page: 3 }],
            timestamp: new Date('2024-01-15T10:30:00Z'),
          }),
        ];

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getConversation.mockResolvedValue(mockConversation);
        mockStorage.getConversationMessages.mockResolvedValue(mockMessages);

        const response = await request(app)
          .get(`/api/chat/test-slug/messages/${VALID_UUID.conversation}`);

        expect(response.status).toBe(200);
        expect(response.body[0].citations).toBeDefined();
        expect(response.body[0].timestamp).toBeDefined();
      });
    });

    describe('Authorization errors', () => {
      it('should return 400 for invalid conversation ID format', async () => {
        const response = await request(app)
          .get('/api/chat/test-slug/messages/invalid-id');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid conversation ID format');
      });

      it('should return 404 for non-existent link', async () => {
        mockStorage.getLink.mockResolvedValue(undefined);

        const response = await request(app)
          .get(`/api/chat/fake-slug/messages/${VALID_UUID.conversation}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Chat link not found or expired');
      });

      it('should return 404 for inactive link', async () => {
        const mockLink = createMockLink({ status: 'disabled' });

        mockStorage.getLink.mockResolvedValue(mockLink);

        const response = await request(app)
          .get(`/api/chat/disabled-slug/messages/${VALID_UUID.conversation}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Chat link not found or expired');
      });

      it('should return 404 for non-existent conversation', async () => {
        const mockLink = createMockLink();

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getConversation.mockResolvedValue(undefined);

        const response = await request(app)
          .get(`/api/chat/test-slug/messages/${VALID_UUID.conversation}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Conversation not found');
      });

      it('should return 404 when conversation belongs to different link', async () => {
        const mockLink = createMockLink({ id: VALID_UUID.link });
        const differentLinkId = '99eebc99-9c0b-4ef8-bb6d-6bb9bd380a99';
        const mockConversation = createMockConversation({ linkId: differentLinkId });

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getConversation.mockResolvedValue(mockConversation);

        const response = await request(app)
          .get(`/api/chat/test-slug/messages/${VALID_UUID.conversation}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Conversation not found');
      });
    });

    describe('Error handling', () => {
      it('should return 500 when storage throws an error', async () => {
        mockStorage.getLink.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
          .get(`/api/chat/test-slug/messages/${VALID_UUID.conversation}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to fetch messages');
      });

      it('should return 500 when getConversationMessages fails', async () => {
        const mockLink = createMockLink();
        const mockConversation = createMockConversation();

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getConversation.mockResolvedValue(mockConversation);
        mockStorage.getConversationMessages.mockRejectedValue(new Error('Query failed'));

        const response = await request(app)
          .get(`/api/chat/test-slug/messages/${VALID_UUID.conversation}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Failed to fetch messages');
      });
    });

    describe('Edge cases', () => {
      it('should handle UUID format conversation IDs', async () => {
        const mockLink = createMockLink();
        const mockConversation = createMockConversation({
          id: '550e8400-e29b-41d4-a716-446655440000',
        });

        mockStorage.getLink.mockResolvedValue(mockLink);
        mockStorage.getConversation.mockResolvedValue(mockConversation);
        mockStorage.getConversationMessages.mockResolvedValue([]);

        const response = await request(app)
          .get('/api/chat/test-slug/messages/550e8400-e29b-41d4-a716-446655440000');

        expect(response.status).toBe(200);
        expect(mockStorage.getConversation).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000');
      });
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete chat flow: get link info, create conversation, send messages, retrieve messages', async () => {
      const mockLink = createMockLink();
      const mockProject = createMockProject();
      const mockConversation = createMockConversation();
      const mockChunks = [createMockChunk()];

      // Step 1: Get link info
      mockStorage.getLink.mockResolvedValue(mockLink);
      mockStorage.getProject.mockResolvedValue(mockProject);
      mockStorage.getProjectDocumentCount.mockResolvedValue(2);

      let response = await request(app).get('/api/chat/test-slug');
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test Link');

      // Step 2: Send first message (creates conversation)
      mockStorage.createConversation.mockResolvedValue(mockConversation);
      mockStorage.createMessage
        .mockResolvedValueOnce(createMockMessage())
        .mockResolvedValueOnce(createMockMessage({ role: 'assistant' }));
      mockStorage.searchChunks.mockResolvedValue(mockChunks);
      mockStorage.updateConversation.mockResolvedValue(mockConversation);

      mockChatWithAI.mockResolvedValue({
        content: 'AI response',
        tokenCount: 20,
        citations: [],
      });

      response = await request(app)
        .post('/api/chat/test-slug/messages')
        .send({ message: 'First question' });

      expect(response.status).toBe(200);
      const conversationId = response.body.conversationId;
      expect(conversationId).toBe(VALID_UUID.conversation);

      // Step 3: Send follow-up message
      mockStorage.getConversation.mockResolvedValue(mockConversation);
      mockStorage.createMessage
        .mockResolvedValueOnce(createMockMessage())
        .mockResolvedValueOnce(createMockMessage({ role: 'assistant' }));

      response = await request(app)
        .post('/api/chat/test-slug/messages')
        .send({
          message: 'Follow-up question',
          conversationId,
        });

      expect(response.status).toBe(200);

      // Step 4: Retrieve all messages
      const allMessages = [
        createMockMessage({ role: 'user', content: 'First question' }),
        createMockMessage({ role: 'assistant', content: 'AI response' }),
        createMockMessage({ role: 'user', content: 'Follow-up question' }),
        createMockMessage({ role: 'assistant', content: 'AI response' }),
      ];
      mockStorage.getConversationMessages.mockResolvedValue(allMessages);

      response = await request(app)
        .get(`/api/chat/test-slug/messages/${conversationId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(4);
    });

    it('should reject all operations for expired links consistently', async () => {
      const expiredLink = createMockLink({
        expiresAt: new Date('2020-01-01'),
      });

      mockStorage.getLink.mockResolvedValue(expiredLink);

      // GET link info
      let response = await request(app).get('/api/chat/expired-slug');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Chat link has expired');

      // GET download list
      response = await request(app).get('/api/chat/expired-slug/download');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Chat link has expired');

      // POST message
      response = await request(app)
        .post('/api/chat/expired-slug/messages')
        .send({ message: 'Hello' });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Chat link has expired');
    });
  });
});
