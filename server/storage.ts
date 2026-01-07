import {
  users,
  projects,
  documents,
  chunks,
  links,
  conversations,
  messages,
  integrations,
  passwordResetTokens,
  tokenPurchases,
  tokenUsage,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Document,
  type InsertDocument,
  type Chunk,
  type InsertChunk,
  type Link,
  type InsertLink,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Integration,
  type InsertIntegration,
  type PasswordResetToken,
  type InsertPasswordResetToken,
  type TokenPurchase,
  type InsertTokenPurchase,
  type TokenUsage,
  type InsertTokenUsage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, isNull, or, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: Partial<UpsertUser> & { email: string }): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  getUserProjects(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  
  // Document operations
  getProjectDocuments(projectId: string): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, updates: Partial<InsertDocument>): Promise<Document>;
  deleteDocument(id: string): Promise<void>;
  
  // Chunk operations
  getDocumentChunks(documentId: string): Promise<Chunk[]>;
  createChunk(chunk: InsertChunk): Promise<Chunk>;
  searchChunks(projectId: string, query: string, limit?: number): Promise<Chunk[]>;
  
  // Link operations
  getProjectLinks(projectId: string): Promise<Link[]>;
  getLink(slug: string): Promise<Link | undefined>;
  getLinkById(id: string): Promise<Link | undefined>;
  createLink(link: InsertLink): Promise<Link>;
  updateLink(id: string, updates: Partial<InsertLink>): Promise<Link>;
  deleteLink(id: string): Promise<void>;
  getUserLinksCount(userId: string): Promise<number>;
  
  // Conversation operations
  getLinkConversations(linkId: string): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationById(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<InsertConversation>): Promise<Conversation>;
  updateConversationContactDetails(conversationId: string, contactData: {
    contactName: string | null;
    contactPhone: string | null;
    contactCompany: string | null;
    contactWebsite: string | null;
    contactProvidedAt: Date;
  }): Promise<void>;
  
  // Message operations
  getConversationMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Analytics
  getUserAnalytics(userId: string): Promise<{
    totalQuestions: number;
    activeLinks: number;
    monthlyCost: number;
  }>;
  
  // User notification operations
  getUserIdFromConversation(conversationId: string): Promise<string | undefined>;
  getUserById(userId: string): Promise<User | undefined>;
  updateUserNotifications(userId: string, notifications: { emailAlerts?: boolean; weeklyReports?: boolean }): Promise<void>;
  
  // Integration operations
  getProjectIntegrations(projectId: string): Promise<Integration[]>;
  getIntegration(projectId: string, platform: string): Promise<Integration | undefined>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: string, updates: Partial<InsertIntegration>): Promise<Integration>;
  deleteIntegration(id: string): Promise<void>;
  
  // Password reset token operations
  createPasswordResetToken(userId: string): Promise<string>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  deletePasswordResetToken(token: string): Promise<void>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<void>;
  
  // Token and subscription operations
  updateUserTokens(userId: string, tokens: number): Promise<void>;
  deductUserTokens(userId: string, tokensUsed: number): Promise<boolean>;
  createTokenPurchase(purchase: InsertTokenPurchase): Promise<TokenPurchase>;
  createTokenUsage(usage: InsertTokenUsage): Promise<TokenUsage>;
  getUserTokenUsage(userId: string): Promise<TokenUsage[]>;
  updateUserSubscription(userId: string, subscription: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
    subscriptionCurrentPeriodEnd?: Date;
    subscriptionIsAnnual?: boolean;
  }): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async createUser(userData: Partial<UpsertUser> & { email: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData as any)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Project operations
  async getUserProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Document operations
  async getProjectDocuments(projectId: string): Promise<Document[]> {
    // Optimized: Single query with aggregated token counts instead of N+1 queries
    const docs = await db
      .select()
      .from(documents)
      .where(eq(documents.projectId, projectId))
      .orderBy(desc(documents.createdAt));

    if (docs.length === 0) {
      return [];
    }

    // Get all document IDs
    const docIds = docs.map(d => d.id);

    // Single query to get token counts for all documents
    // Cast to integer to avoid bigint string serialization issues
    const chunkStats = await db
      .select({
        documentId: chunks.documentId,
        totalTokens: sql<string>`COALESCE(SUM(${chunks.tokenCount})::integer, 0)`.as('totalTokens'),
        chunkCount: sql<string>`COUNT(*)::integer`.as('chunkCount'),
      })
      .from(chunks)
      .where(inArray(chunks.documentId, docIds))
      .groupBy(chunks.documentId);

    // Create a map for quick lookup - parse strings to numbers
    const statsMap = new Map(chunkStats.map(s => [s.documentId, {
      ...s,
      totalTokens: parseInt(String(s.totalTokens), 10) || 0
    }]));

    // Merge stats with documents
    return docs.map(doc => ({
      ...doc,
      tokens: statsMap.get(doc.id)?.totalTokens || doc.tokens || 0,
      chunks: [] // Don't load full chunk data - not needed for list view
    }));
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const [newDocument] = await db.insert(documents).values(document).returning();
    return newDocument;
  }

  async updateDocument(id: string, updates: Partial<InsertDocument>): Promise<Document> {
    const [updatedDocument] = await db
      .update(documents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return updatedDocument;
  }

  async deleteDocument(id: string): Promise<void> {
    // First delete all chunks associated with this document
    await db.delete(chunks).where(eq(chunks.documentId, id));
    // Then delete the document itself
    await db.delete(documents).where(eq(documents.id, id));
  }

  async checkDuplicateDocument(projectId: string, originalName: string): Promise<boolean> {
    const [existing] = await db
      .select()
      .from(documents)
      .where(and(
        eq(documents.projectId, projectId),
        eq(documents.originalName, originalName)
      ))
      .limit(1);
    
    return !!existing;
  }

  async getProjectDocumentCount(projectId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(documents)
      .where(eq(documents.projectId, projectId));
    return Number(result[0]?.count) || 0;
  }

  // Chunk operations
  async getDocumentChunks(documentId: string): Promise<Chunk[]> {
    return await db
      .select()
      .from(chunks)
      .where(eq(chunks.documentId, documentId))
      .orderBy(chunks.chunkIndex);
  }

  async createChunk(chunk: InsertChunk): Promise<Chunk> {
    const [newChunk] = await db.insert(chunks).values(chunk).returning();
    return newChunk;
  }

  async searchChunks(projectId: string, query: string, limit = 12): Promise<Chunk[]> {
    // This is a simplified search - in production, you'd use vector similarity
    const results = await db
      .select({
        id: chunks.id,
        documentId: chunks.documentId,
        content: chunks.content,
        embedding: chunks.embedding,
        metadata: chunks.metadata,
        tokenCount: chunks.tokenCount,
        chunkIndex: chunks.chunkIndex,
        createdAt: chunks.createdAt,
      })
      .from(chunks)
      .innerJoin(documents, eq(chunks.documentId, documents.id))
      .where(eq(documents.projectId, projectId))
      .limit(limit);
    
    return results;
  }

  // Link operations
  async getProjectLinks(projectId: string): Promise<Link[]> {
    return await db
      .select()
      .from(links)
      .where(eq(links.projectId, projectId))
      .orderBy(desc(links.createdAt));
  }

  async getLink(slug: string): Promise<Link | undefined> {
    const [link] = await db.select().from(links).where(eq(links.slug, slug));
    return link;
  }

  async getLinkById(id: string): Promise<Link | undefined> {
    const [link] = await db.select().from(links).where(eq(links.id, id));
    return link;
  }

  async createLink(link: InsertLink): Promise<Link> {
    const [newLink] = await db.insert(links).values(link).returning();
    return newLink;
  }

  async updateLink(id: string, updates: Partial<InsertLink>): Promise<Link> {
    const [updatedLink] = await db
      .update(links)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(links.id, id))
      .returning();
    return updatedLink;
  }

  async deleteLink(id: string): Promise<void> {
    await db.delete(links).where(eq(links.id, id));
  }

  async getUserLinksCount(userId: string): Promise<number> {
    const userProjects = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.userId, userId));
    
    if (userProjects.length === 0) {
      return 0;
    }
    
    const projectIds = userProjects.map(p => p.id);
    const linksCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(links)
      .where(inArray(links.projectId, projectIds));
    
    return linksCount[0]?.count || 0;
  }

  // Conversation operations
  async getLinkConversations(linkId: string): Promise<Conversation[]> {
    return await db
      .select()
      .from(conversations)
      .where(eq(conversations.linkId, linkId))
      .orderBy(desc(conversations.startedAt));
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [newConversation] = await db.insert(conversations).values(conversation).returning();
    return newConversation;
  }

  async updateConversation(id: string, updates: Partial<InsertConversation>): Promise<Conversation> {
    const [updatedConversation] = await db
      .update(conversations)
      .set(updates)
      .where(eq(conversations.id, id))
      .returning();
    return updatedConversation;
  }

  async getConversationById(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation;
  }

  async updateConversationContactDetails(conversationId: string, contactData: {
    contactName: string | null;
    contactPhone: string | null;
    contactCompany: string | null;
    contactWebsite: string | null;
    contactProvidedAt: Date;
  }): Promise<void> {
    await db
      .update(conversations)
      .set(contactData)
      .where(eq(conversations.id, conversationId));
  }

  // Message operations
  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.timestamp);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  // Get all conversations for a user's projects
  async getUserConversations(userId: string): Promise<any[]> {
    const userProjects = await this.getUserProjects(userId);
    const projectIds = userProjects.map(p => p.id);

    if (projectIds.length === 0) {
      return [];
    }

    const conversationsWithDetails = await db
      .select({
        id: conversations.id,
        investorEmail: conversations.investorEmail,
        startedAt: conversations.startedAt,
        totalTokens: conversations.totalTokens,
        costUsd: conversations.costUsd,
        isActive: conversations.isActive,
        linkId: conversations.linkId,
        linkName: links.name,
        projectId: links.projectId,
        projectName: projects.name,
        // Contact details
        contactName: conversations.contactName,
        contactPhone: conversations.contactPhone,
        contactCompany: conversations.contactCompany,
        contactWebsite: conversations.contactWebsite,
        contactProvidedAt: conversations.contactProvidedAt,
      })
      .from(conversations)
      .innerJoin(links, eq(conversations.linkId, links.id))
      .innerJoin(projects, eq(links.projectId, projects.id))
      .where(or(...projectIds.map(id => eq(links.projectId, id))))
      .orderBy(desc(conversations.startedAt));

    return conversationsWithDetails;
  }

  // Analytics
  async getUserAnalytics(userId: string): Promise<{
    totalQuestions: number;
    activeLinks: number;
    monthlyCost: number;
  }> {
    // Get user's projects
    const userProjects = await this.getUserProjects(userId);
    const projectIds = userProjects.map(p => p.id);

    if (projectIds.length === 0) {
      return { totalQuestions: 0, activeLinks: 0, monthlyCost: 0 };
    }

    // Count active links
    const activeLinks = await db
      .select()
      .from(links)
      .where(
        and(
          eq(links.status, "active"),
          or(...projectIds.map(id => eq(links.projectId, id)))
        )
      );

    // Count total questions (messages with role 'user')
    const totalQuestions = await db
      .select()
      .from(messages)
      .innerJoin(conversations, eq(messages.conversationId, conversations.id))
      .innerJoin(links, eq(conversations.linkId, links.id))
      .where(
        and(
          eq(messages.role, "user"),
          or(...projectIds.map(id => eq(links.projectId, id)))
        )
      );

    // Calculate monthly cost (simplified - in production, you'd sum actual costs)
    const monthlyCost = totalQuestions.length * 0.001; // $0.001 per question estimate

    return {
      totalQuestions: totalQuestions.length,
      activeLinks: activeLinks.length,
      monthlyCost: Math.round(monthlyCost * 100) / 100,
    };
  }

  // Comprehensive Analytics
  async getDetailedAnalytics(userId: string): Promise<any> {
    const userProjects = await this.getUserProjects(userId);
    const projectIds = userProjects.map(p => p.id);

    if (projectIds.length === 0) {
      return {
        overview: {
          totalProjects: 0,
          totalDocuments: 0,
          totalConversations: 0,
          totalTokensUsed: 0,
          totalCost: 0,
          totalLinks: 0,
          activeLinks: 0,
          totalVisitors: 0,
        },
        timeSeriesData: [],
        projectBreakdown: [],
        documentStats: {
          byType: [],
          byStatus: [],
          totalSize: 0,
        },
        linkPerformance: [],
        visitorEngagement: {
          averageMessagesPerConversation: 0,
          averageTokensPerConversation: 0,
          topVisitors: [],
        },
      };
    }

    // Overview Stats
    const allDocuments = await db
      .select()
      .from(documents)
      .where(or(...projectIds.map(id => eq(documents.projectId, id))));

    const allLinks = await db
      .select()
      .from(links)
      .where(or(...projectIds.map(id => eq(links.projectId, id))));

    const allConversations = await db
      .select({
        id: conversations.id,
        investorEmail: conversations.investorEmail,
        totalTokens: conversations.totalTokens,
        costUsd: conversations.costUsd,
        startedAt: conversations.startedAt,
        linkId: conversations.linkId,
      })
      .from(conversations)
      .innerJoin(links, eq(conversations.linkId, links.id))
      .where(or(...projectIds.map(id => eq(links.projectId, id))));

    const allMessages = await db
      .select({
        id: messages.id,
        conversationId: messages.conversationId,
        role: messages.role,
        tokenCount: messages.tokenCount,
        timestamp: messages.timestamp,
      })
      .from(messages)
      .innerJoin(conversations, eq(messages.conversationId, conversations.id))
      .innerJoin(links, eq(conversations.linkId, links.id))
      .where(or(...projectIds.map(id => eq(links.projectId, id))));

    // Time Series Data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const timeSeriesData = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayConversations = allConversations.filter(c => {
        if (!c.startedAt) return false;
        const startedAt = new Date(c.startedAt);
        return startedAt >= dayStart && startedAt <= dayEnd;
      });

      const dayMessages = allMessages.filter(m => {
        if (!m.timestamp) return false;
        const timestamp = new Date(m.timestamp);
        return timestamp >= dayStart && timestamp <= dayEnd;
      });

      timeSeriesData.unshift({
        date: dayStart.toISOString().split('T')[0],
        conversations: dayConversations.length,
        messages: dayMessages.length,
        tokens: dayMessages.reduce((sum, m) => sum + (m.tokenCount || 0), 0),
        cost: dayConversations.reduce((sum, c) => sum + (c.costUsd || 0), 0),
      });
    }

    // Project Breakdown
    const projectBreakdown = await Promise.all(userProjects.map(async (project) => {
      const projectDocs = allDocuments.filter(d => d.projectId === project.id);
      const projectLinks = allLinks.filter(l => l.projectId === project.id);
      const projectConvs = await db
        .select()
        .from(conversations)
        .innerJoin(links, eq(conversations.linkId, links.id))
        .where(eq(links.projectId, project.id));

      return {
        projectId: project.id,
        projectName: project.name,
        documents: projectDocs.length,
        links: projectLinks.length,
        conversations: projectConvs.length,
        totalTokens: projectConvs.reduce((sum, c) => sum + (c.conversations.totalTokens || 0), 0),
        totalCost: projectConvs.reduce((sum, c) => sum + (c.conversations.costUsd || 0), 0),
      };
    }));

    // Document Stats
    const documentTypes = allDocuments.reduce((acc, doc) => {
      const type = doc.mimeType.split('/')[1] || 'other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const documentStatus = allDocuments.reduce((acc, doc) => {
      acc[doc.status || 'unknown'] = (acc[doc.status || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Link Performance
    const linkPerformance = await Promise.all(allLinks.map(async (link) => {
      const linkConvs = allConversations.filter(c => c.linkId === link.id);
      return {
        linkId: link.id,
        linkName: link.name,
        status: link.status,
        conversations: linkConvs.length,
        uniqueVisitors: new Set(linkConvs.map(c => c.investorEmail).filter(Boolean)).size,
        totalTokens: linkConvs.reduce((sum, c) => sum + (c.totalTokens || 0), 0),
        totalCost: linkConvs.reduce((sum, c) => sum + (c.costUsd || 0), 0),
        createdAt: link.createdAt,
      };
    }));

    // Visitor Engagement
    const visitorStats = allConversations.reduce((acc, conv) => {
      const email = conv.investorEmail || 'Anonymous';
      if (!acc[email]) {
        acc[email] = {
          email,
          conversations: 0,
          totalTokens: 0,
          totalCost: 0,
        };
      }
      acc[email].conversations += 1;
      acc[email].totalTokens += conv.totalTokens || 0;
      acc[email].totalCost += conv.costUsd || 0;
      return acc;
    }, {} as Record<string, any>);

    const topVisitors = Object.values(visitorStats)
      .sort((a, b) => b.conversations - a.conversations)
      .slice(0, 10);

    return {
      overview: {
        totalProjects: userProjects.length,
        totalDocuments: allDocuments.length,
        totalConversations: allConversations.length,
        totalTokensUsed: allConversations.reduce((sum, c) => sum + (c.totalTokens || 0), 0),
        totalCost: allConversations.reduce((sum, c) => sum + (c.costUsd || 0), 0),
        totalLinks: allLinks.length,
        activeLinks: allLinks.filter(l => l.status === 'active').length,
        totalVisitors: new Set(allConversations.map(c => c.investorEmail).filter(Boolean)).size,
      },
      timeSeriesData,
      projectBreakdown,
      documentStats: {
        byType: Object.entries(documentTypes).map(([type, count]) => ({ type, count })),
        byStatus: Object.entries(documentStatus).map(([status, count]) => ({ status, count })),
        totalSize: allDocuments.reduce((sum, d) => sum + (d.fileSize || 0), 0),
      },
      linkPerformance,
      visitorEngagement: {
        averageMessagesPerConversation: allConversations.length > 0 
          ? Math.round(allMessages.length / allConversations.length * 10) / 10 
          : 0,
        averageTokensPerConversation: allConversations.length > 0
          ? Math.round(allConversations.reduce((sum, c) => sum + (c.totalTokens || 0), 0) / allConversations.length)
          : 0,
        topVisitors,
      },
    };
  }

  // Integration operations
  async getProjectIntegrations(projectId: string): Promise<Integration[]> {
    return await db
      .select()
      .from(integrations)
      .where(eq(integrations.projectId, projectId))
      .orderBy(desc(integrations.createdAt));
  }

  async getIntegration(projectId: string, platform: string): Promise<Integration | undefined> {
    const [integration] = await db
      .select()
      .from(integrations)
      .where(
        and(
          eq(integrations.projectId, projectId),
          eq(integrations.platform, platform)
        )
      );
    return integration;
  }

  async createIntegration(integration: InsertIntegration): Promise<Integration> {
    const [newIntegration] = await db.insert(integrations).values(integration).returning();
    return newIntegration;
  }

  async updateIntegration(id: string, updates: Partial<InsertIntegration>): Promise<Integration> {
    const [updatedIntegration] = await db
      .update(integrations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(integrations.id, id))
      .returning();
    return updatedIntegration;
  }

  async deleteIntegration(id: string): Promise<void> {
    await db.delete(integrations).where(eq(integrations.id, id));
  }

  // User notification operations
  async getUserIdFromConversation(conversationId: string): Promise<string | undefined> {
    const conversation = await this.getConversation(conversationId);
    if (!conversation) return undefined;
    
    const link = await db.select().from(links).where(eq(links.id, conversation.linkId)).limit(1);
    if (!link[0]) return undefined;
    
    const project = await this.getProject(link[0].projectId);
    return project?.userId;
  }

  async getUserById(userId: string): Promise<User | undefined> {
    return this.getUser(userId);
  }

  async updateUserNotifications(userId: string, notifications: { emailAlerts?: boolean; weeklyReports?: boolean }): Promise<void> {
    await db
      .update(users)
      .set({
        emailAlerts: notifications.emailAlerts,
        weeklyReports: notifications.weeklyReports,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  // Password reset token operations
  async createPasswordResetToken(userId: string): Promise<string> {
    // Generate a secure random token
    const token = `prt_${Math.random().toString(36).substr(2, 9)}${Math.random().toString(36).substr(2, 9)}`;
    
    // Set expiration to 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    
    // Delete any existing tokens for this user
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));
    
    // Create new token
    await db.insert(passwordResetTokens).values({
      userId,
      token,
      expiresAt,
    });
    
    return token;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token));
    
    if (!resetToken) return undefined;
    
    // Check if token has expired
    if (new Date() > resetToken.expiresAt) {
      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));
      return undefined;
    }
    
    return resetToken;
  }

  async deletePasswordResetToken(token: string): Promise<void> {
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token));
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));
  }

  // Token and subscription operations
  async updateUserTokens(userId: string, tokens: number): Promise<void> {
    await db
      .update(users)
      .set({ tokens })
      .where(eq(users.id, userId));
  }

  async deductUserTokens(userId: string, tokensUsed: number): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user || user.tokens < tokensUsed) {
      return false;
    }
    
    await db
      .update(users)
      .set({ tokens: user.tokens - tokensUsed })
      .where(eq(users.id, userId));
    
    return true;
  }

  async createTokenPurchase(purchase: InsertTokenPurchase): Promise<TokenPurchase> {
    const [newPurchase] = await db.insert(tokenPurchases).values(purchase).returning();
    return newPurchase;
  }

  async createTokenUsage(usage: InsertTokenUsage): Promise<TokenUsage> {
    const [newUsage] = await db.insert(tokenUsage).values(usage).returning();
    return newUsage;
  }

  async getUserTokenUsage(userId: string): Promise<TokenUsage[]> {
    return await db
      .select()
      .from(tokenUsage)
      .where(eq(tokenUsage.userId, userId))
      .orderBy(desc(tokenUsage.createdAt));
  }

  async updateUserSubscription(userId: string, subscription: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: string;
    subscriptionCurrentPeriodEnd?: Date;
    subscriptionIsAnnual?: boolean;
  }): Promise<void> {
    await db
      .update(users)
      .set({
        ...subscription,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }

  async deleteUserData(userId: string): Promise<void> {
    // Get all user projects
    const userProjects = await this.getUserProjects(userId);

    // Delete all project-related data
    for (const project of userProjects) {
      // Get all documents and delete them
      const projectDocs = await this.getProjectDocuments(project.id);
      for (const doc of projectDocs) {
        // Delete chunks first
        await db.delete(chunks).where(eq(chunks.documentId, doc.id));
        // Delete document
        await db.delete(documents).where(eq(documents.id, doc.id));
      }

      // Get all links and their conversations
      const projectLinks = await this.getProjectLinks(project.id);
      for (const link of projectLinks) {
        // Get all conversations for this link
        const linkConversations = await this.getLinkConversations(link.id);
        for (const conv of linkConversations) {
          // Delete messages
          await db.delete(messages).where(eq(messages.conversationId, conv.id));
          // Delete conversation
          await db.delete(conversations).where(eq(conversations.id, conv.id));
        }
        // Delete link
        await db.delete(links).where(eq(links.id, link.id));
      }

      // Delete integrations
      await db.delete(integrations).where(eq(integrations.projectId, project.id));

      // Delete project
      await db.delete(projects).where(eq(projects.id, project.id));
    }

    // Delete token usage records
    await db.delete(tokenUsage).where(eq(tokenUsage.userId, userId));

    // Delete password reset tokens
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));

    // Delete the user
    await db.delete(users).where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
