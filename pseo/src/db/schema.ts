import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
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

/**
 * UGC intake for anonymized investor questions (moderated before publishing).
 */
export const pseoUgcSubmissions = pgTable(
  "pseo_ugc_submissions",
  {
    id: serial("id").primaryKey(),
    industrySlug: varchar("industry_slug", { length: 64 }).notNull(),
    stageSlug: varchar("stage_slug", { length: 64 }).notNull(),
    category: varchar("category", { length: 120 }),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    contactEmail: varchar("contact_email", { length: 200 }),
    sourceUrl: varchar("source_url", { length: 256 }),
    consent: boolean("consent").default(false).notNull(),
    status: varchar("status", { length: 32 }).default("pending").notNull(),
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: text("user_agent"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("pseo_ugc_submissions_industry_stage_idx").on(
      table.industrySlug,
      table.stageSlug
    ),
    index("pseo_ugc_submissions_status_idx").on(table.status),
    index("pseo_ugc_submissions_ip_hash_idx").on(table.ipHash),
  ]
);

/**
 * Anonymized investor question analytics with k-anonymity (k >= 10).
 * Stores aggregated metrics only—no individual user data.
 * Used for proprietary data differentiation and content optimization.
 */
export const pseoQuestionAnalytics = pgTable(
  "pseo_question_analytics",
  {
    id: serial("id").primaryKey(),
    /** The industry this aggregate belongs to */
    industrySlug: varchar("industry_slug", { length: 64 }).notNull(),
    /** The stage this aggregate belongs to */
    stageSlug: varchar("stage_slug", { length: 64 }).notNull(),
    /** Question category (e.g., "Unit Economics", "Regulatory") */
    category: varchar("category", { length: 120 }).notNull(),
    /** Aggregation period start (monthly granularity) */
    periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
    /** Total views for questions in this category (only stored if >= 10 for k-anonymity) */
    totalViews: integer("total_views").default(0).notNull(),
    /** Average helpfulness rating (1-5 scale, only stored if sample size >= 10) */
    avgHelpfulnessRating: integer("avg_helpfulness_rating"),
    /** Number of ratings that contributed to the average (must be >= 10) */
    ratingCount: integer("rating_count").default(0).notNull(),
    /** Number of times users expanded/read full answers */
    answerExpansions: integer("answer_expansions").default(0).notNull(),
    /** Number of times users copied answer content */
    answerCopies: integer("answer_copies").default(0).notNull(),
    /** Top search terms leading to this category (aggregated, min 10 occurrences each) */
    topSearchTerms: jsonb("top_search_terms"),
    /** Whether this row meets k-anonymity threshold and can be displayed */
    meetsKThreshold: boolean("meets_k_threshold").default(false).notNull(),
    /** Timestamp when this aggregate was computed */
    computedAt: timestamp("computed_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Unique constraint for upsert operations
    uniqueIndex("pseo_question_analytics_lookup_idx").on(
      table.industrySlug,
      table.stageSlug,
      table.category,
      table.periodStart
    ),
    // Index for querying by industry/stage (dashboard queries)
    index("pseo_question_analytics_industry_stage_idx").on(
      table.industrySlug,
      table.stageSlug
    ),
    // Index for filtering by k-threshold compliance
    index("pseo_question_analytics_k_threshold_idx").on(table.meetsKThreshold),
  ]
);

/**
 * Raw event log for analytics (short retention, used only for aggregation).
 * Individual events are deleted after aggregation to ensure privacy.
 * Events are never exposed directly—only aggregates meeting k-anonymity.
 */
export const pseoAnalyticsEvents = pgTable(
  "pseo_analytics_events",
  {
    id: serial("id").primaryKey(),
    /** Hashed session identifier (not user-identifiable) */
    sessionHash: varchar("session_hash", { length: 64 }).notNull(),
    /** Event type: view, rating, expansion, copy */
    eventType: varchar("event_type", { length: 32 }).notNull(),
    /** Industry context */
    industrySlug: varchar("industry_slug", { length: 64 }).notNull(),
    /** Stage context */
    stageSlug: varchar("stage_slug", { length: 64 }).notNull(),
    /** Question category */
    category: varchar("category", { length: 120 }),
    /** Rating value (1-5) for rating events */
    ratingValue: integer("rating_value"),
    /** Search term if event came from search (hashed if potentially identifying) */
    searchTermHash: varchar("search_term_hash", { length: 64 }),
    /** Event timestamp */
    eventAt: timestamp("event_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    // Primary aggregation index - covers GROUP BY in aggregation job
    index("pseo_analytics_events_aggregation_idx").on(
      table.industrySlug,
      table.stageSlug,
      table.category,
      table.eventAt
    ),
    // Index for cleanup job (delete old events)
    index("pseo_analytics_events_cleanup_idx").on(table.eventAt),
    // Index for event type filtering during aggregation
    index("pseo_analytics_events_type_idx").on(table.eventType),
  ]
);
