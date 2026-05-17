export interface AuthState {
  isLoggedIn: boolean;
  driverId: string | null;
  restaurantSlug: string | null;
  driverName: string | null;
  hydrated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}
