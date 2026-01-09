CREATE TABLE "pseo_analytics_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_hash" varchar(64) NOT NULL,
	"event_type" varchar(32) NOT NULL,
	"industry_slug" varchar(64) NOT NULL,
	"stage_slug" varchar(64) NOT NULL,
	"category" varchar(120),
	"rating_value" integer,
	"search_term_hash" varchar(64),
	"event_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pseo_benchmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_id" integer NOT NULL,
	"metric" varchar(160) NOT NULL,
	"value" varchar(160) NOT NULL,
	"unit" varchar(64),
	"source" varchar(160),
	"notes" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pseo_checklist_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_id" integer NOT NULL,
	"item" text NOT NULL,
	"rationale" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pseo_deck_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_id" integer NOT NULL,
	"title" varchar(160) NOT NULL,
	"guidance" text,
	"goal" text,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pseo_industries" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(64) NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pseo_industries_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pseo_investor_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_id" integer NOT NULL,
	"category" varchar(120),
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pseo_investor_updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_id" integer NOT NULL,
	"section" varchar(160) NOT NULL,
	"content" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pseo_objections" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_id" integer NOT NULL,
	"objection" text NOT NULL,
	"response" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pseo_page_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(64) NOT NULL,
	"name" varchar(128) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pseo_page_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pseo_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"industry_id" integer NOT NULL,
	"stage_id" integer NOT NULL,
	"page_type_id" integer NOT NULL,
	"slug" varchar(256) NOT NULL,
	"title" varchar(200) NOT NULL,
	"summary" text,
	"seo_title" varchar(200),
	"seo_description" varchar(320),
	"canonical_path" varchar(256),
	"cta_text" varchar(160),
	"data_quality_score" integer,
	"is_published" boolean DEFAULT false NOT NULL,
	"raw_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pseo_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "pseo_question_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"industry_slug" varchar(64) NOT NULL,
	"stage_slug" varchar(64) NOT NULL,
	"category" varchar(120) NOT NULL,
	"period_start" timestamp with time zone NOT NULL,
	"total_views" integer DEFAULT 0 NOT NULL,
	"avg_helpfulness_rating" integer,
	"rating_count" integer DEFAULT 0 NOT NULL,
	"answer_expansions" integer DEFAULT 0 NOT NULL,
	"answer_copies" integer DEFAULT 0 NOT NULL,
	"top_search_terms" jsonb,
	"meets_k_threshold" boolean DEFAULT false NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pseo_stages" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(64) NOT NULL,
	"name" varchar(128) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pseo_stages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "pseo_benchmarks" ADD CONSTRAINT "pseo_benchmarks_page_id_pseo_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pseo_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pseo_checklist_items" ADD CONSTRAINT "pseo_checklist_items_page_id_pseo_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pseo_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pseo_deck_sections" ADD CONSTRAINT "pseo_deck_sections_page_id_pseo_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pseo_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pseo_investor_questions" ADD CONSTRAINT "pseo_investor_questions_page_id_pseo_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pseo_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pseo_investor_updates" ADD CONSTRAINT "pseo_investor_updates_page_id_pseo_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pseo_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pseo_objections" ADD CONSTRAINT "pseo_objections_page_id_pseo_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pseo_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pseo_pages" ADD CONSTRAINT "pseo_pages_industry_id_pseo_industries_id_fk" FOREIGN KEY ("industry_id") REFERENCES "public"."pseo_industries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pseo_pages" ADD CONSTRAINT "pseo_pages_stage_id_pseo_stages_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."pseo_stages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pseo_pages" ADD CONSTRAINT "pseo_pages_page_type_id_pseo_page_types_id_fk" FOREIGN KEY ("page_type_id") REFERENCES "public"."pseo_page_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pseo_analytics_events_aggregation_idx" ON "pseo_analytics_events" USING btree ("industry_slug","stage_slug","category","event_at");--> statement-breakpoint
CREATE INDEX "pseo_analytics_events_cleanup_idx" ON "pseo_analytics_events" USING btree ("event_at");--> statement-breakpoint
CREATE INDEX "pseo_analytics_events_type_idx" ON "pseo_analytics_events" USING btree ("event_type");--> statement-breakpoint
CREATE UNIQUE INDEX "pseo_question_analytics_lookup_idx" ON "pseo_question_analytics" USING btree ("industry_slug","stage_slug","category","period_start");--> statement-breakpoint
CREATE INDEX "pseo_question_analytics_industry_stage_idx" ON "pseo_question_analytics" USING btree ("industry_slug","stage_slug");--> statement-breakpoint
CREATE INDEX "pseo_question_analytics_k_threshold_idx" ON "pseo_question_analytics" USING btree ("meets_k_threshold");