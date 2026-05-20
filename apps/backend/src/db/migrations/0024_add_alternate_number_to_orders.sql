-- Migration 0024: Add alternate_number column to orders tables
-- Adds alternate_number to all tenant schemas.

DO $$
DECLARE
  schema_record RECORD;
BEGIN
  FOR schema_record IN SELECT schema_name FROM public.restaurants LOOP
    EXECUTE format(
      'ALTER TABLE %I."orders" ADD COLUMN IF NOT EXISTS alternate_number text',
      schema_record.schema_name
    );
  END LOOP;
END $$;
--> statement-breakpoint
