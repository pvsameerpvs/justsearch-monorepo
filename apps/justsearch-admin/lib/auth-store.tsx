"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { apiClient } from "./api-client";

interface AdminUser {
  id: string;
  name: string;
  role: string;
  type: string;
}

interface AdminAuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  isLoading: boolean;
}

interface AdminAuthContextType extends AdminAuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const STORAGE_KEY = 'admin-auth-v1';

function readStorage(): { isAuthenticated: boolean; user: AdminUser | null } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStorage(isAuthenticated: boolean, user: AdminUser | null) {
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

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminAuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const saved = readStorage();
    if (saved) {
      setState((prev) => ({ ...prev, isAuthenticated: saved.isAuthenticated, user: saved.user }));
    }

    // Skip auth verification on public routes (login page doesn't need it)
    if (typeof window !== 'undefined' && window.location.pathname === '/login') {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    let cancelled = false;
    async function checkAuth() {
      try {
        const me = await apiClient<AdminUser>('/auth/me');
        if (!cancelled) {
          if (me.role === 'super_admin') {
            const next = { isAuthenticated: true, user: me, isLoading: false };
            setState(next);
            writeStorage(true, me);
          } else {
            // Wrong role: keep existing persisted state, do not auto-logout
            setState((prev) => ({ ...prev, isLoading: false }));
          }
        }
      } catch {
        if (!cancelled) {
          // Never auto-logout: if /auth/me fails, keep existing state from localStorage
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      }
    }
    checkAuth();
    return () => { cancelled = true; };
  }, []);

  // Re-verify on window focus in background (skip on login page)
  useEffect(() => {
    function onFocus() {
      if (typeof window !== 'undefined' && window.location.pathname === '/login') return;
      apiClient<AdminUser>('/auth/me')
        .then((me) => {
          if (me.role === 'super_admin') {
            const next = { isAuthenticated: true, user: me, isLoading: false };
            setState(next);
            writeStorage(true, me);
          }
        })
        .catch(() => {
          // apiClient handles 401 internally (silent refresh); if it reaches here, refresh failed
          // The auth:session-invalidated listener below will handle logout
        });
    }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Listen for global session-invalidated event
  useEffect(() => {
    function onSessionInvalidated() {
      clearStorage();
      setState({ isAuthenticated: false, user: null, isLoading: false });
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    window.addEventListener('auth:session-invalidated', onSessionInvalidated);
    return () => window.removeEventListener('auth:session-invalidated', onSessionInvalidated);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await apiClient<{ token: string; accessToken?: string; refreshToken?: string; user: AdminUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password, type: 'super_admin' }),
      });
      if (res.user.role === 'super_admin') {
        const access = res.accessToken ?? res.token;
        if (access && res.refreshToken) {
          window.localStorage.setItem('justsearch:accessToken', access);
          window.localStorage.setItem('justsearch:refreshToken', res.refreshToken);
          window.sessionStorage.setItem('justsearch:accessToken', access);
          window.sessionStorage.setItem('justsearch:refreshToken', res.refreshToken);
        }
        const next = { isAuthenticated: true, user: res.user, isLoading: false };
        setState(next);
        writeStorage(true, res.user);
        return { success: true };
      }
      return { success: false, error: 'Not authorized as super admin' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Login failed' };
    }
  }, []);

  const logout = useCallback(() => {
    clearStorage();
    document.cookie = 'token=; path=/; max-age=0; domain=' + window.location.hostname;
    window.localStorage.removeItem('justsearch:accessToken');
    window.localStorage.removeItem('justsearch:refreshToken');
    window.sessionStorage.removeItem('justsearch:accessToken');
    window.sessionStorage.removeItem('justsearch:refreshToken');
    setState({ isAuthenticated: false, user: null, isLoading: false });
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <AdminAuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
