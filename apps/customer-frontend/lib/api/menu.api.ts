import { apiClient } from './client';
import type { MenuCategory } from '@justsearch/utils';

export type ApiMenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  tags: string[];
  isVeg: boolean;
  isAvailable: boolean;
  sortOrder: number;
};

export type ApiMenuCategory = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  items: ApiMenuItem[];
};

export type ApiMenuResponse = {
  categories: ApiMenuCategory[];
};

export async function fetchMenu(host: string): Promise<ApiMenuResponse | null> {
  try {
    return await apiClient<ApiMenuResponse>('/menus', {
      headers: { host },
    });
  } catch {
    return null;
  }
}

export function adaptApiCategoriesToLocal(
  data: ApiMenuResponse,
): MenuCategory[] {
  return data.categories.map((cat) => ({
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
  }));
}
