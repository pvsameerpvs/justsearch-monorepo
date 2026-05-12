"use client";

import { generateSlug, SlugPreview } from '@/lib/slug-utils';
import { Button } from '@justsearch/ui';
import type { UseFormReturn } from 'react-hook-form';
import type { RestaurantFormData } from './restaurant-create-form';

type RestaurantCreateFormFieldsProps = {
  form: UseFormReturn<RestaurantFormData>;
  onSubmit: (data: RestaurantFormData) => void;
  onCancel: () => void;
  previewSlug: string;
  setPreviewSlug: (slug: string) => void;
};

export function RestaurantCreateFormFields({ form, onSubmit, onCancel, previewSlug, setPreviewSlug }: RestaurantCreateFormFieldsProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-slate-700">Restaurant Name</label>
        <input
          {...form.register('name')}
          onChange={(e) => {
            form.setValue('name', e.target.value);
            setPreviewSlug(generateSlug(e.target.value));
          }}
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
