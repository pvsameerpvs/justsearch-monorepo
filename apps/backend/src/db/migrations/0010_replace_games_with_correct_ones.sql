-- Migration 0010: Replace all existing games with correct 5 JustSearch platform games
-- Each game gets proper coverImageUrl, localGameId, and scoring config

-- Step 1: Delete all existing games (remove Flip & Win, Fruit Slice, Number Match, Word Scramble, Bubble Pop)
DELETE FROM games;
--> statement-breakpoint

-- Step 2: Insert the 5 correct platform games with cover images
INSERT INTO games (id, name, type, config, is_active, created_at) VALUES
(
  gen_random_uuid(),
  'Jump & Bite',
  'local',
  '{
    "localGameId": "vex-runner",
    "description": "Dash, jump, and dodge obstacles with food runners.",
    "icon": "/games/vex-runner.svg",
    "coverImageUrl": "/games/vex-runner.png",
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
  gen_random_uuid(),
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
  gen_random_uuid(),
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
  gen_random_uuid(),
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
  gen_random_uuid(),
  'Slice Master',
  'local',
  '{
    "localGameId": "slice-master",
    "description": "Swipe to slice flying fruits.",
    "icon": "/games/vex-8.svg",
    "coverImageUrl": "/games/jump&bite.png",
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
);
--> statement-breakpoint
