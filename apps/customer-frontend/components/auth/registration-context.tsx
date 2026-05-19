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
import { readStoredUser, writeStoredUser, saveFreshRegistration } from './registration-storage';

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

  useEffect(() => { setUserState(readStoredUser()); }, []);
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'justsearch:registeredUser') return;
      setUserState(readStoredUser());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
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
