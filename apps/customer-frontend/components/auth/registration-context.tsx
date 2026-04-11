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

const STORAGE_KEY = 'justsearch:registeredUser';

type RegistrationContextValue = {
  user: RegisteredUser | null;
  isRegistered: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setUser: (nextUser: RegisteredUser) => void;
  clearUser: () => void;
};

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

function readStoredUser(): RegisteredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof (parsed as any).name !== 'string' ||
      typeof (parsed as any).mobile !== 'string' ||
      typeof (parsed as any).verifiedAt !== 'number'
    ) {
      return null;
    }
    return {
      name: (parsed as any).name,
      mobile: (parsed as any).mobile,
      verifiedAt: (parsed as any).verifiedAt,
    };
  } catch {
    return null;
  }
}

function writeStoredUser(user: RegisteredUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<RegisteredUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setUserState(readStoredUser());
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      setUserState(readStoredUser());
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setUser = useCallback((nextUser: RegisteredUser) => {
    setUserState(nextUser);
    writeStoredUser(nextUser);
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
    writeStoredUser(null);
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const value = useMemo<RegistrationContextValue>(
    () => ({
      user,
      isRegistered: Boolean(user),
      isModalOpen,
      openModal,
      closeModal,
      setUser,
      clearUser,
    }),
    [user, isModalOpen, openModal, closeModal, setUser, clearUser],
  );

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const value = useContext(RegistrationContext);
  if (!value) {
    throw new Error('useRegistration must be used within RegistrationProvider');
  }
  return value;
}

