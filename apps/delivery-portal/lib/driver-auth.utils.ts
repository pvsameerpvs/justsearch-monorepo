const STORAGE_KEY = 'driver-auth-v1';

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

export function readStorage(): Partial<AuthState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeStorage(state: AuthState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      isLoggedIn: state.isLoggedIn,
      driverId: state.driverId,
      restaurantSlug: state.restaurantSlug,
      driverName: state.driverName,
    }));
  } catch {
    // ignore
  }
}

export function clearStorage() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
