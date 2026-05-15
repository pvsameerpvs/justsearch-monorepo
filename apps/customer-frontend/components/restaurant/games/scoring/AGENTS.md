# Game Scoring Agent Guide

> **Location**: `apps/customer-frontend/components/restaurant/games/scoring/`
> **Scope**: Universal scoring formula, per-game configuration, budget control, future game extension
> **Rule**: Every game MUST follow this scoring system. No game outputs raw scores to users — only points.

---

## 1. Universal Scoring Formula

Every game, regardless of type, uses this formula to convert raw game output into points:

```
points = min(
  BASE_POINTS + floor(rawScore ^ EXPONENT × MULTIPLIER),
  MAX_PER_PLAY
)
```

### Parameters

| Parameter | Type | Range | Purpose |
|-----------|------|-------|---------|
| `rawScore` | Number | Game-dependent | Raw output from the game engine |
| `BASE_POINTS` | Integer | 5–20 | Minimum points for playing |
| `EXPONENT` | Float | 0.3–2.0 | Controls curve shape (budget knob) |
| `MULTIPLIER` | Float | 0.5–5.0 | Scales final points |
| `MAX_PER_PLAY` | Integer | 100–500 | Hard cap per single play |
| `scoringVersion` | String | "v1" | For future formula changes |

### Budget Knob: The Exponent

| Exponent | Effect | Budget Impact |
|----------|--------|---------------|
| < 1.0 | Diminishing returns — most players cluster low | **Cheapest** for you |
| = 1.0 | Linear — score × multiplier | Moderate |
| > 1.0 | Accelerating — good players pull away fast | **Most expensive** |

### Recommendation
- All games: `exponent = 0.6–0.8` to protect your budget
- Multiplier: `2.0–3.0` for visible points without breaking bank
- `MAX_PER_PLAY`: `500` max — no single play can earn more than 500 points

---

## 2. Per-Game Configuration (Stored in `games.config` JSONB)

Each game stores its scoring config in the backend `games` table under the `config` JSONB column:

```json
{
  "scoring": {
    "basePoints": 10,
    "exponent": 0.8,
    "multiplier": 2.5,
    "maxPerPlay": 500,
    "scoringVersion": "v1"
  }
}
```

### Current 5 Games

| Game | Raw Score Range | Base | Exponent | Multiplier | Max/Play | Est. Avg Points/Play |
|------|----------------|------|----------|------------|----------|---------------------|
| Jump & Bite | 0–500 (distance) | 10 | 0.7 | 2.5 | 500 | 40–150 |
| Hungry Bird Rush | 0–100 (pipes) | 10 | 0.6 | 2.5 | 500 | 20–80 |
| Cheddar Chase | 0–50 (cheese) | 10 | 0.8 | 2.5 | 500 | 30–120 |
| Gem Match | 0–30 (pairs) | 10 | 0.9 | 2.5 | 500 | 35–140 |
| Slice Master | 0–100 (fruits) | 10 | 0.7 | 2.5 | 500 | 25–100 |

### Example Calculations

```
Jump & Bite: rawScore = 200
  → floor(200 ^ 0.7 × 2.5) + 10
  → floor(40.7 × 2.5) + 10
  → 101 + 10 = 111 points

Hungry Bird Rush: rawScore = 50 (good player)
  → floor(50 ^ 0.6 × 2.5) + 10
  → floor(10.5 × 2.5) + 10
  → 26 + 10 = 36 points

Hungry Bird Rush: rawScore = 100 (god player)
  → floor(100 ^ 0.6 × 2.5) + 10
  → floor(15.8 × 2.5) + 10
  → 39 + 10 = 49 points (hard-capped by game difficulty)
```

---

## 3. Budget Control

### Daily Hard Cap Per User

```
DAILY_HARD_CAP = 2,000 points
```

- Tracks cumulative points earned by a single user in one day
- Once hit, game sessions still record raw scores but award 0 points
- Reset daily

### Budget Math

| Scenario | Players | Avg Points/Player | Total Cost |
|----------|---------|-------------------|------------|
| Normal day | 100 | 500 | ~600 AED |
| Heavy day | 100 | 1000 | ~1,200 AED |
| Maximum (all hit cap) | 100 | 2000 | ~2,400 AED |

### Scratch Card Redemption Thresholds

| Total Points Earned | Reward | Cost to You |
|--------------------|--------|-------------|
| 1,000 | 10 AED scratch card | 10 AED |
| 5,000 | 50 AED scratch card | 50 AED |
| 10,000 | 120 AED scratch card | 120 AED |

**100-to-1 Rule**: In 100 active players, only ~1 will reach 10,000 points. This protects your budget.

---

## 4. How to Add a New Game

When adding a new game (future), follow these steps:

### Step 1: Determine Raw Score Range

Play the game internally. Find the typical and maximum possible scores:
- What is the raw output? (distance, pipes, pairs, fruits, etc.)
- What range do 90% of players fall into?
- What's the theoretical max for a god player?

### Step 2: Assign Scoring Config

Add to the `config.scoring` JSONB:

```json
{
  "scoring": {
    "basePoints": 10,
    "exponent": 0.7,
    "multiplier": 2.5,
    "maxPerPlay": 500,
    "scoringVersion": "v1"
  }
}
```

**Starting defaults** (safe for budget):
- `basePoints`: 10
- `exponent`: 0.7
- `multiplier`: 2.5
- `maxPerPlay`: 500

### Step 3: Register Game

1. Add game definition to `mock-restaurants.ts` (Game type)
2. Add to `games.constants.ts` (admin constants)
3. Add seed in `seed.games.ts` (backend)
4. Add local game in `local-game-registry.tsx` (if canvas game)
5. Add scoring config in the `config` JSONB

### Step 4: Test Budget Impact

Simulate 100 players playing your new game:
- Average player should earn 30–100 points/play
- Exceptional player should hit MAX_PER_PLAY (500) only 1 in 50 plays
- Adjust `EXPONENT` down if too expensive, up if too cheap

---

## 5. Admin Scoring Editor (justsearch-admin)

In the game card in justsearch-admin, add a scoring config editor:

```
┌─────────────────────────────────┐
│  Jump & Bite                    │
│  ┌─ Scoring Config ──────────┐  │
│  │ Base Points:  [10       ] │  │
│  │ Exponent:     [0.7      ] │  │
│  │ Multiplier:   [2.5      ] │  │
│  │ Max/Play:     [500      ] │  │
│  │ Budget Impact: ~40 pts/avg │  │
│  └───────────────────────────┘  │
│  [Active]             [Toggle]  │
└─────────────────────────────────┘
```

This allows the admin to tune each game's scoring independently without code changes.

---

## 6. Points Display Flow

```
Game Engine ends
  → rawScore goes to scoring formula
  → formula returns derivedPoints
  → onAward({ points: derivedPoints, score: rawScore, label })
  → User sees "+111 pts" (not "Score: 200")
  → Points accumulate across sessions
  → Profile shows total points, not raw scores
  → At 1000/5000/10000 → scratch card redemption available
```

**Key rule**: Users NEVER see raw game scores. They only see points earned. This means:
- Game over screen: `"+111 points!"` instead of `"Score: 200"`
- Profile: `"Total Points: 2,450"` instead of game-specific scores
- Game intro: `"Earn up to 500 points per play"` instead of showing max score

---

## 7. Implementation Plan

| Phase | What | Where | Status |
|-------|------|-------|--------|
| 1 | Add scoring config to `games.config` JSONB in seed | `seed.games.ts` | ✅ Done |
| 2 | Create universal scoring utility | `backend/src/lib/scoring.ts` | ✅ Done |
| 3 | Create `POST /api/v1/games/sessions` route | `backend/src/modules/games/game-session.routes.ts` | ✅ Done |
| 4 | Add daily hard cap tracking | Backend (query game_sessions by customerId + date) | ✅ Done |
| 5 | Register route in v1.routes.ts | `v1.routes.ts` | ✅ Done |
| 6 | Create admin scoring editor UI | `justsearch-admin/components/game/game-scoring-editor.tsx` | ✅ Done |
| 7 | Create customer `submitScore` function | `customer-frontend/.../games/use-submit-score.ts` | ✅ Done |
| 8 | Wire game screen to submitScore | `restaurant-game-screen.tsx` | ✅ Done |
| 9 | Add scratch card redemption UI in `/eat-play/profile` | Profile components | ❌ Future |

### Scoring Config Merge

When admin saves scoring config from justsearch-admin:
```
PATCH /api/v1/games/:id { config: { scoring: {...} } }
Backend merges with existing config → keeps description, icon, etc.
```

### Customer Submit Flow

```
Game ends → onAward({ score, level, ... })
  → processAward calls submitScore(gameId, rawScore, level)
  → POST /api/v1/games/sessions
  → Backend calculates: min(10 + floor(rawScore ^ 0.7 × 2.5), 500)
  → Enforces daily hard cap (2000 pts/user)
  → Returns: { pointsAwarded, totalToday, dailyCap }
  → Frontend adds pointsAwarded to loyalty store
  → User sees "+X points" instead of raw score
```

---

## 8. Build Checklist

- [x] Every game has a `scoring` config in its `games.config` JSONB
- [x] Formula uses `BASE_POINTS + floor(rawScore ^ EXPONENT × MULTIPLIER)`
- [x] `MAX_PER_PLAY` is respected (no single play exceeds it)
- [x] `DAILY_HARD_CAP` per user is enforced (when customerId provided)
- [x] Users see points, not raw scores (via submitScore → pointsAwarded)
- [x] Admin can tune scoring per game from justsearch-admin (GameScoringEditor)
- [ ] Scratch card redemption shows at 1000/5000/10000 thresholds
- [ ] New games follow the same pattern (Step 1–4 in section 4)
- [ ] `tsc --noEmit` passes
