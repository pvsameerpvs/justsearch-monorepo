-- Migration 0007: Restore global users, addresses, loyalty_points, user_restaurants to public schema
-- Makes users global (one account everywhere) while keeping orders, game_sessions per-tenant.
-- Tables that stay per-tenant: orders, order_items, game_sessions, menu_categories, menus, menu_items,
--   promo_codes, delivery_agents, delivery_assignments, staff, otp_requests, daily_closeouts
-- Tables that become global: users, user_restaurants, addresses, loyalty_points

-- Step 1: Rename deprecated public tables back to active names
ALTER TABLE IF EXISTS public.users_deprecated RENAME TO users;
ALTER TABLE IF EXISTS public.user_restaurants_deprecated RENAME TO user_restaurants;
ALTER TABLE IF EXISTS public.addresses_deprecated RENAME TO addresses;
ALTER TABLE IF EXISTS public.loyalty_points_deprecated RENAME TO loyalty_points;
--> statement-breakpoint

-- Step 1b: Add required unique constraints for ON CONFLICT to work
ALTER TABLE public.user_restaurants ADD CONSTRAINT user_restaurants_user_restaurant_unique UNIQUE (user_id, restaurant_id);
ALTER TABLE public.addresses ADD CONSTRAINT addresses_id_unique UNIQUE (id);
ALTER TABLE public.loyalty_points ADD CONSTRAINT loyalty_points_user_id_unique UNIQUE (user_id);
--> statement-breakpoint

-- Step 2: Merge new users from tenant schemas into public.users
-- Deduplicate by phone: if phone exists in public.users, keep the public one (older).
DO $$
DECLARE
  schema_record RECORD;
  user_row RECORD;
  existing_user_id uuid;
  id_mapping RECORD;
BEGIN
  FOR schema_record IN SELECT id, schema_name FROM public.restaurants LOOP
    -- For each user in tenant schema
    FOR user_row IN
      EXECUTE format('SELECT * FROM %I."users"', schema_record.schema_name)
    LOOP
      -- Check if this phone already exists in public.users
      SELECT id INTO existing_user_id
      FROM public.users
      WHERE phone = user_row.phone
      LIMIT 1;

      IF existing_user_id IS NULL THEN
        -- New phone: insert into public.users
        INSERT INTO public.users (
          id, name, username, phone, email, password_hash, is_active, role, created_at, updated_at
        ) VALUES (
          user_row.id, user_row.name, user_row.username, user_row.phone,
          user_row.email, user_row.password_hash, user_row.is_active, user_row.role,
          user_row.created_at, user_row.updated_at
        );
      END IF;
    END LOOP;
  END LOOP;
END $$;
--> statement-breakpoint

-- Step 3: Merge user_restaurants links from tenant schemas into public.user_restaurants
-- Skip duplicates (same user_id + restaurant_id)
DO $$
DECLARE
  schema_record RECORD;
BEGIN
  FOR schema_record IN SELECT id, schema_name FROM public.restaurants LOOP
    EXECUTE format(
      'INSERT INTO public.user_restaurants (id, user_id, restaurant_id, role, permissions, created_at) ' ||
      'SELECT id, user_id, restaurant_id, role, permissions, created_at FROM %I."user_restaurants" ' ||
      'ON CONFLICT (user_id, restaurant_id) DO NOTHING',
      schema_record.schema_name
    );
  END LOOP;
END $$;
--> statement-breakpoint

-- Step 4: Merge addresses from tenant schemas into public.addresses
DO $$
DECLARE
  schema_record RECORD;
BEGIN
  FOR schema_record IN SELECT id, schema_name FROM public.restaurants LOOP
    EXECUTE format(
      'INSERT INTO public.addresses (id, user_id, label, address, details, alternate_number, is_default, created_at, updated_at) ' ||
      'SELECT id, user_id, label, address, details, alternate_number, is_default, created_at, updated_at FROM %I."addresses" ' ||
      'ON CONFLICT (id) DO NOTHING',
      schema_record.schema_name
    );
  END LOOP;
END $$;
--> statement-breakpoint

-- Step 5: Merge loyalty_points from tenant schemas into public.loyalty_points
DO $$
DECLARE
  schema_record RECORD;
  lp_row RECORD;
  existing_lp RECORD;
BEGIN
  FOR schema_record IN SELECT id, schema_name FROM public.restaurants LOOP
    FOR lp_row IN
      EXECUTE format('SELECT * FROM %I."loyalty_points"', schema_record.schema_name)
    LOOP
      -- Check if user already has loyalty_points in public
      SELECT * INTO existing_lp
      FROM public.loyalty_points
      WHERE user_id = lp_row.user_id
      LIMIT 1;

      IF existing_lp.id IS NULL THEN
        INSERT INTO public.loyalty_points (id, user_id, points, total_earned, total_redeemed, updated_at)
        VALUES (lp_row.id, lp_row.user_id, lp_row.points, lp_row.total_earned, lp_row.total_redeemed, lp_row.updated_at);
      ELSE
        -- Sum the points across restaurants
        UPDATE public.loyalty_points
        SET
          points = points + lp_row.points,
          total_earned = total_earned + lp_row.total_earned,
          total_redeemed = total_redeemed + lp_row.total_redeemed,
          updated_at = GREATEST(updated_at, lp_row.updated_at)
        WHERE id = existing_lp.id;
      END IF;
    END LOOP;
  END LOOP;
END $$;
--> statement-breakpoint

-- Step 6: Drop users, user_restaurants, addresses, loyalty_points from all tenant schemas
DO $$
DECLARE
  schema_record RECORD;
BEGIN
  FOR schema_record IN SELECT schema_name FROM public.restaurants LOOP
    EXECUTE format('DROP TABLE IF EXISTS %I."users" CASCADE', schema_record.schema_name);
    EXECUTE format('DROP TABLE IF EXISTS %I."user_restaurants" CASCADE', schema_record.schema_name);
    EXECUTE format('DROP TABLE IF EXISTS %I."addresses" CASCADE', schema_record.schema_name);
    EXECUTE format('DROP TABLE IF EXISTS %I."loyalty_points" CASCADE', schema_record.schema_name);
  END LOOP;
END $$;
--> statement-breakpoint

-- Step 7: Re-add FK constraints on tenant tables that reference public.users
-- orders.customer_id
DO $$
DECLARE
  schema_record RECORD;
BEGIN
  FOR schema_record IN SELECT schema_name FROM public.restaurants LOOP
    BEGIN
      EXECUTE format(
        'ALTER TABLE %I."orders" ADD CONSTRAINT %I FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL',
        schema_record.schema_name,
        schema_record.schema_name || '_orders_customer_id_fk'
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END LOOP;
END $$;
--> statement-breakpoint

-- game_sessions.customer_id
DO $$
DECLARE
  schema_record RECORD;
BEGIN
  FOR schema_record IN SELECT schema_name FROM public.restaurants LOOP
    BEGIN
      EXECUTE format(
        'ALTER TABLE %I."game_sessions" ADD CONSTRAINT %I FOREIGN KEY (customer_id) REFERENCES public.users(id) ON DELETE SET NULL',
        schema_record.schema_name,
        schema_record.schema_name || '_game_sessions_customer_id_fk'
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END LOOP;
END $$;
--> statement-breakpoint

-- Step 8: Clean up any orphaned deprecated order tables
DROP TABLE IF EXISTS public.orders_deprecated CASCADE;
DROP TABLE IF EXISTS public.order_items_deprecated CASCADE;
DROP TABLE IF EXISTS public.game_sessions_deprecated CASCADE;
--> statement-breakpoint

-- Step 9: Ensure public.users has unique phone constraint (may already exist from migration 0002)
DO $$ BEGIN
  ALTER TABLE public.users ADD CONSTRAINT users_phone_unique UNIQUE (phone);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;
--> statement-breakpoint

-- Step 10: Ensure public.loyalty_points has unique user_id constraint
CREATE UNIQUE INDEX IF NOT EXISTS loyalty_points_user_id_idx ON public.loyalty_points (user_id);
