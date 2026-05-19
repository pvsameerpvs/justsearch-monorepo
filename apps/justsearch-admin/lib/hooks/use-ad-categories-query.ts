'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface AdCategory {
  id: string;
  name: string;
  isActive: boolean;
}

const CATEGORIES_KEY = ['ad-categories'] as const;

async function fetchAdCategories(): Promise<AdCategory[]> {
  const res = await apiClient<{ categories: AdCategory[] }>('/advertisements/public/categories');
  return res.categories;
}

export function useAdCategoriesQuery() {
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: fetchAdCategories,
  });
  return { categories, isLoading, error };
}

export function useCreateAdCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await apiClient<{ category: AdCategory }>('/advertisements/categories', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      return res.category;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}
