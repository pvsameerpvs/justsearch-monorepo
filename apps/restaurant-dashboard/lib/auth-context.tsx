"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getSlugFromHostname, getAuthKey, getRestaurantBySlug } from "./auth-helpers";

interface DashboardAuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const DashboardAuthContext = createContext<DashboardAuthContextType | null>(null);

export function DashboardAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const slug = getSlugFromHostname();

  useEffect(() => {
    const authKey = getAuthKey(slug);
    const token = localStorage.getItem(authKey);
    if (token === "authenticated") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [slug]);

  const login = useCallback(
    (username: string, password: string): boolean => {
      const restaurant = getRestaurantBySlug(slug);
      if (!restaurant) return false;
      if (username === restaurant.dashboardUsername && password === restaurant.dashboardPassword) {
        localStorage.setItem(getAuthKey(slug), "authenticated");
        setIsAuthenticated(true);
        return true;
      }
      return false;
    },
    [slug]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(getAuthKey(slug));
    setIsAuthenticated(false);
  }, [slug]);

  return (
    <DashboardAuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </DashboardAuthContext.Provider>
  );
}

export function useDashboardAuth() {
  const ctx = useContext(DashboardAuthContext);
  if (!ctx) throw new Error("useDashboardAuth must be used within DashboardAuthProvider");
  return ctx;
}
