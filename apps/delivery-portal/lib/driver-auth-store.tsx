"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { apiClient } from "./api-client";
import { readStorage, writeStorage, clearStorage, type AuthState, type AuthContextType } from "./driver-auth.utils";

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
        const next: AuthState = { isLoggedIn: true, driverId: me.id, restaurantSlug: me.restaurantId, driverName: me.name, hydrated: true };
        setState(next);
        writeStorage(next);
      } catch {
        setState((prev) => ({ ...prev, hydrated: true }));
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    function onFocus() {
      apiClient<{ id: string; name: string; restaurantId: string }>('/auth/me')
        .then((me) => {
          const next: AuthState = { isLoggedIn: true, driverId: me.id, restaurantSlug: me.restaurantId, driverName: me.name, hydrated: true };
          setState(next);
          writeStorage(next);
        })
        .catch(() => {});
    }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  useEffect(() => {
    function onSessionInvalidated() {
      clearStorage();
      setState({ isLoggedIn: false, driverId: null, restaurantSlug: null, driverName: null, hydrated: true });
      window.location.href = '/login';
    }
    window.addEventListener('auth:session-invalidated', onSessionInvalidated);
    return () => window.removeEventListener('auth:session-invalidated', onSessionInvalidated);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await apiClient<{ token: string; accessToken?: string; refreshToken?: string; user: { id: string; name: string; restaurantId: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password, type: 'delivery' }),
      });
      const access = res.accessToken ?? res.token;
      if (access && res.refreshToken) {
        window.localStorage.setItem('justsearch:accessToken', access);
        window.localStorage.setItem('justsearch:refreshToken', res.refreshToken);
        window.sessionStorage.setItem('justsearch:accessToken', access);
        window.sessionStorage.setItem('justsearch:refreshToken', res.refreshToken);
      }
      const next: AuthState = { isLoggedIn: true, driverId: res.user.id, restaurantSlug: res.user.restaurantId, driverName: res.user.name, hydrated: true };
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
    document.cookie = 'token=; path=/; max-age=0; domain=' + window.location.hostname;
    window.localStorage.removeItem('justsearch:accessToken');
    window.localStorage.removeItem('justsearch:refreshToken');
    window.sessionStorage.removeItem('justsearch:accessToken');
    window.sessionStorage.removeItem('justsearch:refreshToken');
    setState({ isLoggedIn: false, driverId: null, restaurantSlug: null, driverName: null, hydrated: true });
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
