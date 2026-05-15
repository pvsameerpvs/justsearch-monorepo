"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { apiClient } from "./api-client";

interface DashboardAuthContextType {
  isAuthenticated: boolean;
  user: { id: string; name: string; role: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const DashboardAuthContext = createContext<DashboardAuthContextType | null>(null);

export function DashboardAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const me = await apiClient<{ id: string; name: string; role: string }>('/auth/me');
        setUser(me);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await apiClient<{ token: string; user: { id: string; name: string; role: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password, type: 'staff' }),
      });
      setUser(res.user);
      setIsAuthenticated(true);
      return true;
    } catch {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    // Cookie cleared server-side or naturally expires
    window.location.href = '/login';
  }, []);

  return (
    <DashboardAuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </DashboardAuthContext.Provider>
  );
}

export function useDashboardAuth() {
  const ctx = useContext(DashboardAuthContext);
  if (!ctx) throw new Error("useDashboardAuth must be used within DashboardAuthProvider");
  return ctx;
}
