-- Migration 0015: Add poster_url and media_url_low for instant video playback

ALTER TABLE advertisements
  ADD COLUMN IF NOT EXISTS poster_url varchar(500),
  ADD COLUMN IF NOT EXISTS media_url_low varchar(500);
--> statement-breakpoint
