import { RestaurantMenuShowcase } from '@/components/restaurant/restaurant-menu-showcase';
import { getCurrentRestaurant } from '@/lib/restaurant-resolver';
import { headers } from 'next/headers';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchMenu(host: string) {
  try {
    const res = await fetch(`${API_BASE}/menus`, {
      headers: { host },
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<{
      categories: Array<{
        id: string;
        name: string;
        description: string | null;
        sortOrder: number;
        items: Array<{
          id: string;
          name: string;
          description: string | null;
          price: string;
          imageUrl: string | null;
          tags: string[];
          isVeg: boolean;
          isAvailable: boolean;
        }>;
      }>;
    }>;
  } catch {
    return null;
  }
}

export default async function MenuPage() {
  const restaurant = await getCurrentRestaurant();
  const headerStore = await headers();
  const host = headerStore.get('host') ?? '';

  const menuData = await fetchMenu(host);
  const adaptedMenu = menuData
    ? menuData.categories.map((cat) => ({
        id: cat.id,
        title: cat.name,
        description: cat.description ?? '',
        emoji: '',
        items: cat.items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description ?? '',
          price: Number(item.price),
          currency: 'AED',
          image: item.imageUrl ?? undefined,
          tags: item.tags,
          isAvailable: item.isAvailable,
        })),
      }))
    : [];

  return <RestaurantMenuShowcase restaurant={{ ...restaurant, menu: adaptedMenu }} />;
}
