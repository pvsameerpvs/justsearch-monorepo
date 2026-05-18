-- Migration 0009: Move game_sessions to public schema
-- game_sessions becomes global (one table for all restaurants)
-- Each session still tracks restaurant_id to know where the user played

-- Step 1: Create public.game_sessions (same schema as original)
CREATE TABLE IF NOT EXISTS "public"."game_sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "restaurant_id" uuid NOT NULL,
  "game_id" varchar(100) NOT NULL,
  "customer_id" uuid,
  "score" integer NOT NULL,
  "points_awarded" integer DEFAULT 0 NOT NULL,
  "level" integer,
  "scoring_version" varchar(20) NOT NULL,
  "played_at" timestamp with time zone DEFAULT now() NOT NULL,
  "metadata" jsonb DEFAULT '{}' NOT NULL
);
--> statement-breakpoint

-- Step 2: Add FK constraints
ALTER TABLE "public"."game_sessions" ADD CONSTRAINT "game_sessions_restaurant_id_restaurants_id_fk" FOREIGN KEY ("restaurant_id") REFERENCES "public"."restaurants"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "public"."game_sessions" ADD CONSTRAINT "game_sessions_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint

-- Step 3: Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS "game_sessions_customer_id_played_at_idx" ON "public"."game_sessions" ("customer_id", "played_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "game_sessions_restaurant_id_idx" ON "public"."game_sessions" ("restaurant_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "game_sessions_game_id_idx" ON "public"."game_sessions" ("game_id");
--> statement-breakpoint

-- Step 4: Migrate data from all tenant schemas into public.game_sessions
DO $$
DECLARE
  schema_record RECORD;
BEGIN
  FOR schema_record IN SELECT schema_name FROM public.restaurants LOOP
    EXECUTE format(
      'INSERT INTO public.game_sessions (id, restaurant_id, game_id, customer_id, score, points_awarded, level, scoring_version, played_at, metadata) ' ||
      'SELECT id, restaurant_id, game_id, customer_id, score, points_awarded, level, scoring_version, played_at, metadata FROM %I."game_sessions" ' ||
      'ON CONFLICT (id) DO NOTHING',
      schema_record.schema_name
    );
  END LOOP;
END $$;
--> statement-breakpoint

-- Step 5: Drop game_sessions from all tenant schemas
DO $$
DECLARE
  schema_record RECORD;
BEGIN
  FOR schema_record IN SELECT schema_name FROM public.restaurants LOOP
    EXECUTE format('DROP TABLE IF EXISTS %I."game_sessions" CASCADE', schema_record.schema_name);
  END LOOP;
END $$;
