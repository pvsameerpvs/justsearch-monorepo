-- Migration 0008: Add payment_method column to orders tables
-- The orders table was missing the payment_method column that the Drizzle schema defines.
-- This adds it to public.orders (if exists) and all tenant schemas.

-- Add to public.orders if it exists
DO $$ BEGIN
  ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method "payment_method";
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
      'ALTER TABLE %I."orders" ADD COLUMN IF NOT EXISTS payment_method "payment_method"',
      schema_record.schema_name
    );
  END LOOP;
END $$;
--> statement-breakpoint
