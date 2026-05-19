-- Migration 0014: Add visibility JSONB column to advertisements

ALTER TABLE advertisements
  ADD COLUMN IF NOT EXISTS visibility jsonb DEFAULT '{"title": true, "description": false, "linkUrl": true}'::jsonb NOT NULL;
--> statement-breakpoint
