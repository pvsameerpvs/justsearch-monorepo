"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/stores/user-store";
import { useRestaurantStore } from "@/lib/stores/restaurant-store";
import { RestaurantUsersPresenter } from "./restaurant-users-presenter";

interface RestaurantUsersPageContainerProps {
  restaurantId: string;
}

export function RestaurantUsersPageContainer({ restaurantId }: RestaurantUsersPageContainerProps) {
  const router = useRouter();
  const restaurant = useRestaurantStore((s) => s.restaurants.find((r) => r.id === restaurantId));
  const { getUsersByRestaurant, getTotalPointsByRestaurant } = useUserStore();

  const users = getUsersByRestaurant(restaurantId);
  const totalPoints = getTotalPointsByRestaurant(restaurantId);

  if (!restaurant) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm font-bold text-slate-700">Restaurant not found</p>
        <button onClick={() => router.push("/users")} className="mt-3 text-xs font-bold text-indigo-600 hover:underline">
          Back to Restaurants
        </button>
      </div>
    );
  }

  return (
    <RestaurantUsersPresenter
      restaurant={restaurant}
      users={users}
      totalPoints={totalPoints}
      onBack={() => router.push("/users")}
    />
  );
}
