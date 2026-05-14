import type { AdminRestaurant } from "@/lib/stores/restaurant-store";

export interface RestaurantTableRow {
  id: string;
  name: string;
  city: string;
  area: string;
  cuisine: string;
  status: "active" | "draft" | "suspended";
  userCount: number;
  totalPoints: number;
}

export type RestaurantStatus = "active" | "draft" | "suspended";

export function buildRestaurantTableRow(
  restaurant: AdminRestaurant,
  userCount: number,
  totalPoints: number
): RestaurantTableRow {
  return {
    id: restaurant.id,
    name: restaurant.name,
    city: restaurant.city,
    area: restaurant.area,
    cuisine: restaurant.cuisine,
    status: restaurant.status,
    userCount,
    totalPoints,
  };
}
