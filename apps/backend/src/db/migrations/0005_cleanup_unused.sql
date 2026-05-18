-- Phase 1: Drop 5 unused tables from public schema
DROP TABLE IF EXISTS "public"."restaurant_games" CASCADE;
DROP TABLE IF EXISTS "public"."restaurant_tables" CASCADE;
DROP TABLE IF EXISTS "public"."table_sessions" CASCADE;
DROP TABLE IF EXISTS "public"."payments" CASCADE;
DROP TABLE IF EXISTS "public"."audit_logs" CASCADE;
--> statement-breakpoint

-- Phase 2: Drop 5 unused tables from all tenant schemas
DO $$
DECLARE
  schema_record RECORD;
BEGIN
  FOR schema_record IN SELECT schema_name FROM public.restaurants LOOP
    EXECUTE format('DROP TABLE IF EXISTS %I.restaurant_games CASCADE', schema_record.schema_name);
    EXECUTE format('DROP TABLE IF EXISTS %I.restaurant_tables CASCADE', schema_record.schema_name);
    EXECUTE format('DROP TABLE IF EXISTS %I.table_sessions CASCADE', schema_record.schema_name);
    EXECUTE format('DROP TABLE IF EXISTS %I.payments CASCADE', schema_record.schema_name);
    EXECUTE format('DROP TABLE IF EXISTS %I.audit_logs CASCADE', schema_record.schema_name);
  END LOOP;
END $$;
--> statement-breakpoint

-- Phase 3: Remove unused supabase_auth_id from users
ALTER TABLE "public"."users" DROP COLUMN IF EXISTS "supabase_auth_id";
