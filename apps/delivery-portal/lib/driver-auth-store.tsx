"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface AuthState {
  isLoggedIn: boolean;
  driverId: string | null;
  restaurantSlug: string | null;
  driverName: string | null;
}

interface AuthContextType extends AuthState {
  login: (driverId: string, restaurantSlug: string, driverName: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function DriverAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    driverId: null,
    restaurantSlug: null,
    driverName: null,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("driver-auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({
          isLoggedIn: parsed.isLoggedIn ?? false,
          driverId: parsed.driverId ?? null,
          restaurantSlug: parsed.restaurantSlug ?? null,
          driverName: parsed.driverName ?? null,
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const login = (driverId: string, restaurantSlug: string, driverName: string) => {
    const next = { isLoggedIn: true, driverId, restaurantSlug, driverName };
    setState(next);
    localStorage.setItem("driver-auth", JSON.stringify(next));
  };

  const logout = () => {
    const next = { isLoggedIn: false, driverId: null, restaurantSlug: null, driverName: null };
    setState(next);
    localStorage.removeItem("driver-auth");
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
