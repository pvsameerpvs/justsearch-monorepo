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

---

## 4. Build Checklist

- [ ] All user game stats displayed per game
- [ ] Total points counter updates after gameplay
- [ ] Links to wallet page work
- [ ] Responsive grid layout
- [ ] No `console.log`
