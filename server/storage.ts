import {
  users,
  projects,
  documents,
  chunks,
  links,
  conversations,
  messages,
  integrations,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, isNull, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
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
  createLink(link: InsertLink): Promise<Link>;
  updateLink(id: string, updates: Partial<InsertLink>): Promise<Link>;
  deleteLink(id: string): Promise<void>;
  
  // Conversation operations
  getLinkConversations(linkId: string): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<InsertConversation>): Promise<Conversation>;
  
  // Message operations
  getConversationMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Analytics
  getUserAnalytics(userId: string): Promise<{
    totalQuestions: number;
    activeLinks: number;
    monthlyCost: number;
  }>;
  
  // Integration operations
  getProjectIntegrations(projectId: string): Promise<Integration[]>;
  getIntegration(projectId: string, platform: string): Promise<Integration | undefined>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: string, updates: Partial<InsertIntegration>): Promise<Integration>;
  deleteIntegration(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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
    const docs = await db
      .select()
      .from(documents)
      .where(eq(documents.projectId, projectId))
      .orderBy(desc(documents.createdAt));
    
    // Add token count and chunks info from chunks table
    const docsWithTokens = await Promise.all(
      docs.map(async (doc) => {
        const docChunks = await db
          .select()
          .from(chunks)
          .where(eq(chunks.documentId, doc.id));
        
        const totalTokens = docChunks.reduce((sum, chunk) => sum + (chunk.tokenCount || 0), 0);
        
        return {
          ...doc,
          tokens: totalTokens || doc.tokens || 0,
          chunks: docChunks
        };
      })
    );
    
    return docsWithTokens;
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
    await db.delete(documents).where(eq(documents.id, id));
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
}

export const storage = new DatabaseStorage();
