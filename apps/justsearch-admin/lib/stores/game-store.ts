import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PLATFORM_GAMES } from '@/lib/constants/games.constants';

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
  toggleAvailability: (id: string) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      games: [...PLATFORM_GAMES],
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
