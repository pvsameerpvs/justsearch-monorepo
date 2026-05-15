"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { useAuthMeQuery, useLoginMutation } from "./hooks/use-auth-query";

interface DashboardAuthContextType {
  isAuthenticated: boolean;
  user: { id: string; name: string; role: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const DashboardAuthContext = createContext<DashboardAuthContextType | null>(null);

export function DashboardAuthProvider({ children }: { children: ReactNode }) {
  const { data: me, isLoading: meLoading } = useAuthMeQuery();
  const { mutateAsync: doLogin } = useLoginMutation();
  const queryClient = useQueryClient();

  const user = me ?? null;
  const isAuthenticated = !!user;
  const isLoading = meLoading;

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      await doLogin({ username, password, type: 'staff' });
      return true;
    } catch {
      return false;
    }
  }, [doLogin]);

  const logout = useCallback(() => {
    queryClient.clear();
    window.location.href = '/login';
  }, [queryClient]);

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
