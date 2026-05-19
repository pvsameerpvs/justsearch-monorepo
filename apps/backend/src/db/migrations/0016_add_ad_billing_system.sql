-- Migration 0016: Ad billing events table + counter columns for real cost tracking

-- Counter columns on advertisements table
ALTER TABLE advertisements
  ADD COLUMN IF NOT EXISTS total_views_3s integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_views_full integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_clicks integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_confirmed_clicks integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_abandoned_clicks integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS revenue_justsearch decimal(10, 2) DEFAULT '0',
  ADD COLUMN IF NOT EXISTS revenue_restaurant decimal(10, 2) DEFAULT '0';
--> statement-breakpoint

-- Granular billing events table (audit trail)
CREATE TABLE IF NOT EXISTS ad_billing_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid NOT NULL REFERENCES advertisements(id) ON DELETE CASCADE,
  restaurant_id uuid REFERENCES restaurants(id),
  event_type varchar(20) NOT NULL CHECK (event_type IN ('view_3s', 'view_full', 'click_pending', 'click_confirmed', 'click_abandoned')),
  amount decimal(10, 2) DEFAULT '0' NOT NULL,
  is_confirmed boolean DEFAULT false,
  device_fingerprint varchar(255),
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Index for fast analytics queries
CREATE INDEX IF NOT EXISTS ad_billing_events_ad_id_idx ON ad_billing_events (ad_id);
CREATE INDEX IF NOT EXISTS ad_billing_events_created_at_idx ON ad_billing_events (created_at);
--> statement-breakpoint
