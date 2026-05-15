"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiClient } from "./api-client";

interface AdminAuthState {
  isAuthenticated: boolean;
  user: { id: string; name: string; role: string } | null;
  isLoading: boolean;
}

interface AdminAuthContextType extends AdminAuthState {
  login: (username: string, password: string) => Promise<boolean>;
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
    async function checkAuth() {
      try {
        const me = await apiClient<{ id: string; name: string; role: string }>('/auth/me');
        if (me.role === 'super_admin') {
          setState({ isAuthenticated: true, user: me, isLoading: false });
        } else {
          setState({ isAuthenticated: false, user: null, isLoading: false });
        }
      } catch {
        setState({ isAuthenticated: false, user: null, isLoading: false });
      }
    }
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await apiClient<{ token: string; user: { id: string; name: string; role: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password, type: 'super_admin' }),
      });
      if (res.user.role === 'super_admin') {
        setState({ isAuthenticated: true, user: res.user, isLoading: false });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setState({ isAuthenticated: false, user: null, isLoading: false });
    window.location.href = '/login';
  };

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
