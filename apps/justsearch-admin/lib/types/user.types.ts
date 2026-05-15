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
  status: 'active' | 'inactive';
  gamePoints: UserGamePoints[];
  totalPoints: number;
}
