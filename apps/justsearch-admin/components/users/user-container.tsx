"use client";

import { useState, useMemo } from "react";
import { useRestaurantStore } from "@/lib/stores/restaurant-store";
import { useUserStore } from "@/lib/stores/user-store";
import { RestaurantUserTable } from "./restaurant-user-table";

export function UserContainer() {
  const restaurants = useRestaurantStore((s) => s.restaurants);
  const { getUsersByRestaurant, getTotalPointsByRestaurant } = useUserStore();
  const [search, setSearch] = useState("");

  const rows = useMemo(
    () =>
      restaurants.map((r) => ({
        ...r,
        userCount: getUsersByRestaurant(r.id).length,
        totalPoints: getTotalPointsByRestaurant(r.id),
      })),
    [restaurants, getUsersByRestaurant, getTotalPointsByRestaurant]
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

  return <RestaurantUserTable rows={filtered} search={search} onSearch={setSearch} />;
}
