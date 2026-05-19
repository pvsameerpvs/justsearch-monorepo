-- Migration 0018: Create ad_categories table for persistent ad category management

CREATE TABLE IF NOT EXISTS ad_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(50) NOT NULL UNIQUE,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Seed default categories from the hardcoded list
INSERT INTO ad_categories (name) VALUES
  ('Restaurant'),
  ('Supermarket'),
  ('Electronics'),
  ('Fashion'),
  ('Healthcare'),
  ('Automotive'),
  ('Real Estate'),
  ('Education'),
  ('Banking'),
  ('Telecom'),
  ('Travel'),
  ('Food Delivery'),
  ('Beauty'),
  ('Fitness'),
  ('Entertainment')
ON CONFLICT (name) DO NOTHING;
--> statement-breakpoint
