import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  serial,
  integer,
  boolean,
  real,
  uuid,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password"), // For email/password auth
  provider: varchar("provider").default("local"), // local, google
  googleId: varchar("google_id").unique(), // For Google OAuth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  emailVerified: boolean("email_verified").default(false),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  tokens: integer("tokens").default(100000).notNull(), // Start with 100k free tokens
  subscriptionStatus: varchar("subscription_status"), // active, canceled, past_due, trialing
  subscriptionCurrentPeriodEnd: timestamp("subscription_current_period_end"),
  subscriptionIsAnnual: boolean("subscription_is_annual").default(false),
  emailAlerts: boolean("email_alerts").default(true),
  weeklyReports: boolean("weekly_reports").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("user_id").references(() => users.id).notNull(),
    name: varchar("name").notNull(),
    description: text("description"),
    defaultModel: varchar("default_model").default("gpt-4o"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("projects_user_id_idx").on(table.userId),
    userUpdatedIdx: index("projects_user_updated_at_idx").on(table.userId, table.updatedAt),
  }),
);

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").references(() => projects.id).notNull(),
    filename: varchar("filename").notNull(),
    originalName: varchar("original_name").notNull(),
    fileSize: integer("file_size").notNull(),
    mimeType: varchar("mime_type").notNull(),
    status: varchar("status").default("processing"), // processing, completed, failed
    tokens: integer("tokens").default(0),
    pageCount: integer("page_count"),
    source: varchar("source"), // e.g., "Direct Upload", "Dropbox: filename", "GitHub: repo/file"
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    projectIdIdx: index("documents_project_id_idx").on(table.projectId),
    projectOriginalNameUnique: uniqueIndex("documents_project_original_name_uq").on(table.projectId, table.originalName),
  }),
);

export const chunks = pgTable(
  "chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: uuid("document_id").references(() => documents.id).notNull(),
    content: text("content").notNull(),
    embedding: real("embedding").array(),
    metadata: jsonb("metadata"),
    tokenCount: integer("token_count").notNull(),
    chunkIndex: integer("chunk_index").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    documentIdIdx: index("chunks_document_id_idx").on(table.documentId),
    documentChunkIndexUnique: uniqueIndex("chunks_document_id_chunk_index_uq").on(table.documentId, table.chunkIndex),
  }),
);

export const links = pgTable(
  "links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").references(() => projects.id).notNull(),
    slug: varchar("slug").unique().notNull(),
    name: varchar("name").notNull(),
    status: varchar("status").default("active"), // active, expired, disabled
    expiresAt: timestamp("expires_at"),
    limitTokens: integer("limit_tokens").default(1000),
    allowDownloads: boolean("allow_downloads").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    projectIdIdx: index("links_project_id_idx").on(table.projectId),
    projectStatusIdx: index("links_project_status_idx").on(table.projectId, table.status),
  }),
);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    linkId: uuid("link_id").references(() => links.id).notNull(),
    investorEmail: varchar("investor_email"),
    startedAt: timestamp("started_at").defaultNow(),
    totalTokens: integer("total_tokens").default(0),
    costUsd: real("cost_usd").default(0),
    isActive: boolean("is_active").default(true),
    // Contact details (optional)
    contactName: varchar("contact_name"),
    contactPhone: varchar("contact_phone"),
    contactCompany: varchar("contact_company"),
    contactWebsite: varchar("contact_website"),
    contactProvidedAt: timestamp("contact_provided_at"),
  },
  (table) => ({
    linkIdIdx: index("conversations_link_id_idx").on(table.linkId),
    startedAtIdx: index("conversations_started_at_idx").on(table.startedAt),
  }),
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id").references(() => conversations.id).notNull(),
    role: varchar("role").notNull(), // user, assistant, system
    content: text("content").notNull(),
    tokenCount: integer("token_count").default(0),
    citations: jsonb("citations"),
    timestamp: timestamp("timestamp").defaultNow(),
  },
  (table) => ({
    conversationIdIdx: index("messages_conversation_id_idx").on(table.conversationId),
    conversationRoleIdx: index("messages_conversation_role_idx").on(table.conversationId, table.role),
  }),
);

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: varchar("token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const integrations = pgTable(
  "integrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id").references(() => projects.id).notNull(),
    platform: varchar("platform").notNull(), // github, notion, dropbox, etc.
    status: varchar("status").default("connected"), // connected, disconnected
    credentials: jsonb("credentials"), // encrypted credentials
    lastSyncedAt: timestamp("last_synced_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    projectIdIdx: index("integrations_project_id_idx").on(table.projectId),
    projectPlatformIdx: index("integrations_project_platform_idx").on(table.projectId, table.platform),
    projectPlatformUnique: uniqueIndex("integrations_project_platform_uq").on(table.projectId, table.platform),
  }),
);

// Token purchases and usage tracking
export const tokenPurchases = pgTable("token_purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(), // subscription, one_time
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  amount: integer("amount").notNull(), // in cents
  tokens: integer("tokens").notNull(), // tokens granted
  status: varchar("status").notNull(), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const tokenUsage = pgTable("token_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  conversationId: uuid("conversation_id").references(() => conversations.id),
  tokensUsed: integer("tokens_used").notNull(),
  action: varchar("action").notNull(), // chat, embedding
  model: varchar("model"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  tokenPurchases: many(tokenPurchases),
  tokenUsage: many(tokenUsage),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  documents: many(documents),
  links: many(links),
  integrations: many(integrations),
}));

export const documentsRelations = relations(documents, ({ one, many }) => ({
  project: one(projects, {
    fields: [documents.projectId],
    references: [projects.id],
  }),
  chunks: many(chunks),
}));

export const chunksRelations = relations(chunks, ({ one }) => ({
  document: one(documents, {
    fields: [chunks.documentId],
    references: [documents.id],
  }),
}));

export const linksRelations = relations(links, ({ one, many }) => ({
  project: one(projects, {
    fields: [links.projectId],
    references: [projects.id],
  }),
  conversations: many(conversations),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  link: one(links, {
    fields: [conversations.linkId],
    references: [links.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const integrationsRelations = relations(integrations, ({ one }) => ({
  project: one(projects, {
    fields: [integrations.projectId],
    references: [projects.id],
  }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}));

export const tokenPurchasesRelations = relations(tokenPurchases, ({ one }) => ({
  user: one(users, {
    fields: [tokenPurchases.userId],
    references: [users.id],
  }),
}));

export const tokenUsageRelations = relations(tokenUsage, ({ one }) => ({
  user: one(users, {
    fields: [tokenUsage.userId],
    references: [users.id],
  }),
  conversation: one(conversations, {
    fields: [tokenUsage.conversationId],
    references: [conversations.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChunkSchema = createInsertSchema(chunks).omit({
  id: true,
  createdAt: true,
});

export const insertLinkSchema = createInsertSchema(links).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  startedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  createdAt: true,
});

export const insertTokenPurchaseSchema = createInsertSchema(tokenPurchases).omit({
  id: true,
  createdAt: true,
});

export const insertTokenUsageSchema = createInsertSchema(tokenUsage).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertChunk = z.infer<typeof insertChunkSchema>;
export type Chunk = typeof chunks.$inferSelect;
export type InsertLink = z.infer<typeof insertLinkSchema>;
export type Link = typeof links.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type Integration = typeof integrations.$inferSelect;
export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertTokenPurchase = z.infer<typeof insertTokenPurchaseSchema>;
export type TokenPurchase = typeof tokenPurchases.$inferSelect;
export type InsertTokenUsage = z.infer<typeof insertTokenUsageSchema>;
export type TokenUsage = typeof tokenUsage.$inferSelect;
