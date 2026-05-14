import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RestaurantStatus = 'active' | 'draft' | 'suspended';

export type AdminRestaurant = {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  city: string;
  area: string;
  status: RestaurantStatus;
  createdAt: string;
  tables: number;
  // Contact
  ownerName: string;
  contactPhone: string;
  contactEmail: string;
  // Location
  address: string;
  cuisine: string;
  // Business
  taxNumber: string;
  businessLicense: string;
  licenseUrl: string;
  // Photos
  photos: string[];
  // Dashboard Access
  dashboardUsername: string;
  dashboardPassword: string;
};

export type CreateRestaurantInput = {
  name: string;
  slug: string;
  subdomain: string;
  city: string;
  area: string;
  tables: number;
  ownerName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  cuisine: string;
  taxNumber: string;
  businessLicense: string;
  licenseUrl: string;
  photos: string[];
  dashboardUsername: string;
  dashboardPassword: string;
};

interface RestaurantStore {
  restaurants: AdminRestaurant[];
  addRestaurant: (restaurant: CreateRestaurantInput) => void;
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
          city: 'Dubai',
          area: 'Marina',
          status: 'active',
          createdAt: '2024-01-15',
          tables: 10,
          ownerName: 'Ahmed Al-Rashid',
          contactPhone: '+971 50 123 4567',
          contactEmail: 'ahmed@mosaictable.ae',
          address: 'Dubai Marina, Tower A, Floor 2',
          cuisine: 'Mediterranean',
          taxNumber: 'TRN-123456789',
          businessLicense: 'BL-987654321',
          licenseUrl: '',
          photos: [],
          dashboardUsername: 'js',
          dashboardPassword: '1234',
        },
        {
          id: '2',
          name: 'Spice Garden',
          slug: 'spice-garden',
          subdomain: 'spice-garden',
          city: 'Dubai',
          area: 'Deira',
          status: 'active',
          createdAt: '2024-03-20',
          tables: 5,
          ownerName: 'Priya Sharma',
          contactPhone: '+971 55 987 6543',
          contactEmail: 'priya@spicegarden.ae',
          address: 'Al Muraqqabat Street, Shop 15',
          cuisine: 'Indian',
          taxNumber: 'TRN-987654321',
          businessLicense: 'BL-123456789',
          licenseUrl: '',
          photos: [],
          dashboardUsername: 'js',
          dashboardPassword: '1234',
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
