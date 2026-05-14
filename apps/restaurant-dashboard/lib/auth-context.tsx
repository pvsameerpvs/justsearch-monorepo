"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface DashboardAuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const DashboardAuthContext = createContext<DashboardAuthContextType | null>(null);

function getSlugFromHostname(): string {
  if (typeof window === "undefined") return "mosaic-table";
  const host = window.location.hostname.toLowerCase();
  // Localhost / dev fallback
  if (host === "localhost" || host === "127.0.0.1") {
    return "mosaic-table";
  }
  if (host.startsWith("admin-")) {
    return host.replace("admin-", "").split(".")[0];
  }
  return host.split(".")[0];
}

function getAuthKey(slug: string): string {
  return "restaurant-dashboard-auth-" + slug;
}

const DEMO_CREDENTIALS: Record<string, { dashboardUsername: string; dashboardPassword: string }> = {
  "mosaic-table": { dashboardUsername: "js", dashboardPassword: "1234" },
  "spice-garden": { dashboardUsername: "js", dashboardPassword: "1234" },
};

function getRestaurantBySlug(slug: string): { dashboardUsername: string; dashboardPassword: string } | null {
  // Try localStorage first (same-origin only)
  try {
    const raw = localStorage.getItem("justsearch-admin-restaurants");
    if (raw) {
      const parsed = JSON.parse(raw);
      const restaurants = parsed.state?.restaurants ?? [];
      const found = restaurants.find((r: any) => r.slug === slug || r.subdomain === slug);
      if (found && found.dashboardUsername && found.dashboardPassword) {
        return {
          dashboardUsername: found.dashboardUsername,
          dashboardPassword: found.dashboardPassword,
        };
      }
    }
  } catch {
    // ignore
  }

  // Fallback to demo credentials (for cross-origin / dev testing)
  return DEMO_CREDENTIALS[slug] ?? null;
}

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
