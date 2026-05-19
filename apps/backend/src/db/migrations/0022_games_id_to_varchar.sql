-- Migration 0022: Change games.id from uuid to varchar(100) so it matches frontend localGameId
-- This fixes the 404 "Game not found" error when submitting scores

-- Step 1: Remove uuid default and change type
ALTER TABLE "games" ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "games" ALTER COLUMN "id" TYPE varchar(100);
--> statement-breakpoint

-- Step 2: Update existing seeded games to use their localGameId as primary key
UPDATE "games" SET "id" = "config"->>'localGameId';
--> statement-breakpoint

-- Step 3: Re-insert all 5 platform games with correct string IDs (idempotent)
INSERT INTO "games" ("id", "name", "type", "config", "is_active", "created_at") VALUES
(
  'vex-runner',
  'Jump & Bite',
  'local',
  '{
    "localGameId": "vex-runner",
    "description": "Dash, jump, and dodge obstacles with food runners.",
    "icon": "/games/vex-runner.svg",
    "coverImageUrl": "/games/jump-bite.png",
    "prize": "Up to 1200 points",
    "tag": "HOT",
    "sponsorAd": true,
    "maxPoints": 1200,
    "scoring": {
      "basePoints": 10,
      "exponent": 0.7,
      "multiplier": 2.5,
      "maxPerPlay": 500,
      "scoringVersion": "v1"
    }
  }'::jsonb,
  true,
  now()
),
(
  'hungry-bird-rush',
  'Hungry Bird Rush',
  'local',
  '{
    "localGameId": "hungry-bird-rush",
    "description": "Tap to fly, weave through pipes.",
    "icon": "/games/vex-challenges.svg",
    "coverImageUrl": "/games/hungry-bird-rush-model.png",
    "prize": "Up to 700 points",
    "tag": "NEW",
    "sponsorAd": true,
    "maxPoints": 700,
    "scoring": {
      "basePoints": 10,
      "exponent": 0.7,
      "multiplier": 2.5,
      "maxPerPlay": 500,
      "scoringVersion": "v1"
    }
  }'::jsonb,
  true,
  now()
),
(
  'cheese-chase',
  'Cheddar Chase',
  'local',
  '{
    "localGameId": "cheese-chase",
    "description": "Guide the mouse through mazes collecting cheese.",
    "icon": "/games/vex-6.svg",
    "coverImageUrl": "/games/cheddar-chase.png",
    "prize": "Up to 2500 points",
    "tag": "PRO",
    "sponsorAd": false,
    "maxPoints": 2500,
    "scoring": {
      "basePoints": 10,
      "exponent": 0.7,
      "multiplier": 2.5,
      "maxPerPlay": 500,
      "scoringVersion": "v1"
    }
  }'::jsonb,
  true,
  now()
),
(
  'memory-match',
  'Gem Match',
  'local',
  '{
    "localGameId": "memory-match",
    "description": "Classic card matching game.",
    "icon": "/games/vex-7.svg",
    "coverImageUrl": "/games/gem-match.png",
    "prize": "Up to 2000 points",
    "tag": "HOT",
    "sponsorAd": true,
    "maxPoints": 2000,
    "scoring": {
      "basePoints": 10,
      "exponent": 0.7,
      "multiplier": 2.5,
      "maxPerPlay": 500,
      "scoringVersion": "v1"
    }
  }'::jsonb,
  true,
  now()
),
(
  'slice-master',
  'Slice Master',
  'local',
  '{
    "localGameId": "slice-master",
    "description": "Swipe to slice flying fruits.",
    "icon": "/games/vex-8.svg",
    "coverImageUrl": "/games/slice-master.png",
    "prize": "Up to 600 points",
    "tag": "NEW",
    "sponsorAd": false,
    "maxPoints": 600,
    "scoring": {
      "basePoints": 10,
      "exponent": 0.7,
      "multiplier": 2.5,
      "maxPerPlay": 500,
      "scoringVersion": "v1"
    }
  }'::jsonb,
  true,
  now()
)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "type" = EXCLUDED."type",
  "config" = EXCLUDED."config",
  "is_active" = EXCLUDED."is_active";
