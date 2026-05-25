"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { RegisteredUser } from './registered-user';
import {
  readStoredUser,
  writeStoredUser,
  writeStoredAuth,
  saveFreshRegistration,
  syncTokenCookie,
  clearSessionInvalidated,
} from './registration-storage';
import { ensureFreshToken, invalidateAuthSession } from '@/lib/auth/auth-client';
import { isTokenExpired, readAccessToken } from '@/lib/auth/token-utils';

type RegistrationContextValue = {
  user: RegisteredUser | null;
  token: string | null;
  isRegistered: boolean;
  isModalOpen: boolean;
  sessionExpiredReason: string | null;
  openModal: () => void;
  closeModal: () => void;
  setUser: (nextUser: RegisteredUser, accessToken?: string, refreshToken?: string) => void;
  clearUser: () => void;
  setPendingAction: (action: (() => void) | null) => void;
};

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

const PROACTIVE_REFRESH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
const FOCUS_REFRESH_BUFFER_MINUTES = 30;

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<RegisteredUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionExpiredReason, setSessionExpiredReason] = useState<string | null>(null);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const hasHydrated = useRef(false);

  // Hydrate from localStorage on mount and sync cookie
  useEffect(() => {
    if (hasHydrated.current) return;
    hasHydrated.current = true;

    const stored = readStoredUser();
    if (stored) {
      setUserState(stored);
      if (typeof window !== 'undefined' && !document.cookie.includes('token=')) {
        syncTokenCookie(stored.token);
      }
    }
  }, []);

  // Listen for storage changes (multi-tab sync)
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'justsearch:registeredUser') return;
      setUserState(readStoredUser());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Listen for global 401 / session-invalidated event
  useEffect(() => {
    const onInvalidated = () => {
      setUserState(null);
      setSessionExpiredReason('Your session expired. Please log in again.');
      setIsModalOpen(true);
    };
    window.addEventListener('auth:session-invalidated', onInvalidated);
    return () => window.removeEventListener('auth:session-invalidated', onInvalidated);
  }, []);

  // Proactive silent refresh: every 15 minutes, and on window focus if near expiry
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tryRefresh = async (reason: string) => {
      const token = readAccessToken();
      if (!token) return;
      if (isTokenExpired(token, FOCUS_REFRESH_BUFFER_MINUTES * 60)) {
        const ok = await ensureFreshToken(FOCUS_REFRESH_BUFFER_MINUTES);
        if (!ok && reason === 'focus') {
          // Only invalidate on focus if token is truly dead (not just network glitch)
          const stillBad = readAccessToken() && isTokenExpired(readAccessToken()!, 0);
          if (stillBad) {
            invalidateAuthSession();
          }
        }
      }
    };

    const interval = setInterval(() => {
      tryRefresh('interval');
    }, PROACTIVE_REFRESH_INTERVAL_MS);

    const onFocus = () => {
      tryRefresh('focus');
    };
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const setUser = useCallback((nextUser: RegisteredUser, accessToken?: string, refreshToken?: string) => {
    setUserState(nextUser);
    setSessionExpiredReason(null);
    if (accessToken && refreshToken) {
      writeStoredAuth(nextUser, accessToken, refreshToken);
    } else {
      writeStoredUser(nextUser);
    }
    saveFreshRegistration(nextUser);
    clearSessionInvalidated();

    // If there was a pending action (e.g. place order), run it after login
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      setTimeout(() => {
        action();
      }, 350);
    }
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
    writeStoredUser(null);
    pendingActionRef.current = null;
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSessionExpiredReason(null);
  }, []);

  const setPendingAction = useCallback((action: (() => void) | null) => {
    pendingActionRef.current = action;
  }, []);

  const token = user?.token ?? null;
  const value = useMemo<RegistrationContextValue>(
    () => ({
      user,
      token,
      isRegistered: Boolean(user),
      isModalOpen,
      sessionExpiredReason,
      openModal,
      closeModal,
      setUser,
      clearUser,
      setPendingAction,
    }),
    [user, token, isModalOpen, sessionExpiredReason, openModal, closeModal, setUser, clearUser, setPendingAction],
  );

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const value = useContext(RegistrationContext);
  if (!value) throw new Error('useRegistration must be used within RegistrationProvider');
  return value;
}
