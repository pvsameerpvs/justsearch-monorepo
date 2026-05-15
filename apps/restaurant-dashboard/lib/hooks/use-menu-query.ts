import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

const STALE_TIME = 30_000;

interface MenuCategory {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  status: string;
  createdAt: string;
}

interface MenuItem {
  id: string;
  menuId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  tags: string[];
  isVeg: boolean;
  isAvailable: boolean;
  sortOrder: number;
  createdAt: string;
}

async function fetchCategories(): Promise<{ categories: MenuCategory[] }> {
  return apiClient('/menu-categories');
}

async function fetchItems(): Promise<{ items: MenuItem[] }> {
  return apiClient('/menu-items');
}

export function useMenuCategoriesQuery() {
  return useQuery({
    queryKey: ['menu-categories'],
    queryFn: fetchCategories,
    staleTime: STALE_TIME,
  });
}

export function useMenuItemsQuery() {
  return useQuery({
    queryKey: ['menu-items'],
    queryFn: fetchItems,
    staleTime: STALE_TIME,
  });
}

export function useCreateMenuItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient('/menu-items', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
}

export function useUpdateMenuItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiClient(`/menu-items/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
}

export function useDeleteMenuItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient(`/menu-items/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-items'] });
    },
  });
}

export function useCreateMenuCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient('/menu-categories', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
    },
  });
}

export function useUpdateMenuCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      apiClient(`/menu-categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
    },
  });
}

export function useDeleteMenuCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient(`/menu-categories/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu-categories'] });
    },
  });
}
