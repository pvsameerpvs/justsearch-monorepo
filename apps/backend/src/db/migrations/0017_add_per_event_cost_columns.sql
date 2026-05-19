-- Migration 0017: Add per-event cost columns (customizable per campaign)

ALTER TABLE advertisements
  ADD COLUMN IF NOT EXISTS cost_per_view_3s decimal(10, 2) DEFAULT '0.30',
  ADD COLUMN IF NOT EXISTS cost_per_view_full decimal(10, 2) DEFAULT '1.00',
  ADD COLUMN IF NOT EXISTS cost_per_click decimal(10, 2) DEFAULT '5.00';
--> statement-breakpoint
