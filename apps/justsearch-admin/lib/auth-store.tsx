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

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminAuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    let cancelled = false;
    async function checkAuth() {
      try {
        const me = await apiClient<AdminUser>('/auth/me');
        if (!cancelled) {
          if (me.role === 'super_admin') {
            setState({ isAuthenticated: true, user: me, isLoading: false });
          } else {
            setState({ isAuthenticated: false, user: null, isLoading: false });
          }
        }
      } catch {
        if (!cancelled) {
          setState({ isAuthenticated: false, user: null, isLoading: false });
        }
      }
    }
    checkAuth();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await apiClient<{ token: string; user: AdminUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password, type: 'super_admin' }),
      });
      if (res.user.role === 'super_admin') {
        setState({ isAuthenticated: true, user: res.user, isLoading: false });
        return { success: true };
      }
      return { success: false, error: 'Not authorized as super admin' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Login failed' };
    }
  }, []);

  const logout = useCallback(() => {
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
