import { apiClient } from '@/lib/api-client';
import type { MenuCategoryData, MenuItemData, CreateMenuItemPayload, UpdateMenuItemPayload, CreateCategoryPayload, UpdateCategoryPayload } from './menu.types';

export type { MenuCategoryData, MenuItemData, CreateMenuItemPayload, UpdateMenuItemPayload, CreateCategoryPayload, UpdateCategoryPayload };

export async function fetchCategories(): Promise<{ categories: MenuCategoryData[] }> {
  return apiClient('/menu-categories');
}

export async function fetchMenuItems(): Promise<{ items: MenuItemData[] }> {
  return apiClient('/menu-items');
}

export async function createMenuItem(data: CreateMenuItemPayload): Promise<{ item: MenuItemData }> {
  return apiClient('/menu-items', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateMenuItem(id: string, data: UpdateMenuItemPayload): Promise<{ item: MenuItemData }> {
  return apiClient(`/menu-items/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteMenuItem(id: string): Promise<void> {
  await apiClient(`/menu-items/${id}`, { method: 'DELETE' });
}

export async function createCategory(data: CreateCategoryPayload): Promise<{ category: MenuCategoryData }> {
  return apiClient('/menu-categories', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateCategory(id: string, data: UpdateCategoryPayload): Promise<{ category: MenuCategoryData }> {
  return apiClient(`/menu-categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function deleteCategory(id: string): Promise<void> {
  await apiClient(`/menu-categories/${id}`, { method: 'DELETE' });
}
