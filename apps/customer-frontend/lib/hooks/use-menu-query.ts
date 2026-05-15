import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  tags: string[];
  isAvailable: boolean;
  sortOrder: number;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  emoji: string | null;
  sortOrder: number;
  items: MenuItem[];
}

interface MenuResponse {
  categories: MenuCategory[];
}

const STALE_TIME = 5 * 60 * 1000;

async function fetchMenu(): Promise<MenuResponse> {
  return apiClient<MenuResponse>('/menus');
}

export function useMenuQuery() {
  return useQuery({
    queryKey: ['menu'],
    queryFn: fetchMenu,
    staleTime: STALE_TIME,
  });
}
