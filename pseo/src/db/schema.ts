import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const pseoIndustries = pgTable("pseo_industries", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const pseoStages = pgTable("pseo_stages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const pseoPageTypes = pgTable("pseo_page_types", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const pseoPages = pgTable("pseo_pages", {
  id: serial("id").primaryKey(),
  industryId: integer("industry_id")
    .references(() => pseoIndustries.id)
    .notNull(),
  stageId: integer("stage_id").references(() => pseoStages.id).notNull(),
  pageTypeId: integer("page_type_id")
    .references(() => pseoPageTypes.id)
    .notNull(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  summary: text("summary"),
  seoTitle: varchar("seo_title", { length: 200 }),
  seoDescription: varchar("seo_description", { length: 320 }),
  canonicalPath: varchar("canonical_path", { length: 256 }),
  ctaText: varchar("cta_text", { length: 160 }),
  dataQualityScore: integer("data_quality_score"),
  isPublished: boolean("is_published").default(false).notNull(),
  rawData: jsonb("raw_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const pseoInvestorQuestions = pgTable("pseo_investor_questions", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").references(() => pseoPages.id).notNull(),
  category: varchar("category", { length: 120 }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const pseoBenchmarks = pgTable("pseo_benchmarks", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").references(() => pseoPages.id).notNull(),
  metric: varchar("metric", { length: 160 }).notNull(),
  value: varchar("value", { length: 160 }).notNull(),
  unit: varchar("unit", { length: 64 }),
  source: varchar("source", { length: 160 }),
  notes: text("notes"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const pseoDeckSections = pgTable("pseo_deck_sections", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").references(() => pseoPages.id).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  guidance: text("guidance"),
  goal: text("goal"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const pseoChecklistItems = pgTable("pseo_checklist_items", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").references(() => pseoPages.id).notNull(),
  item: text("item").notNull(),
  rationale: text("rationale"),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const pseoInvestorUpdates = pgTable("pseo_investor_updates", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").references(() => pseoPages.id).notNull(),
  section: varchar("section", { length: 160 }).notNull(),
  content: text("content").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const pseoObjections = pgTable("pseo_objections", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").references(() => pseoPages.id).notNull(),
  objection: text("objection").notNull(),
  response: text("response").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});
