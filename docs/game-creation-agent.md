# Game Creation Agent Playbook

This file is the standard strategy for building every new local game in this project.

Use this playbook when creating game modules like `Jump & Bite` and `Hungry Bird Rush`.

## Goal

- Add new games with clean architecture.
- Keep implementation modular and easy to tune.
- Keep scoring strategy consistent across all games.
- Avoid backend complexity now, while staying backend-ready.
- Do not redesign or break existing UI screens.

## Core Rules

1. Create each game in its own folder.
2. Use separate files for model, canvas art, engine, and renderer.
3. Keep scoring constants in one model file only.
4. Emit awards through the existing `onAward` callback.
5. Do not hardcode score values in UI components.
6. Prefer minimal integration changes in registry/data only.

## Required Folder Structure

For each new game:

```text
apps/customer-frontend/components/restaurant/games/local/<game-id>/
  <game-id>-model.ts
  <game-id>-canvas-art.ts
  use-<game-id>-engine.ts
  <game-id>-game.tsx
```

Example (`hungry-bird-rush`):

```text
apps/customer-frontend/components/restaurant/games/local/hungry-bird-rush/
  hungry-bird-rush-model.ts
  hungry-bird-rush-canvas-art.ts
  use-hungry-bird-rush-engine.ts
  hungry-bird-rush-game.tsx
```

## Responsibilities Per File

1. `*-model.ts`
- Types, constants, tunable knobs, score-to-points mapping.
- No React logic.

2. `*-canvas-art.ts`
- All drawing/UI on canvas.
- No game loop business rules.

3. `use-*-engine.ts`
- Physics, collisions, spawning, score updates, game states.
- Calls `onAward({ points, score, label })` once when round ends.

4. `*-game.tsx`
- Canvas component wiring.
- HUD and replay controls.
- No physics logic.

## Shared Scoring Strategy

All games should follow the same strategy:

1. Raw score is computed inside engine.
2. Award points are computed by a dedicated model function.
3. Award points are capped (`maxAwardPoints`) in model.
4. Game over calls `onAward` once.
5. Top-score detection compares `finalScore` with `communityTopScore` when available.

Recommended scoring knobs in model:

- `scorePerAction` (or equivalent: per obstacle/pipe/etc)
- `survivalScorePerSecond` (optional)
- `maxAwardPoints`
- `difficultyScale` knobs (speed, spawn delay, etc)

## Local-First, Backend-Ready Persistence

Current mode can stay local storage, but structure code for easy migration:

1. Keep the game engine independent of data storage.
2. Introduce a repository abstraction when implementing shared score persistence.
3. Start with local adapter, later plug backend adapter.

Repository contract (target shape):

```ts
type SaveRoundInput = {
  gameId: string;
  userId?: string;
  deviceId?: string;
  score: number;
  pointsAwarded: number;
  level?: number;
  scoringVersion: string;
  playedAt: string;
};

interface ScoreRepository {
  saveRound(input: SaveRoundInput): Promise<void>;
  getPlayerSummary(gameId: string, userId?: string): Promise<{
    highScore: number;
    lastScore: number;
    roundsPlayed: number;
  }>;
  getLeaderboard(gameId: string, limit: number): Promise<Array<{
    userId?: string;
    score: number;
    playedAt: string;
  }>>;
}
```

## Minimal Integration Checklist

1. Add renderer to:
- `apps/customer-frontend/components/restaurant/games/local/local-game-registry.tsx`

2. Add game metadata to:
- `apps/customer-frontend/lib/mock-restaurants.ts`

3. Keep existing screen flow unchanged:
- Intro screen
- Play screen
- Reward flow via `onAward`

4. Run validation:
- `pnpm --filter customer-frontend typecheck`

## Backend + DB Plan (When Ready)

Keep it simple:

1. Create one table: `game_rounds`
2. Save every round row (append-only)
3. Build summaries/leaderboards with SQL queries

Suggested columns:

- `id` (uuid, pk)
- `game_id` (text, indexed)
- `user_id` (text, nullable, indexed)
- `device_id` (text, nullable)
- `score` (int, not null)
- `points_awarded` (int, not null)
- `level` (int, nullable)
- `scoring_version` (text, not null)
- `played_at` (timestamptz, not null)
- `metadata` (jsonb, default `{}`)

Recommended indexes:

1. `(game_id, score desc)`
2. `(user_id, game_id, played_at desc)`

## Definition of Done (Per New Game)

1. New game folder created with the 4-file structure.
2. Game is registered in local registry.
3. Game appears in mock restaurant game list.
4. Score and award logic is configurable from model only.
5. No breakage to existing game screens.
6. Typecheck passes.

## Quick Start Prompt (for future agent runs)

Use this exact instruction when adding a new game:

```text
Create a new local game using docs/game-creation-agent.md.
Keep clean architecture: model + canvas-art + engine hook + game renderer.
Use the same scoring strategy as Vex Runner/Hungry Bird Rush.
Do not change existing UI flow.
Integrate only through local-game-registry and mock-restaurants.
Run customer-frontend typecheck and report changed files.
```
