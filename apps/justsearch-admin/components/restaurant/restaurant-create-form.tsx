"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RestaurantCreateFormFields } from './restaurant-create-form-fields';

const restaurantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  city: z.string().min(2, 'City is required'),
  plan: z.enum(['pool', 'exclusive']),
  tables: z.coerce.number().min(1).max(100),
});

export type RestaurantFormData = z.infer<typeof restaurantSchema>;

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

  return (
    <RestaurantCreateFormFields
      form={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      previewSlug={previewSlug}
      setPreviewSlug={setPreviewSlug}
    />
  );
}
