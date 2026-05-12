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
const FRESH_REGISTRATION_KEY = 'justsearch:freshRegistration';

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
      parsed === null ||
      typeof (parsed as Record<string, unknown>).name !== 'string' ||
      typeof (parsed as Record<string, unknown>).mobile !== 'string' ||
      typeof (parsed as Record<string, unknown>).verifiedAt !== 'number'
    ) {
      return null;
    }
    return {
      name: (parsed as Record<string, unknown>).name as string,
      mobile: (parsed as Record<string, unknown>).mobile as string,
      verifiedAt: (parsed as Record<string, unknown>).verifiedAt as number,
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

function writeFreshRegistration(user: RegisteredUser | null) {
  if (typeof window === 'undefined') return;

  try {
    if (!user) {
      window.sessionStorage.removeItem(FRESH_REGISTRATION_KEY);
      return;
    }

    window.sessionStorage.setItem(FRESH_REGISTRATION_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function readFreshRegistration() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.sessionStorage.getItem(FRESH_REGISTRATION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as unknown;
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      parsed === null ||
      typeof (parsed as Record<string, unknown>).name !== 'string' ||
      typeof (parsed as Record<string, unknown>).mobile !== 'string' ||
      typeof (parsed as Record<string, unknown>).verifiedAt !== 'number'
    ) {
      return null;
    }

    return {
      name: (parsed as Record<string, unknown>).name as string,
      mobile: (parsed as Record<string, unknown>).mobile as string,
      verifiedAt: (parsed as Record<string, unknown>).verifiedAt as number,
    } satisfies RegisteredUser;
  } catch {
    return null;
  }
}

export function clearFreshRegistration() {
  writeFreshRegistration(null);
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
    writeFreshRegistration(nextUser);
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
    writeStoredUser(null);
    writeFreshRegistration(null);
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
