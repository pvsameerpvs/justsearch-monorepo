"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useQueryClient } from '@tanstack/react-query';
import { useAuthMeQuery, useLoginMutation } from "./hooks/use-auth-query";

interface DashboardAuthContextType {
  isAuthenticated: boolean;
  user: { id: string; name: string; role: string; type: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const STORAGE_KEY = 'staff-auth-v1';

function readStorage(): { isAuthenticated: boolean; user: DashboardAuthContextType['user'] } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStorage(isAuthenticated: boolean, user: DashboardAuthContextType['user']) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAuthenticated, user }));
  } catch {
    // ignore
  }
}

function clearStorage() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

const DashboardAuthContext = createContext<DashboardAuthContextType | null>(null);

export function DashboardAuthProvider({ children }: { children: ReactNode }) {
  const [persistedAuth, setPersistedAuth] = useState(false);
  const [persistedUser, setPersistedUser] = useState<DashboardAuthContextType['user']>(null);

  useEffect(() => {
    const saved = readStorage();
    if (saved) {
      setPersistedAuth(saved.isAuthenticated);
      setPersistedUser(saved.user);
    }
  }, []);

  const { data: me, isLoading: meLoading } = useAuthMeQuery();
  const { mutateAsync: doLogin } = useLoginMutation();
  const queryClient = useQueryClient();

  // Trust persisted auth as baseline; React Query me data updates details in background
  const user = me && me.type === 'staff' ? me : (persistedUser ?? null);
  const isAuthenticated = persistedAuth || (!!me && me.type === 'staff');
  const isLoading = meLoading && !persistedAuth;

  // Sync React Query success to persisted storage
  useEffect(() => {
    if (me && me.type === 'staff') {
      setPersistedAuth(true);
      setPersistedUser(me);
      writeStorage(true, me);
    }
  }, [me]);

  // Re-verify on window focus in background — never clear persisted auth on failure
  useEffect(() => {
    function onFocus() {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [queryClient]);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      await doLogin({ username, password, type: 'staff' });
      return true;
    } catch {
      return false;
    }
  }, [doLogin]);

  const logout = useCallback(() => {
    clearStorage();
    // Attempt to clear auth cookie client-side (works for non-HttpOnly; backend logout needed for HttpOnly)
    document.cookie = 'token=; path=/; max-age=0; domain=' + window.location.hostname;
    setPersistedAuth(false);
    setPersistedUser(null);
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
