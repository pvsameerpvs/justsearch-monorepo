-- Migration 0020: Drop unused cost_per_impression column from advertisements
ALTER TABLE "advertisements" DROP COLUMN IF EXISTS "cost_per_impression";
