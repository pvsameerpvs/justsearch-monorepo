-- Safe migration: Only create missing tables
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Create refresh_tokens table (the one causing the login error)
CREATE TABLE IF NOT EXISTS "refresh_tokens" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,
    "token_hash" varchar(255) NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "revoked" boolean DEFAULT false NOT NULL,
    "used_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Create orders table (if missing)
CREATE TABLE IF NOT EXISTS "orders" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "restaurant_id" uuid NOT NULL,
    "code" varchar(20) NOT NULL,
    "customer_id" uuid,
    "customer_name" varchar(255) NOT NULL,
    "customer_phone" varchar(20) NOT NULL,
    "status" varchar(20) DEFAULT 'pending' NOT NULL,
    "payment_status" varchar(20) DEFAULT 'unpaid' NOT NULL,
    "fulfillment_type" varchar(20) NOT NULL,
    "source" varchar(20) DEFAULT 'direct_web' NOT NULL,
    "subtotal" numeric(10, 2) NOT NULL,
    "delivery_fee" numeric(10, 2) DEFAULT '0' NOT NULL,
    "tax" numeric(10, 2) DEFAULT '0' NOT NULL,
    "total" numeric(10, 2) NOT NULL,
    "delivery_address" text,
    "lat" numeric(10, 8),
    "lng" numeric(10, 8),
    "notes" text,
    "driver_id" uuid,
    "payment_method" varchar(20),
    "eta_minutes" integer,
    "table_id" uuid,
    "cancel_reason" text,
    "alternate_number" varchar(20),
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT "orders_code_unique" UNIQUE("code")
);

-- 3. Create order_items table (if missing)
CREATE TABLE IF NOT EXISTS "order_items" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "restaurant_id" uuid NOT NULL,
    "order_id" uuid NOT NULL,
    "menu_item_id" uuid,
    "name" varchar(255) NOT NULL,
    "quantity" integer NOT NULL,
    "price" numeric(10, 2) NOT NULL,
    "currency" varchar(3) DEFAULT 'AED' NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- 4. Create ad_billing_events table (if missing)
CREATE TABLE IF NOT EXISTS "ad_billing_events" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "ad_id" uuid NOT NULL,
    "restaurant_id" uuid,
    "customer_id" uuid,
    "event_type" varchar(20) NOT NULL,
    "amount" numeric(10, 2) DEFAULT '0' NOT NULL,
    "is_confirmed" boolean DEFAULT false,
    "device_fingerprint" varchar(255),
    "metadata" jsonb DEFAULT '{}',
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- 5. Add indexes for performance (if not exist)
CREATE INDEX IF NOT EXISTS "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");
CREATE INDEX IF NOT EXISTS "orders_restaurant_id_idx" ON "orders"("restaurant_id");
CREATE INDEX IF NOT EXISTS "orders_customer_id_idx" ON "orders"("customer_id");
CREATE INDEX IF NOT EXISTS "order_items_order_id_idx" ON "order_items"("order_id");

-- 6. Seed a default super admin (if table exists and is empty)
-- Note: Only run this if you need a default admin
-- INSERT INTO "super_admins" ("username", "password_hash", "name", "email", "is_active")
-- SELECT 'admin', '$2a$12$...', 'Super Admin', 'admin@eatygo.com', true
-- WHERE NOT EXISTS (SELECT 1 FROM "super_admins");

-- Done! Tables created safely without modifying existing data.