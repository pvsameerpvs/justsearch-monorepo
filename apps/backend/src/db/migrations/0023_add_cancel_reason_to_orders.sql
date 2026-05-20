-- Migration 0023: Add cancel_reason column to orders tables
-- Adds cancel_reason to public.orders (if exists) and all tenant schemas.

-- Add to public.orders if it exists
DO $$ BEGIN
  ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS cancel_reason text;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;
--> statement-breakpoint

-- Add to all tenant schemas
DO $$
DECLARE
  schema_record RECORD;
BEGIN
  FOR schema_record IN SELECT schema_name FROM public.restaurants LOOP
    EXECUTE format(
      'ALTER TABLE %I."orders" ADD COLUMN IF NOT EXISTS cancel_reason text',
      schema_record.schema_name
    );
  END LOOP;
END $$;
--> statement-breakpoint
