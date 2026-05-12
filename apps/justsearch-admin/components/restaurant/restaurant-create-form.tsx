"use client";

import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@justsearch/ui';
import { generateSlug, SlugPreview } from '@/lib/slug-utils';

const restaurantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  city: z.string().min(2, 'City is required'),
  plan: z.enum(['pool', 'exclusive']),
  tables: z.coerce.number().min(1).max(100),
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

type RestaurantCreateFormProps = {
  onSubmit: (data: RestaurantFormData) => void;
  onCancel: () => void;
};

export function RestaurantCreateForm({ onSubmit, onCancel }: RestaurantCreateFormProps) {
  const [previewSlug, setPreviewSlug] = useState('');

  const form = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: { name: '', city: '', plan: 'pool', tables: 5 },
  });

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      form.setValue('name', name);
      setPreviewSlug(generateSlug(name));
    },
    [form]
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-700">Restaurant Name</label>
        <input
          {...form.register('name')}
          onChange={handleNameChange}
          placeholder="e.g., Mosaic Table"
          className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-amber-500 focus:outline-none"
        />
        {form.formState.errors.name && (
          <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>
        )}
      </div>

      <SlugPreview slug={previewSlug} />

      <div>
        <label className="text-sm font-semibold text-slate-700">City</label>
        <input
          {...form.register('city')}
          placeholder="e.g., Dubai"
          className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-amber-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700">Plan</label>
        <select
          {...form.register('plan')}
          className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-amber-500 focus:outline-none"
        >
          <option value="pool">Pool Reward (AED 3,000/year)</option>
          <option value="exclusive">Exclusive Reward (AED 3,000/year + 1,000/month)</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700">Number of Tables</label>
        <input
          type="number"
          {...form.register('tables')}
          className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-amber-500 focus:outline-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600">
          Create Restaurant
        </Button>
      </div>
    </form>
  );
}
