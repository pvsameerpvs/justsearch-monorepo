'use client';

import { useRouter } from 'next/navigation';
import { useRestaurantsQuery } from '@/lib/hooks/use-restaurants-query';
import { useUsersAdminQuery } from '@/lib/hooks/use-users-admin-query';
import { RestaurantUsersPresenter } from './restaurant-users-presenter';

interface RestaurantUsersPageContainerProps {
  restaurantId: string;
}

export function RestaurantUsersPageContainer({ restaurantId }: RestaurantUsersPageContainerProps) {
  const router = useRouter();
  const { restaurants, isLoading: restaurantsLoading } = useRestaurantsQuery();
  const { users: allUsers, isLoading: usersLoading } = useUsersAdminQuery();

  const apiRestaurant = restaurants.find((r) => r.id === restaurantId);
  const users = allUsers.filter((u) => u.restaurantId === restaurantId);

  if (restaurantsLoading || usersLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!apiRestaurant) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm font-bold text-slate-700">Restaurant not found</p>
        <button onClick={() => router.push('/users')} className="mt-3 text-xs font-bold text-indigo-600 hover:underline">
          Back to Restaurants
        </button>
      </div>
    );
  }

  return (
    <RestaurantUsersPresenter
      restaurant={{
        id: apiRestaurant.id,
        name: apiRestaurant.name,
        slug: apiRestaurant.slug,
        subdomain: apiRestaurant.subdomain,
        city: apiRestaurant.city || '',
        area: apiRestaurant.area || '',
        status: apiRestaurant.status as 'active' | 'draft' | 'suspended',
        createdAt: apiRestaurant.createdAt,
        tables: apiRestaurant.tables || 0,
        ownerName: apiRestaurant.ownerName || '',
        contactPhone: apiRestaurant.contactPhone || '',
        contactEmail: apiRestaurant.contactEmail || '',
        address: apiRestaurant.address || '',
        cuisine: apiRestaurant.cuisine || '',
        taxNumber: apiRestaurant.taxNumber || '',
        businessLicense: apiRestaurant.businessLicense || '',
        licenseUrl: apiRestaurant.licenseUrl || '',
        photos: apiRestaurant.photos || [],
        dashboardUsername: apiRestaurant.dashboardUsername || '',
        dashboardPassword: apiRestaurant.dashboardPassword || '',
      }}
      users={users.map((u) => ({
        id: u.id,
        restaurantId: u.restaurantId || restaurantId,
        name: u.name,
        phone: u.phone || '',
        status: u.isActive ? ('active' as const) : ('inactive' as const),
        totalPoints: 0,
        gamePoints: [],
      }))}
      totalPoints={0}
      onBack={() => router.push('/users')}
    />
  );
}
