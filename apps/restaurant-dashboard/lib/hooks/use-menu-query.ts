import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCategories,
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/api/menu.api';
import type {
  MenuCategoryData,
  MenuItemData,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '@/lib/api/menu.types';

export type { MenuCategoryData, MenuItemData, CreateMenuItemPayload, UpdateMenuItemPayload, CreateCategoryPayload, UpdateCategoryPayload };

const STALE_TIME = 30_000;

function useInvalidateMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  queryKey: string[],
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
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
    queryFn: fetchMenuItems,
    staleTime: STALE_TIME,
  });
}

export const useCreateMenuItemMutation = () =>
  useInvalidateMutation(
    (data: CreateMenuItemPayload) => createMenuItem(data),
    ['menu-items'],
  );

export const useUpdateMenuItemMutation = () =>
  useInvalidateMutation(
    ({ id, data }: { id: string; data: UpdateMenuItemPayload }) => updateMenuItem(id, data),
    ['menu-items'],
  );

export const useDeleteMenuItemMutation = () =>
  useInvalidateMutation(
    (id: string) => deleteMenuItem(id),
    ['menu-items'],
  );

export const useCreateMenuCategoryMutation = () =>
  useInvalidateMutation(
    (data: CreateCategoryPayload) => createCategory(data),
    ['menu-categories'],
  );

export const useUpdateMenuCategoryMutation = () =>
  useInvalidateMutation(
    ({ id, data }: { id: string; data: UpdateCategoryPayload }) => updateCategory(id, data),
    ['menu-categories'],
  );

export const useDeleteMenuCategoryMutation = () =>
  useInvalidateMutation(
    (id: string) => deleteCategory(id),
    ['menu-categories'],
  );
