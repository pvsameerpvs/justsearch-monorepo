'use server';

import { headers } from 'next/headers';
import { cache } from 'react';
import {
  getRestaurantBySlug,
  getFallbackRestaurant,
} from '@justsearch/utils';
import type { Restaurant } from '@justsearch/utils';

export const getCurrentRestaurant = cache(async (): Promise<Restaurant> => {
  const headerStore = await headers();
  const forwardedSlug = headerStore.get('x-restaurant-slug');

  if (forwardedSlug) {
    const restaurant = getRestaurantBySlug(forwardedSlug);
    if (restaurant) return restaurant;
  }

  const host =
    headerStore.get('x-forwarded-host') ?? headerStore.get('host') ?? '';

  const normalizedHost = host.trim().toLowerCase().replace(/:\d+$/, '');
  let slug: string | null = null;

  if (normalizedHost.endsWith('.localhost')) {
    slug = normalizedHost.replace(/\.localhost$/, '').split('.').at(0) ?? null;
  } else {
    const parts = normalizedHost.split('.');
    if (parts.length >= 3) {
      slug = parts[0] ?? null;
    }
  }

  if (slug) {
    const restaurant = getRestaurantBySlug(slug);
    if (restaurant) return restaurant;
  }

  return getFallbackRestaurant();
});
