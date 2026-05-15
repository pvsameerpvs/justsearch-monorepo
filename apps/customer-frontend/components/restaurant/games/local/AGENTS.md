# Local Games Agent Guide

> **Location**: `apps/customer-frontend/components/restaurant/games/local/`
> **Scope**: 5 canvas-based games rendered client-side with HTML5 Canvas
> **Architecture**: Each game follows a 4-file pattern: Game Component → Engine Hook → Model → Canvas Art

---

## 1. Architecture Pattern

Every local game follows this structure:

```
[game-name]/
├── [game-name]-game.tsx          → React component (entry point, wires model → engine → canvas)
├── use-[game-name]-engine.ts     → Game loop hook (requestAnimationFrame, input handling, timing)
├── [game-name]-model.ts          → Game state, physics simulation, collision detection, entities
└── [game-name]-canvas-art.ts     → Canvas rendering (all drawRect/fillText/drawImage calls)
```

### Data Flow

```
Game Component
  ├── Instantiates Model (state, entities, physics)
  ├── Calls Engine Hook (creates game loop)
  │    └── Each frame:
  │         ├── model.update(deltaTime, input) → advances state
  │         └── canvasArt.render(ctx, model)   → draws frame
  └── onAward callback → returns { points, score, label }
```

### Shared Renderer Protocol

All local games conform to the `LocalGameRenderer` type:

```typescript
type LocalGameRenderer = (props: {
  game: LocalGame;
  onAward: GameAwardHandler;
  coins?: number;
}) => ReactElement;
```

### Registry

```typescript
// local-game-registry.tsx
const LOCAL_GAME_REGISTRY = {
  'hungry-bird-rush': HungryBirdRushGame,
  'vex-runner': VexRunnerGame,
  'cheese-chase': CheeseChaseGame,
  'memory-match': MemoryMatchGame,
  'slice-master': SliceMasterGame,
};
```

The `LocalGamePlayer` component looks up the game by `localGameId` and renders the matching component. If not found, shows `LocalGameFallback`.

---

## 2. The 5 Games

| Game | localGameId | Type | Max Points | Sponsor Ad | Est. Lines |
|------|-------------|------|-----------|------------|------------|
| Jump & Bite | `vex-runner` | Runner | 1200 | Yes | ~200 |
| Hungry Bird Rush | `hungry-bird-rush` | Flappy-style | 700 | Yes | ~200 |
| Cheddar Chase | `cheese-chase` | Maze | 2500 | No | ~150 |
| Gem Match | `memory-match` | Card match | 2000 | Yes | ~200 |
| Slice Master | `slice-master` | Fruit slice | 600 | No | ~150 |

### 2.1 Jump & Bite (`vex-runner`)

**Type**: Endless runner / obstacle dodge  
**Controls**: Tap or click to jump  
**Mechanics**:
- Player character runs automatically
- Obstacles appear at varying heights and speeds
- Score increases with distance
- Collision ends the game
- Food items can be collected for bonus points

**Files**:
- `vex-runner-game.tsx` — Game wrapper, wires canvas ref + engine + model
- `use-vex-runner-engine.ts` — Runners' animation loop, tracks score/obstacles
- `vex-runner-model.ts` — Player physics, obstacle generation, collision boxes
- `vex-runner-canvas-art.ts` — Draws background, runner, obstacles, UI overlay

### 2.2 Hungry Bird Rush (`hungry-bird-rush`)

**Type**: Flappy bird clone  
**Controls**: Tap to flap  
**Mechanics**:
- Bird has gravity + flap velocity
- Pipes with gaps scroll from right
- Passing through gaps = score
- Hitting pipe or ground = game over

**Files**:
- `hungry-bird-rush-game.tsx`
- `use-hungry-bird-rush-engine.ts`
- `hungry-bird-rush-model.ts`
- `hungry-bird-rush-canvas-art.ts`

### 2.3 Cheddar Chase (`cheese-chase`)

**Type**: Maze / collect-a-thon  
**Controls**: Swipe or arrow keys to move  
**Mechanics**:
- Player moves through maze collecting cheese
- Maze layout may be procedurally generated
- Timer adds pressure
- Collect all cheese to complete level

**Files**:
- `cheese-chase-game.tsx`
- `use-cheese-chase-engine.ts`
- `cheese-chase-model.ts`
- `cheese-chase-canvas-art.ts`

### 2.4 Gem Match (`memory-match`)

**Type**: Memory card matching  
**Controls**: Tap cards to flip  
**Mechanics**:
- Grid of face-down cards
- Flip two → if match, they stay face-up
- Match all pairs to win
- Fewer tries = higher score

**Files**:
- `memory-match-game.tsx`
- `use-memory-match-engine.ts`
- `memory-match-model.ts`
- `memory-match-canvas-art.ts`

### 2.5 Slice Master (`slice-master`)

**Type**: Fruit slicing  
**Controls**: Swipe to slice  
**Mechanics**:
- Fruits arc up from bottom
- Swipe through them to slice
- Avoid bombs (end game)
- Combo multiplier for consecutive slices

**Files**:
- `slice-master-game.tsx`
- `use-slice-master-engine.ts`
- `slice-master-model.ts`
- `slice-master-canvas-art.ts`

---

## 3. Award System

When a game ends, it calls `onAward` with:

```typescript
type GameAwardResult = {
  points: number;      // Points awarded to user
  score: number;       // Raw game score
  label: string;       // Readable result (e.g. "Amazing!", "Good job!")
  level?: number;      // Level reached (if applicable)
};
```

Points are added to the user's loyalty points store and displayed with `GameCoinPill`.

---

## 4. Build Checklist

- [ ] Each game follows the 4-file pattern (game.tsx, engine.ts, model.ts, canvas-art.ts)
- [ ] All games registered in `local-game-registry.tsx`
- [ ] Game ends gracefully → calls `onAward` with valid result
- [ ] `LocalGameFallback` shown for unregistered game IDs
- [ ] Canvas properly cleaned up on unmount (cancelAnimationFrame)
- [ ] No `console.log`
