import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RestaurantPlan = 'pool' | 'exclusive';

export type AdminRestaurant = {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  plan: RestaurantPlan;
  city: string;
  status: 'active' | 'draft' | 'suspended';
  createdAt: string;
  qrCount: number;
  tables: number;
};

interface RestaurantStore {
  restaurants: AdminRestaurant[];
  addRestaurant: (restaurant: Omit<AdminRestaurant, 'id' | 'createdAt' | 'status'>) => void;
  updateRestaurant: (id: string, updates: Partial<AdminRestaurant>) => void;
  removeRestaurant: (id: string) => void;
  getRestaurantBySlug: (slug: string) => AdminRestaurant | undefined;
}

export const useRestaurantStore = create<RestaurantStore>()(
  persist(
    (set, get) => ({
      restaurants: [
        {
          id: '1',
          name: 'Mosaic Table',
          slug: 'mosaic-table',
          subdomain: 'mosaic-table',
          plan: 'exclusive',
          city: 'Dubai',
          status: 'active',
          createdAt: '2024-01-15',
          qrCount: 12,
          tables: 10,
        },
        {
          id: '2',
          name: 'Spice Garden',
          slug: 'spice-garden',
          subdomain: 'spice-garden',
          plan: 'pool',
          city: 'Dubai',
          status: 'active',
          createdAt: '2024-03-20',
          qrCount: 6,
          tables: 5,
        },
      ],
      addRestaurant: (restaurant) =>
        set((state) => ({
          restaurants: [
            ...state.restaurants,
            {
              ...restaurant,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString().split('T')[0],
              status: 'active',
            },
          ],
        })),
      updateRestaurant: (id, updates) =>
        set((state) => ({
          restaurants: state.restaurants.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),
      removeRestaurant: (id) =>
        set((state) => ({
          restaurants: state.restaurants.filter((r) => r.id !== id),
        })),
      getRestaurantBySlug: (slug) =>
        get().restaurants.find((r) => r.slug === slug),
    }),
    { name: 'justsearch-admin-restaurants' }
  )
);
