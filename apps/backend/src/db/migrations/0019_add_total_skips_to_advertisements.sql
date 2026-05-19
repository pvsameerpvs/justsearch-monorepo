-- Migration 0019: Add total_skips to advertisements for accurate skip tracking
ALTER TABLE "advertisements" ADD COLUMN IF NOT EXISTS "total_skips" integer DEFAULT 0;
