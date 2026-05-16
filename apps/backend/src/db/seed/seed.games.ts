import { db } from '../index';
import { games } from '../schema';

const PLATFORM_GAMES = [
  {
    name: 'Jump & Bite',
    type: 'vex-runner',
    config: { description: 'Dash, jump, and dodge obstacles with food runners.', icon: '🏃', prize: 'Up to 1200 points', maxPoints: 1200, tag: 'HOT', sponsorAd: true },
    isActive: true,
  },
  {
    name: 'Hungry Bird Rush',
    type: 'hungry-bird-rush',
    config: { description: 'Tap to fly, weave through pipes.', icon: '🐤', prize: 'Up to 700 points', maxPoints: 700, tag: 'NEW', sponsorAd: true },
    isActive: true,
  },
  {
    name: 'Cheddar Chase',
    type: 'cheese-chase',
    config: { description: 'Guide the mouse through mazes.', icon: '🧀', prize: 'Up to 2500 points', maxPoints: 2500, tag: 'PRO', sponsorAd: false },
    isActive: true,
  },
  {
    name: 'Gem Match',
    type: 'memory-match',
    config: { description: 'Classic card matching game.', icon: '🃏', prize: 'Up to 2000 points', maxPoints: 2000, tag: 'HOT', sponsorAd: true },
    isActive: true,
  },
  {
    name: 'Slice Master',
    type: 'slice-master',
    config: { description: 'Swipe to slice flying fruits.', icon: '🍕', prize: 'Up to 600 points', maxPoints: 600, tag: 'NEW', sponsorAd: false },
    isActive: true,
  },
];

export async function seedGames() {
  const existing = await db.select().from(games);
  if (existing.length > 0) {
    return;
  }

  for (const game of PLATFORM_GAMES) {
    await db.insert(games).values(game);
  }
}
