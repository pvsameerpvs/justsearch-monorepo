"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { apiClient } from "./api-client";
import type { AuthState, AuthContextType } from "./driver-auth.types";

const STORAGE_KEY = 'driver-auth-v1';

function readStorage(): Partial<AuthState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStorage(state: AuthState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      isLoggedIn: state.isLoggedIn,
      driverId: state.driverId,
      restaurantSlug: state.restaurantSlug,
      driverName: state.driverName,
    }));
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

const AuthContext = createContext<AuthContextType | null>(null);

export function DriverAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: false,
    driverId: null,
    restaurantSlug: null,
    driverName: null,
    hydrated: false,
  });

  useEffect(() => {
    const saved = readStorage();
    if (saved) {
      setState((prev) => ({
        ...prev,
        isLoggedIn: saved.isLoggedIn ?? false,
        driverId: saved.driverId ?? null,
        restaurantSlug: saved.restaurantSlug ?? null,
        driverName: saved.driverName ?? null,
      }));
    }

    async function checkAuth() {
      try {
        const me = await apiClient<{ id: string; name: string; restaurantId: string }>('/auth/me');
        const next: AuthState = {
          isLoggedIn: true,
          driverId: me.id,
          restaurantSlug: me.restaurantId,
          driverName: me.name,
          hydrated: true,
        };
        setState(next);
        writeStorage(next);
      } catch {
        // Never auto-logout: if /auth/me fails, keep existing state from localStorage
        setState((prev) => ({ ...prev, hydrated: true }));
      }
    }
    checkAuth();
  }, []);

  // Re-verify on window focus in background — never clear state on failure
  useEffect(() => {
    function onFocus() {
      apiClient<{ id: string; name: string; restaurantId: string }>('/auth/me')
        .then((me) => {
          const next: AuthState = {
            isLoggedIn: true,
            driverId: me.id,
            restaurantSlug: me.restaurantId,
            driverName: me.name,
            hydrated: true,
          };
          setState(next);
          writeStorage(next);
        })
        .catch(() => {
          // intentionally ignore: never auto-logout
        });
    }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await apiClient<{ token: string; user: { id: string; name: string; restaurantId: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password, type: 'delivery' }),
      });
      const next: AuthState = {
        isLoggedIn: true,
        driverId: res.user.id,
        restaurantSlug: res.user.restaurantId,
        driverName: res.user.name,
        hydrated: true,
      };
      setState(next);
      writeStorage(next);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid username or password';
      return { success: false, error: message };
    }
  };

  const logout = useCallback(() => {
    clearStorage();
    // Attempt to clear auth cookie client-side (works for non-HttpOnly; backend logout needed for HttpOnly)
    document.cookie = 'token=; path=/; max-age=0; domain=' + window.location.hostname;
    setState({
      isLoggedIn: false,
      driverId: null,
      restaurantSlug: null,
      driverName: null,
      hydrated: true,
    });
    window.location.href = '/login';
  }, []);

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
