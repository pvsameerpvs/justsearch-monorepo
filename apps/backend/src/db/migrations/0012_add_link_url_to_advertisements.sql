-- Migration 0012: Add link_url column to advertisements

ALTER TABLE advertisements
  ADD COLUMN IF NOT EXISTS link_url varchar(1000);
--> statement-breakpoint
