-- Add push_subscription JSONB column to delivery_agents table
-- This is needed for all tenant schemas

DO $$
DECLARE
  schema_rec RECORD;
BEGIN
  FOR schema_rec IN
    SELECT schema_name FROM public.restaurants WHERE status = 'active'
  LOOP
    EXECUTE format(
      'ALTER TABLE %I.delivery_agents ADD COLUMN IF NOT EXISTS push_subscription JSONB DEFAULT NULL',
      schema_rec.schema_name
    );
  END LOOP;
END $$;

-- Also add to any future schemas by updating the tenant template logic
-- (seed/tenant-template.ts handles this for new restaurants)
