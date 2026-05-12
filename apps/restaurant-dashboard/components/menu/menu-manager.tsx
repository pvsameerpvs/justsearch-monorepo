"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@justsearch/ui';
import { useMenuStore } from '@/lib/stores/menu-store';
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react';

const itemSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  price: z.coerce.number().min(1),
});

type ItemFormData = z.infer<typeof itemSchema>;

export function MenuManager() {
  const { categories, addCategory, addItem, removeItem, toggleItem } = useMenuStore();
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id ?? '');
  const [showItemForm, setShowItemForm] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: { name: '', description: '', price: 0 },
  });

  const handleAddItem = (data: ItemFormData) => {
    if (!activeCategory) return;
    addItem(activeCategory, { ...data, categoryId: activeCategory, isAvailable: true });
    form.reset();
    setShowItemForm(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Menu Editor</h3>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {cat.title}
          </button>
        ))}
        <div className="flex shrink-0 gap-2">
          <input
            value={newCategoryTitle}
            onChange={(e) => setNewCategoryTitle(e.target.value)}
            placeholder="New category"
            className="w-32 rounded-xl border border-slate-200 px-3 text-sm"
          />
          <Button
            size="sm"
            onClick={() => {
              if (newCategoryTitle) {
                addCategory(newCategoryTitle);
                setNewCategoryTitle('');
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {categories
          .find((c) => c.id === activeCategory)
          ?.items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between rounded-xl border p-3 ${
                item.isAvailable ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'
              }`}
            >
              <div>
                <p className="font-bold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.description}</p>
                <p className="text-sm font-bold text-amber-600">AED {item.price}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleItem(activeCategory, item.id)}
                  className="text-slate-400 hover:text-amber-600"
                >
                  {item.isAvailable ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(activeCategory, item.id)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
      </div>

      {showItemForm ? (
        <form onSubmit={form.handleSubmit(handleAddItem)} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <input {...form.register('name')} placeholder="Item name" className="w-full rounded-lg border p-2 text-sm" />
          <input {...form.register('description')} placeholder="Description" className="w-full rounded-lg border p-2 text-sm" />
          <input type="number" {...form.register('price')} placeholder="Price (AED)" className="w-full rounded-lg border p-2 text-sm" />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowItemForm(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-amber-500">
              Add Item
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" className="w-full" onClick={() => setShowItemForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      )}
    </div>
  );
}
