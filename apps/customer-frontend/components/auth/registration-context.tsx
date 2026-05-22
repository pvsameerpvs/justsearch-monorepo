"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  isSessionInvalidated,
  clearSessionInvalidated,
} from './registration-storage';

type RegistrationContextValue = {
  user: RegisteredUser | null;
  token: string | null;
  isRegistered: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setUser: (nextUser: RegisteredUser, accessToken?: string, refreshToken?: string) => void;
  clearUser: () => void;
};

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<RegisteredUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hydrate from localStorage on mount and sync cookie
  useEffect(() => {
    if (isSessionInvalidated()) return; // don't restore dead session
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
      setIsModalOpen(true);
    };
    window.addEventListener('auth:session-invalidated', onInvalidated);
    return () => window.removeEventListener('auth:session-invalidated', onInvalidated);
  }, []);

  // Re-read storage on window focus — but skip if session was invalidated
  useEffect(() => {
    const onFocus = () => {
      if (isSessionInvalidated()) return;
      const stored = readStoredUser();
      if (stored) {
        setUserState((prev) => prev ?? stored);
        if (!document.cookie.includes('token=')) {
          syncTokenCookie(stored.token);
        }
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  // Poll storage every 5s — but skip if session was invalidated
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSessionInvalidated()) return;
      const stored = readStoredUser();
      if (stored) {
        setUserState((prev) => {
          if (prev) return prev;
          if (!document.cookie.includes('token=')) {
            syncTokenCookie(stored.token);
          }
          return stored;
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const setUser = useCallback((nextUser: RegisteredUser, accessToken?: string, refreshToken?: string) => {
    setUserState(nextUser);
    if (accessToken && refreshToken) {
      writeStoredAuth(nextUser, accessToken, refreshToken);
    } else {
      writeStoredUser(nextUser);
    }
    saveFreshRegistration(nextUser);
    clearSessionInvalidated();
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
    writeStoredUser(null);
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const token = user?.token ?? null;
  const value = useMemo<RegistrationContextValue>(
    () => ({ user, token, isRegistered: Boolean(user), isModalOpen, openModal, closeModal, setUser, clearUser }),
    [user, token, isModalOpen, openModal, closeModal, setUser, clearUser],
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
