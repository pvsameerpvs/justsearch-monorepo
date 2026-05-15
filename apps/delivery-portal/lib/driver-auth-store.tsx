"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiClient } from "./api-client";

interface AuthState {
  isLoggedIn: boolean;
  driverId: string | null;
  restaurantSlug: string | null;
  driverName: string | null;
  hydrated: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function DriverAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    driverId: null,
    restaurantSlug: null,
    driverName: null,
    hydrated: false,
  });

  useEffect(() => {
    async function checkAuth() {
      try {
        const me = await apiClient<{ id: string; name: string; restaurantId: string }>('/auth/me');
        setState({
          isLoggedIn: true,
          driverId: me.id,
          restaurantSlug: me.restaurantId,
          driverName: me.name,
          hydrated: true,
        });
      } catch {
        setState((prev) => ({ ...prev, hydrated: true }));
      }
    }
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await apiClient<{ token: string; user: { id: string; name: string; restaurantId: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password, type: 'delivery' }),
      });
      setState({
        isLoggedIn: true,
        driverId: res.user.id,
        restaurantSlug: res.user.restaurantId,
        driverName: res.user.name,
        hydrated: true,
      });
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setState({
      isLoggedIn: false,
      driverId: null,
      restaurantSlug: null,
      driverName: null,
      hydrated: true,
    });
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useDriverAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useDriverAuth must be used within DriverAuthProvider");
  return ctx;
}
