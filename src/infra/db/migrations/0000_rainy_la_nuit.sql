CREATE TABLE "encurted_links" (
	"id" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"short_url" text NOT NULL,
	"redirect_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
