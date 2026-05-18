-- Migration 0006: Restore true schema-per-tenant architecture
-- Moves users, user_restaurants, addresses, orders, order_items, loyalty_points, game_sessions
-- from public schema into each restaurant's tenant schema.
-- Tables that stay in public: restaurants, games, advertisements, super_admins

-- Step 1: Clone missing tables into each existing tenant schema
DO $$
DECLARE
  schema_record RECORD;
BEGIN
  FOR schema_record IN SELECT schema_name FROM public.restaurants LOOP
    BEGIN
      EXECUTE format('CREATE TABLE IF NOT EXISTS %I."users" (LIKE public."users" INCLUDING ALL)', schema_record.schema_name);
    EXCEPTION WHEN duplicate_table THEN NULL;
    END;

    BEGIN
      EXECUTE format('CREATE TABLE IF NOT EXISTS %I."user_restaurants" (LIKE public."user_restaurants" INCLUDING ALL)', schema_record.schema_name);
    EXCEPTION WHEN duplicate_table THEN NULL;
    END;

    BEGIN
      EXECUTE format('CREATE TABLE IF NOT EXISTS %I."addresses" (LIKE public."addresses" INCLUDING ALL)', schema_record.schema_name);
    EXCEPTION WHEN duplicate_table THEN NULL;
    END;

    BEGIN
      EXECUTE format('CREATE TABLE IF NOT EXISTS %I."orders" (LIKE public."orders" INCLUDING ALL)', schema_record.schema_name);
    EXCEPTION WHEN duplicate_table THEN NULL;
    END;

    BEGIN
      EXECUTE format('CREATE TABLE IF NOT EXISTS %I."order_items" (LIKE public."order_items" INCLUDING ALL)', schema_record.schema_name);
    EXCEPTION WHEN duplicate_table THEN NULL;
    END;

    BEGIN
      EXECUTE format('CREATE TABLE IF NOT EXISTS %I."loyalty_points" (LIKE public."loyalty_points" INCLUDING ALL)', schema_record.schema_name);
    EXCEPTION WHEN duplicate_table THEN NULL;
    END;

    BEGIN
      EXECUTE format('CREATE TABLE IF NOT EXISTS %I."game_sessions" (LIKE public."game_sessions" INCLUDING ALL)', schema_record.schema_name);
    EXCEPTION WHEN duplicate_table THEN NULL;
    END;
  END LOOP;
END $$;
--> statement-breakpoint

-- Step 2: Migrate data from public to tenant schemas
DO $$
DECLARE
  schema_record RECORD;
BEGIN
  FOR schema_record IN SELECT id, schema_name FROM public.restaurants LOOP
    -- users: copy users linked to this restaurant via user_restaurants
    EXECUTE format(
      'INSERT INTO %I."users" SELECT DISTINCT u.* FROM public."users" u ' ||
      'INNER JOIN public."user_restaurants" ur ON u.id = ur.user_id ' ||
      'WHERE ur.restaurant_id = %L ' ||
      'ON CONFLICT (id) DO NOTHING',
      schema_record.schema_name, schema_record.id
    );

    -- user_restaurants
    EXECUTE format(
      'INSERT INTO %I."user_restaurants" SELECT * FROM public."user_restaurants" ' ||
      'WHERE restaurant_id = %L ' ||
      'ON CONFLICT (id) DO NOTHING',
      schema_record.schema_name, schema_record.id
    );

    -- addresses: copy addresses of users linked to this restaurant
    EXECUTE format(
      'INSERT INTO %I."addresses" SELECT DISTINCT a.* FROM public."addresses" a ' ||
      'INNER JOIN public."user_restaurants" ur ON a.user_id = ur.user_id ' ||
      'WHERE ur.restaurant_id = %L ' ||
      'ON CONFLICT (id) DO NOTHING',
      schema_record.schema_name, schema_record.id
    );

    -- orders
    EXECUTE format(
      'INSERT INTO %I."orders" SELECT * FROM public."orders" ' ||
      'WHERE restaurant_id = %L ' ||
      'ON CONFLICT (id) DO NOTHING',
      schema_record.schema_name, schema_record.id
    );

    -- order_items
    EXECUTE format(
      'INSERT INTO %I."order_items" SELECT * FROM public."order_items" ' ||
      'WHERE restaurant_id = %L ' ||
      'ON CONFLICT (id) DO NOTHING',
      schema_record.schema_name, schema_record.id
    );

    -- loyalty_points: copy points of users linked to this restaurant
    EXECUTE format(
      'INSERT INTO %I."loyalty_points" SELECT DISTINCT lp.* FROM public."loyalty_points" lp ' ||
      'INNER JOIN public."user_restaurants" ur ON lp.user_id = ur.user_id ' ||
      'WHERE ur.restaurant_id = %L ' ||
      'ON CONFLICT (id) DO NOTHING',
      schema_record.schema_name, schema_record.id
    );

    -- game_sessions
    EXECUTE format(
      'INSERT INTO %I."game_sessions" SELECT * FROM public."game_sessions" ' ||
      'WHERE restaurant_id = %L ' ||
      'ON CONFLICT (id) DO NOTHING',
      schema_record.schema_name, schema_record.id
    );
  END LOOP;
END $$;
--> statement-breakpoint

-- Step 3: Rename old public tables to _deprecated (safety net — can be dropped after verification)
-- These are kept temporarily so rollback is possible if any issues arise.
-- After confirming all tenant data is correct, run:
--   DROP TABLE public.users CASCADE;
--   DROP TABLE public.user_restaurants CASCADE;
--   DROP TABLE public.addresses CASCADE;
--   DROP TABLE public.orders CASCADE;
--   DROP TABLE public.order_items CASCADE;
--   DROP TABLE public.loyalty_points CASCADE;
--   DROP TABLE public.game_sessions CASCADE;

ALTER TABLE IF EXISTS public.users RENAME TO users_deprecated;
ALTER TABLE IF EXISTS public.user_restaurants RENAME TO user_restaurants_deprecated;
ALTER TABLE IF EXISTS public.addresses RENAME TO addresses_deprecated;
ALTER TABLE IF EXISTS public.orders RENAME TO orders_deprecated;
ALTER TABLE IF EXISTS public.order_items RENAME TO order_items_deprecated;
ALTER TABLE IF EXISTS public.loyalty_points RENAME TO loyalty_points_deprecated;
ALTER TABLE IF EXISTS public.game_sessions RENAME TO game_sessions_deprecated;
