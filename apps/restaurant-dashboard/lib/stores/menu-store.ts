"use client";

import { create } from 'zustand';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  subcategory?: string;
  price: number;
  currency: string;
  image?: string;
  tags?: string[];
  isAvailable: boolean;
  isVeg?: boolean;
};

export type MenuCategory = {
  id: string;
  title: string;
  description: string;
  emoji?: string;
  items: MenuItem[];
};

interface MenuStore {
  categories: MenuCategory[];
  addCategory: (title: string, description?: string, emoji?: string) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, updates: Partial<Omit<MenuCategory, 'id' | 'items'>>) => void;
  addItem: (categoryId: string, item: Omit<MenuItem, 'id'>) => void;
  removeItem: (categoryId: string, itemId: string) => void;
  updateItem: (categoryId: string, itemId: string, updates: Partial<Omit<MenuItem, 'id'>>) => void;
  toggleItem: (categoryId: string, itemId: string) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  categories: [],
  addCategory: (title, description = '', emoji = '') =>
    set((state) => ({
      categories: [...state.categories, { id: crypto.randomUUID(), title, description, emoji, items: [] }],
    })),
  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
  updateCategory: (id, updates) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  addItem: (categoryId, item) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId ? { ...c, items: [...c.items, { ...item, id: crypto.randomUUID() }] } : c
      ),
    })),
  removeItem: (categoryId, itemId) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
      ),
    })),
  updateItem: (categoryId, itemId, updates) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId
          ? { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)) }
          : c
      ),
    })),
  toggleItem: (categoryId, itemId) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId
          ? { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, isAvailable: !i.isAvailable } : i)) }
          : c
      ),
    })),
}));
