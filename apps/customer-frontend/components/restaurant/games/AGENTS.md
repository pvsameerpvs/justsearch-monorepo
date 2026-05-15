# Games Agent Guide

> **Location**: `apps/customer-frontend/components/restaurant/games/`
> **Scope**: Full game lifecycle — platform catalog, admin toggle, customer discover & play, score tracking
> **Architecture**: Games defined in code (constants/mock data). Active/inactive state stored in backend DB. Admin toggles, customer frontend respects.

---

## 1. Architecture Overview

### Data Flow

```
[justsearch-admin]                    [Backend]                    [Customer Frontend]
       |                                  |                              |
  GameContainer.jsx                    game.routes.ts              eat-play/page.tsx
  (fetches games) ───GET /games──>   games table              ──GET /games/active──>
       |                                  |                              |
  Admin toggles ───PATCH /games/:id──>  isActive flipped               filters mock games
  active/inactive                        (isActive: false)             hides inactive
```

### Three Layers

| Layer | Location | Responsibility |
|-------|----------|----------------|
| **Game Definitions** | Code constants + mock data | Game names, descriptions, icons, prize info |
| **Activation State** | Backend `games` table + `PATCH /:id` | Which games are active/inactive |
| **Display & Play** | Customer frontend components | Game preview cards, intro screen, canvas games |

---

## 2. Game Definitions (In-Code)

### 2.1 Type Chain

```
@justsearch/utils (mock-restaurants.ts)
  └── BaseGame
       ├── LocalGame (type: 'local') — Canvas-based games with localGameId
       └── EmbedGame (type: 'embed') — External iframe games with embedUrl
```

**BaseGame fields:**
```typescript
type BaseGame = {
  id: string;
  name: string;
  description: string;
  icon: string;
  coverImageUrl?: string;
  prize: string;
  communityTopScore?: number;
  accessLevel: 'public' | 'login_required' | 'session_required';
  isAvailable: boolean;
  tag?: 'HOT' | 'TOP RATED' | 'NEW' | 'PRO';
};
```

### 2.2 The 5 Platform Games

| Game | localGameId | Type | Sponsor Ad | Tag |
|------|-------------|------|-----------|-----|
| Jump & Bite | `vex-runner` | Canvas (local) | Yes | HOT |
| Hungry Bird Rush | `hungry-bird-rush` | Canvas (local) | Yes | NEW |
| Cheddar Chase | `cheese-chase` | Canvas (local) | No | PRO |
| Gem Match | `memory-match` | Canvas (local) | Yes | HOT |
| Slice Master | `slice-master` | Canvas (local) | No | NEW |

### 2.3 Where Defined

| Source | File | Purpose |
|--------|------|---------|
| Shared mock data | `packages/utils/src/mock-restaurants.ts` | Restaurant.games[] in mock data |
| Admin constants | `apps/justsearch-admin/lib/constants/games.constants.ts` | Admin game list |
| Backend seed | `apps/backend/src/db/seed/seed.games.ts` | Populated into games table on seed |

All three sources have the same 5 games with matching names. The backend `isActive` column controls visibility. The mock data `isAvailable` is overridden at fetch time.

---

## 3. Admin Toggle (justsearch-admin)

### 3.1 API

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `GET` | `/api/v1/games` | super_admin | List all games |
| `PATCH` | `/api/v1/games/:id` | super_admin | Toggle `isActive` |
| `GET` | `/api/v1/games/active` | **Public** (no auth) | Customer frontend reads active games |

No create/delete — games are defined in code only.

### 3.2 Component Chain

```
game-container.tsx
  └── game-presenter.tsx
       ├── game-header.tsx    (active count / total count)
       └── game-list.tsx
            └── game-card.tsx (toggle switch, active badge)
```

### 3.3 Hook

```typescript
// lib/hooks/use-games-query.ts
useGamesQuery()           // GET /games → AdminGame[]
useUpdateGameMutation()   // PATCH /games/:id → { isActive }
```

---

## 4. Customer Frontend Flow

### 4.1 Route Structure

```
/eat-play                            → Game listing (filters by isActive)
/eat-play/[gameId]                   → Game intro/preview screen
/eat-play/[gameId]/play              → Active game canvas
/eat-play/profile                    → Game stats & profile
```

### 4.2 Game Discovery

```
app/eat-play/page.tsx (server component)
  ├── getCurrentRestaurant()    → returns restaurant with mock games
  ├── fetch(GET /games/active) → returns [{ id, name }] from backend
  └── filters restaurant.games by active names
       → sets isAvailable = true/false on each game
       → passes to RestaurantEatPlayShowcase

RestaurantEatPlayShowcase
  └── filters by game.isAvailable
       → if none active: shows EmptyState "No games available yet"
       → if games active: grid of RestaurantGamePreviewCard
```

### 4.3 Game Play Sequence

```
User taps game card
  → /eat-play/[gameId] (game detail page)
  → getGameByIdOrNotFound(gameId)   → finds game from restaurant.games
  → RestaurantGameScreen (mode: 'intro')

User taps "Start"
  → /eat-play/[gameId]/play
  → GamePlayerStage
       ├── if type === 'embed': EmbeddedGamePlayer (iframe)
       └── if type === 'local': LocalGamePlayer
            └── getLocalGameRenderer(localGameId) → canvas component

Game ends
  → onAward({ points, score, label })
  → AdOverlay (if sponsorAd enabled)
  → points added to loyalty store
```

### 4.4 Game Player Stage

```typescript
GamePlayerStage
  ├── EmbeddedGamePlayer   (for embed games — renders <iframe>)
  └── LocalGamePlayer      (for local games — selects from registry)
       ├── getLocalGameRenderer(localGameId)
       │    ├── 'vex-runner' → VexRunnerGame
       │    ├── 'hungry-bird-rush' → HungryBirdRushGame
       │    ├── 'cheese-chase' → CheeseChaseGame
       │    ├── 'memory-match' → MemoryMatchGame
       │    └── 'slice-master' → SliceMasterGame
       └── LocalGameFallback (if localGameId not found)
```

---

## 5. Game Screen (RestaurantGameScreen)

**File**: `restaurant-game-screen.tsx`  
**States**: `intro | play` mode

### Flow
1. **Intro mode** (`/eat-play/[gameId]`):
   - Shows `GameIntroStage`: cover image, game name, start button, high scores
   - Requires registration → prompts modal if not registered
2. **Play mode** (`/eat-play/[gameId]/play`):
   - Shows `AdOverlay` first (if sponsorAd)
   - Then shows `GamePlayerStage`
   - On game end: shows award, plays ad (if sponsorAd), adds points
3. **Exit**: Shows `GameExitConfirmDialog` on back navigation
4. **Ad breaks**: `AdOverlay` between plays and on game end (only if `sponsorAd: true`)

### Components

| Component | Purpose | Max Lines |
|-----------|---------|-----------|
| `restaurant-game-screen.tsx` | Main screen orchestrator | 217 |
| `game-intro-stage.tsx` | Pre-game intro with cover + scores | 85 |
| `game-player-stage.tsx` | Routes to embed/local player | 20 |
| `game-coin-pill.tsx` | Coin reward display | 27 |
| `game-exit-confirm-dialog.tsx` | Exit confirmation modal | 65 |
| `game-award.ts` | Award result types | 9 |

---

## 6. Ad Overlay System

**Purpose**: Show ads between games or after game completion (only for games with `sponsorAd: true`)

### Components

| Component | Purpose |
|-----------|---------|
| `ad-overlay.tsx` | Full-screen ad with timer, skip, info |
| `ad-media-renderer.tsx` | Renders image/video/emoji ad content |
| `ad-duration-timer.tsx` | Countdown timer before skip enabled |
| `ad-skip-button.tsx` | Skip button (enabled after minimum duration) |
| `ad-timer.tsx` | Generic timer display |
| `ad-info.tsx` | Ad attribution / company info |

### Ad Data Shape

```typescript
{ id, title, description, mediaUrl, mediaType: 'image' | 'video' | 'gif', duration, companyName }
```

**Fallback**: If no ads configured, shows hardcoded fallback `{ mediaUrl: "🍽️", mediaType: "image" }`.

**Important**: `mediaUrl` must be a valid URL (`http://`, `https://`, or `/`). Emoji strings will crash `next/image` — the renderer validates URLs before passing to `<Image>`.

---

## 7. Local Canvas Games

See `local/AGENTS.md` for detailed documentation of each canvas game.

**Architecture pattern per game:**
```
[game-name]/
├── [game-name]-game.tsx          → Game component (entry)
├── use-[game-name]-engine.ts     → Game loop hook (requestAnimationFrame)
├── [game-name]-model.ts          → Game state, physics, entities
└── [game-name]-canvas-art.ts     → Canvas rendering (draw calls)
```

All local games share the `LocalGameRenderer` type:
```typescript
type LocalGameRenderer = (props: { game: LocalGame; onAward: GameAwardHandler; coins?: number }) => ReactElement;
```

---

## 8. Profile & Stats

See `profile/AGENTS.md` for detailed documentation.

**Route**: `/eat-play/profile`  
**Components**: `eat-play-profile-screen.tsx`, `eat-play-game-stat-card.tsx`, `eat-play-header-wallet-link.tsx`

---

## 9. Cross-Platform Links

### Link 1: justsearch-admin → customer-frontend
```
Admin toggles game inactive (PATCH /games/:id)
  → games table isActive = false
  → Customer fetch GET /games/active → game NOT returned
  → eat-play/page.tsx sets isAvailable = false
  → Game hidden from customer
```

### Link 2: customer-frontend → backend (future)
```
Customer plays game → score earned
  → (future) POST /api/v1/game-sessions
  → game_sessions table records: restaurantId, gameId, score, pointsAwarded
  → (future) Admin analytics shows game performance
```

---

## 10. Build Checklist

- [ ] No component exceeds 80 lines (except restaurant-game-screen.tsx — flagged for split)
- [ ] Game definitions in constants match seed data names
- [ ] `GET /api/v1/games/active` is public (no auth middleware)
- [ ] URL validation in `ad-media-renderer.tsx` prevents Image crashes
- [ ] Empty state shown when no games active
- [ ] `tsc --noEmit` passes
- [ ] No `console.log`
