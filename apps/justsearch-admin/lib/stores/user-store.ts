import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserGamePoints {
  gameId: string;
  gameName: string;
  points: number;
}

export interface RestaurantUser {
  id: string;
  restaurantId: string;
  name: string;
  phone: string;
  status: "active" | "inactive";
  gamePoints: UserGamePoints[];
  totalPoints: number;
}

interface UserStore {
  users: RestaurantUser[];
  getUsersByRestaurant: (restaurantId: string) => RestaurantUser[];
  getTotalPointsByRestaurant: (restaurantId: string) => number;
}

const DEMO_USERS: RestaurantUser[] = [
  {
    id: "u1",
    restaurantId: "1",
    name: "Amina Hassan",
    phone: "+971 55 111 2222",
    status: "active",
    gamePoints: [
      { gameId: "1", gameName: "Jump & Bite", points: 850 },
      { gameId: "2", gameName: "Hungry Bird Rush", points: 420 },
      { gameId: "4", gameName: "Gem Match", points: 1200 },
    ],
    totalPoints: 2470,
  },
  {
    id: "u2",
    restaurantId: "1",
    name: "Khalid Al Mansoori",
    phone: "+971 50 333 4444",
    status: "active",
    gamePoints: [
      { gameId: "1", gameName: "Jump & Bite", points: 1100 },
      { gameId: "3", gameName: "Cheddar Chase", points: 1800 },
    ],
    totalPoints: 2900,
  },
  {
    id: "u3",
    restaurantId: "1",
    name: "Priya Nair",
    phone: "+971 52 555 6666",
    status: "active",
    gamePoints: [
      { gameId: "2", gameName: "Hungry Bird Rush", points: 650 },
      { gameId: "5", gameName: "Slice Master", points: 300 },
    ],
    totalPoints: 950,
  },
  {
    id: "u4",
    restaurantId: "1",
    name: "Omar Farooq",
    phone: "+971 56 777 8888",
    status: "inactive",
    gamePoints: [
      { gameId: "4", gameName: "Gem Match", points: 500 },
    ],
    totalPoints: 500,
  },
  {
    id: "u5",
    restaurantId: "2",
    name: "Fatima Al-Zahra",
    phone: "+971 54 222 3333",
    status: "active",
    gamePoints: [
      { gameId: "1", gameName: "Jump & Bite", points: 950 },
      { gameId: "3", gameName: "Cheddar Chase", points: 2200 },
      { gameId: "4", gameName: "Gem Match", points: 1600 },
    ],
    totalPoints: 4750,
  },
  {
    id: "u6",
    restaurantId: "2",
    name: "Rashid Bin Sultan",
    phone: "+971 50 444 5555",
    status: "active",
    gamePoints: [
      { gameId: "2", gameName: "Hungry Bird Rush", points: 580 },
      { gameId: "5", gameName: "Slice Master", points: 450 },
    ],
    totalPoints: 1030,
  },
  {
    id: "u7",
    restaurantId: "2",
    name: "Lina Khoury",
    phone: "+971 55 666 7777",
    status: "inactive",
    gamePoints: [
      { gameId: "1", gameName: "Jump & Bite", points: 200 },
    ],
    totalPoints: 200,
  },
];

export const useUserStore = create<UserStore>()(
  persist(
    () => ({
      users: DEMO_USERS,
      getUsersByRestaurant: (restaurantId) =>
        DEMO_USERS.filter((u) => u.restaurantId === restaurantId),
      getTotalPointsByRestaurant: (restaurantId) =>
        DEMO_USERS.filter((u) => u.restaurantId === restaurantId).reduce((sum, u) => sum + u.totalPoints, 0),
    }),
    { name: "justsearch-admin-users" }
  )
);
