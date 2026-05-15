# Game Profile Agent Guide

> **Location**: `apps/customer-frontend/components/restaurant/games/profile/`
> **Scope**: User's game statistics, per-game scores, wallet points
> **Route**: `/eat-play/profile`

---

## 1. Overview

Displays the user's game-playing history and statistics:
- Total points earned from all games
- Per-game stats (games played, high score, total points)
- Quick link to wallet/loyalty points

---

## 2. Components

### `eat-play-profile-screen.tsx`

**Lines**: 264  
**Responsibility**: Main profile screen container. Fetches game stats, renders header + stats grid.

**Props**: None (reads from hooks internally)

**Sections**:
- Header with total points + wallet link
- Grid of per-game stat cards

### `eat-play-game-stat-card.tsx`

**Lines**: 188  
**Responsibility**: Single game stat card showing:
- Game icon + name
- Games played count
- High score
- Total points earned
- Progress bar toward next tier

### `eat-play-header-wallet-link.tsx`

**Lines**: Unknown  
**Responsibility**: Header area with link to user's wallet/loyalty points page

---

## 3. Data Flow

```
eat-play-profile-screen.tsx
  ├── useUserGameStats()          → getGameStat(gameId) → { gamesPlayed, highScore, totalPoints }
  ├── useLoyaltyPoints()          → total points across all games
  └── Maps over all games → renders EatPlayGameStatCard for each
```

Game stats are stored client-side via `useUserGameStats` hook (local state, no backend API for game sessions yet).

### GameStat Type (with points tracking)

```typescript
type GameStat = {
  highScore: number;    // Best raw score for this game
  lastScore: number;    // Last raw score
  lastPoints: number;   // Points earned from last play
  totalPoints: number;  // Total points accumulated for this game
  maxLevel: number;
  roundsPlayed: number;
  lastPlayed: string;
};
```

### Points Flow

```
Game ends → onAward(rawScore)
  → submitScore(gameId, rawScore) → POST /api/v1/games/sessions
  → Backend returns pointsAwarded (via scoring formula)
  → addPoints(pointsAwarded) → updates total in useLoyaltyPoints
  → updateGameStat(gameId, rawScore, pointsAwarded, level)
  → Profile shows totalPoints per game + total loyalty points
```

### Loyalty Tiers (Updated)

| Tier | Points Needed | Reward Value |
|------|-------------|--------------|
| ELITE | 0 | — |
| SILVER | 1,000 | 10 AED scratch card |
| GOLD | 5,000 | 50 AED scratch card |
| PLATINUM | 10,000 | 120 AED scratch card |

### Default Starting Points

`DEFAULT_POINTS = 0` (was 1250 mock value). Players start from zero and earn through gameplay.

---

## 4. Point Redemption

When a user accumulates enough points, they can redeem scratch cards:

| Total Points | Reward | Shown In |
|-------------|--------|----------|
| 1,000 | 10 AED scratch card | Profile page |
| 5,000 | 50 AED scratch card | Profile page |
| 10,000 | 120 AED scratch card | Profile page |

### UI Concept

```
┌──────────────────────────────────────┐
│  Total Points: 2,450                  │
│                                       │
│  ┌─ Rewards ──────────────────────┐  │
│  │ 10 AED  <progress 24%>  1000   │  │
│  │ 50 AED   <locked>      5000    │  │
│  │ 120 AED  <locked>      10000   │  │
│  └──────────────────────────────────┘  │
│         [Redeem Available]             │
└──────────────────────────────────────┘
```

Redemption deducts points from the user's total. Each threshold is a one-time reward per user.

---

## 5. Build Checklist

- [ ] All user game stats displayed per game
- [ ] Total points counter updates after gameplay
- [ ] Scratch card redemption UI at 1000/5000/10000 thresholds
- [ ] Redemption deducts points from total
- [ ] Links to wallet page work
- [ ] Responsive grid layout
- [ ] No `console.log`
