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
import { readStoredUser, writeStoredUser, saveFreshRegistration, syncTokenCookie } from './registration-storage';

type RegistrationContextValue = {
  user: RegisteredUser | null;
  token: string | null;
  isRegistered: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setUser: (nextUser: RegisteredUser) => void;
  clearUser: () => void;
};

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<RegisteredUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Hydrate from localStorage on mount and sync cookie
  useEffect(() => {
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

  // AGGRESSIVE SAFEGUARD: Re-read storage on window focus.
  // Some mobile browsers silently clear localStorage when backgrounding.
  // This ensures auth is restored the moment the user returns to the tab.
  useEffect(() => {
    const onFocus = () => {
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

  // AGGRESSIVE SAFEGUARD: Poll storage every 5s to detect silent clears.
  // If storage still has user but React state lost it, restore immediately.
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = readStoredUser();
      if (stored) {
        setUserState((prev) => {
          if (prev) return prev;
          // State was silently lost — restore from storage
          if (!document.cookie.includes('token=')) {
            syncTokenCookie(stored.token);
          }
          return stored;
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const setUser = useCallback((nextUser: RegisteredUser) => {
    setUserState(nextUser);
    writeStoredUser(nextUser);
    saveFreshRegistration(nextUser);
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
