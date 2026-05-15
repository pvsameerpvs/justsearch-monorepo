'use client';

import { useMemo, useState } from 'react';
import { useRestaurantsQuery } from '@/lib/hooks/use-restaurants-query';
import { useUsersAdminQuery } from '@/lib/hooks/use-users-admin-query';
import { RestaurantUserTable } from './restaurant-user-table';

export function UserContainer() {
  const { restaurants, isLoading: restaurantsLoading } = useRestaurantsQuery();
  const { users, isLoading: usersLoading } = useUsersAdminQuery();
  const [search, setSearch] = useState('');

  const isLoading = restaurantsLoading || usersLoading;

  const rows = useMemo(
    () =>
      restaurants.map((r) => {
        const restaurantUsers = users.filter((u) => u.restaurantId === r.id);
        return {
          id: r.id,
          name: r.name,
          city: r.city ?? '',
          area: r.area ?? '',
          cuisine: r.cuisine ?? '',
          status: r.status as 'active' | 'draft' | 'suspended',
          userCount: restaurantUsers.length,
          totalPoints: 0,
        };
      }),
    [restaurants, users]
  );

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.city.toLowerCase().includes(search.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(search.toLowerCase())
      ),
    [rows, search]
  );

  if (isLoading) return <div>Loading...</div>;

  return <RestaurantUserTable rows={filtered} search={search} onSearch={setSearch} />;
}
