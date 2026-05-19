-- Migration 0013: Add missing ad columns (media_type, duration, assigned_games)

ALTER TABLE advertisements
  ADD COLUMN IF NOT EXISTS media_type varchar(10) DEFAULT 'image' NOT NULL,
  ADD COLUMN IF NOT EXISTS duration integer DEFAULT 15 NOT NULL,
  ADD COLUMN IF NOT EXISTS assigned_games jsonb DEFAULT '[]'::jsonb NOT NULL;
--> statement-breakpoint
