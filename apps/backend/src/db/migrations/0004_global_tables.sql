-- Step 1: Drop stale tenant copies of tables that moved to public only
-- This prevents search_path from resolving to tenant copies with old schemas
DO $$
DECLARE
  schema_record RECORD;
BEGIN
  FOR schema_record IN SELECT schema_name FROM public.restaurants LOOP
    EXECUTE format('DROP TABLE IF EXISTS %I.loyalty_points CASCADE', schema_record.schema_name);
    EXECUTE format('DROP TABLE IF EXISTS %I.addresses CASCADE', schema_record.schema_name);
    EXECUTE format('DROP TABLE IF EXISTS %I.orders CASCADE', schema_record.schema_name);
    EXECUTE format('DROP TABLE IF EXISTS %I.order_items CASCADE', schema_record.schema_name);
    EXECUTE format('DROP TABLE IF EXISTS %I.game_sessions CASCADE', schema_record.schema_name);
  END LOOP;
END $$;
--> statement-breakpoint

-- Step 2: Drop old FK on order_items.menu_item_id (menu_items stays per-tenant)
ALTER TABLE "order_items" DROP CONSTRAINT IF EXISTS "order_items_menu_item_id_menu_items_id_fk";
--> statement-breakpoint

-- Step 3: Drop old FKs on loyalty_points
ALTER TABLE "loyalty_points" DROP CONSTRAINT IF EXISTS "loyalty_points_restaurant_id_restaurants_id_fk";
--> statement-breakpoint
ALTER TABLE "loyalty_points" DROP CONSTRAINT IF EXISTS "loyalty_points_customer_id_users_id_fk";
--> statement-breakpoint

-- Step 4: Rename customer_id to user_id on loyalty_points (PostgreSQL doesn't allow direct rename with FK, so we use column rename)
ALTER TABLE "loyalty_points" RENAME COLUMN "customer_id" TO "user_id";
--> statement-breakpoint

-- Step 5: Drop restaurant_id from loyalty_points
ALTER TABLE "loyalty_points" DROP COLUMN IF EXISTS "restaurant_id";
--> statement-breakpoint

-- Step 6: Re-add FK on user_id
DO $$ BEGIN
 ALTER TABLE "loyalty_points" ADD CONSTRAINT "loyalty_points_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- Step 7: Add unique index on user_id for upsert support
CREATE UNIQUE INDEX IF NOT EXISTS "loyalty_points_user_id_idx" ON "loyalty_points" ("user_id");
