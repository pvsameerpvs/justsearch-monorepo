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

  // Re-verify on window focus in background — never clear state on failure
  useEffect(() => {
    function onFocus() {
      apiClient<AdminUser>('/auth/me')
        .then((me) => {
          if (me.role === 'super_admin') {
            const next = { isAuthenticated: true, user: me, isLoading: false };
            setState(next);
            writeStorage(true, me);
          }
        })
        .catch(() => {
          // intentionally ignore: never auto-logout
        });
    }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await apiClient<{ token: string; user: AdminUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password, type: 'super_admin' }),
      });
      if (res.user.role === 'super_admin') {
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
    setState({ isAuthenticated: false, user: null, isLoading: false });
    window.location.href = '/login';
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
