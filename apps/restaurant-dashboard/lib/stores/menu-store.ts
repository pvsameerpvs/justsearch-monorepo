"use client";

import { create } from 'zustand';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  isAvailable: boolean;
};

export type MenuCategory = {
  id: string;
  title: string;
  items: MenuItem[];
};

interface MenuStore {
  categories: MenuCategory[];
  addCategory: (title: string) => void;
  removeCategory: (id: string) => void;
  addItem: (categoryId: string, item: Omit<MenuItem, 'id'>) => void;
  removeItem: (categoryId: string, itemId: string) => void;
  toggleItem: (categoryId: string, itemId: string) => void;
}

const INITIAL_CATEGORIES: MenuCategory[] = [
  {
    id: '1',
    title: 'Small Plates',
    items: [
      { id: '1', name: 'Whipped Hummus', description: 'Crisp chickpeas, olive oil, pita', price: 28, categoryId: '1', isAvailable: true },
      { id: '2', name: 'Charred Halloumi', description: 'Citrus glaze, mint, sesame', price: 34, categoryId: '1', isAvailable: true },
    ],
  },
  {
    id: '2',
    title: 'Main Plates',
    items: [
      { id: '3', name: 'Citrus Grilled Salmon', description: 'Herb rice, lemon butter', price: 78, categoryId: '2', isAvailable: true },
    ],
  },
];

export const useMenuStore = create<MenuStore>((set) => ({
  categories: INITIAL_CATEGORIES,
  addCategory: (title) =>
    set((state) => ({
      categories: [...state.categories, { id: crypto.randomUUID(), title, items: [] }],
    })),
  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),
  addItem: (categoryId, item) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId
          ? { ...c, items: [...c.items, { ...item, id: crypto.randomUUID() }] }
          : c
      ),
    })),
  removeItem: (categoryId, itemId) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId
          ? { ...c, items: c.items.filter((i) => i.id !== itemId) }
          : c
      ),
    })),
  toggleItem: (categoryId, itemId) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              items: c.items.map((i) =>
                i.id === itemId ? { ...i, isAvailable: !i.isAvailable } : i
              ),
            }
          : c
      ),
    })),
}));
