"use client";

import { useState, useEffect } from 'react';

export type AddressLabel = 'Home' | 'Work' | 'Other';

export type SavedAddress = {
  id: string;
  label: AddressLabel;
  address: string;
  details: string;
  alternateNumber?: string;
};

const STORAGE_KEY = 'justsearch:user:addresses';

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: '1',
    label: 'Work',
    address: 'Dubai Damas tower, 28 Al Maktoum Road, Riggat Al Buteen, Dubai',
    details: '305 office number',
  },
  {
    id: '2',
    label: 'Home',
    address: 'Marina Bay Tower A, Floor 12, Unit 1204, Dubai Marina',
    details: 'Near the elevator',
  },
];

export function useAddressBook() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setAddresses(JSON.parse(raw));
      } catch {
        setAddresses(DEFAULT_ADDRESSES);
      }
    } else {
      setAddresses(DEFAULT_ADDRESSES);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses, hydrated]);

  const addAddress = (newAddr: Omit<SavedAddress, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setAddresses(curr => [...curr, { ...newAddr, id }]);
  };

  const removeAddress = (id: string) => {
    setAddresses(curr => curr.filter(a => a.id !== id));
  };

  return {
    addresses,
    addAddress,
    removeAddress,
    hydrated
  };
}
