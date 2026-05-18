-- Migration 0011: Add ad categories and budget tracking

-- Add category, budget, costPerImpression, impressions, spent to advertisements
ALTER TABLE advertisements
  ADD COLUMN IF NOT EXISTS category varchar(50),
  ADD COLUMN IF NOT EXISTS budget decimal(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cost_per_impression decimal(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS impressions integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS spent decimal(10, 2) DEFAULT 0;
--> statement-breakpoint

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS advertisements_category_idx ON advertisements (category);
--> statement-breakpoint
