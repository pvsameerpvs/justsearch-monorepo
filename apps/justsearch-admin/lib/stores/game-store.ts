import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AdminGame = {
  id: string;
  name: string;
  description: string;
  localGameId: string;
  icon: string;
  prize: string;
  maxPoints: number;
  isAvailable: boolean;
  tag: string;
  sponsorAd: boolean;
};

interface GameStore {
  games: AdminGame[];
  addGame: (game: Omit<AdminGame, 'id'>) => void;
  updateGame: (id: string, updates: Partial<AdminGame>) => void;
  removeGame: (id: string) => void;
  toggleAvailability: (id: string) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      games: [
        {
          id: '1',
          name: 'Jump & Bite',
          description: 'Dash, jump, and dodge obstacles with food runners.',
          localGameId: 'vex-runner',
          icon: '🏃',
          prize: 'Up to 1200 points',
          maxPoints: 1200,
          isAvailable: true,
          tag: 'HOT',
          sponsorAd: true,
        },
        {
          id: '2',
          name: 'Hungry Bird Rush',
          description: 'Tap to fly, weave through pipes.',
          localGameId: 'hungry-bird-rush',
          icon: '🐤',
          prize: 'Up to 700 points',
          maxPoints: 700,
          isAvailable: true,
          tag: 'NEW',
          sponsorAd: true,
        },
        {
          id: '3',
          name: 'Cheddar Chase',
          description: 'Guide the mouse through mazes.',
          localGameId: 'cheese-chase',
          icon: '🧀',
          prize: 'Up to 2500 points',
          maxPoints: 2500,
          isAvailable: true,
          tag: 'PRO',
          sponsorAd: false,
        },
        {
          id: '4',
          name: 'Gem Match',
          description: 'Classic card matching game.',
          localGameId: 'memory-match',
          icon: '🃏',
          prize: 'Up to 2000 points',
          maxPoints: 2000,
          isAvailable: true,
          tag: 'HOT',
          sponsorAd: true,
        },
        {
          id: '5',
          name: 'Slice Master',
          description: 'Swipe to slice flying fruits.',
          localGameId: 'slice-master',
          icon: '🍕',
          prize: 'Up to 600 points',
          maxPoints: 600,
          isAvailable: true,
          tag: 'NEW',
          sponsorAd: false,
        },
      ],
      addGame: (game) =>
        set((state) => ({
          games: [...state.games, { ...game, id: crypto.randomUUID() }],
        })),
      updateGame: (id, updates) =>
        set((state) => ({
          games: state.games.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),
      removeGame: (id) =>
        set((state) => ({
          games: state.games.filter((g) => g.id !== id),
        })),
      toggleAvailability: (id) =>
        set((state) => ({
          games: state.games.map((g) =>
            g.id === id ? { ...g, isAvailable: !g.isAvailable } : g
          ),
        })),
    }),
    { name: 'justsearch-admin-games' }
  )
);
