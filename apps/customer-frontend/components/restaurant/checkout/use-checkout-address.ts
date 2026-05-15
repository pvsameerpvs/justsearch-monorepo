"use client";

import { useState, useEffect } from 'react';
import { type SavedAddress, useAddressBook } from '../use-address-book';

export function useCheckoutAddress() {
  const { addresses, addAddress, hydrated: addressesHydrated } = useAddressBook();

  const [addressTitle, setAddressTitle] = useState('Home');
  const [address, setAddress] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddressBookOpen, setIsAddressBookOpen] = useState(false);

  const applySavedAddress = (savedAddress: SavedAddress) => {
    setSelectedAddressId(savedAddress.id);
    setAddressTitle(savedAddress.label);
    setAddress(savedAddress.address);
    setAddressDetails(savedAddress.details);
    setAlternateNumber(savedAddress.alternateNumber || '');
  };

  const applyCurrentLocationAddress = (resolvedAddress: string) => {
    setSelectedAddressId(null);
    setAddressTitle('Current location');
    setAddress(resolvedAddress);
    setAddressDetails('');
    setAlternateNumber('');
  };

  useEffect(() => {
    if (!addressesHydrated || addresses.length === 0) return;
    const selectedAddress = addresses.find((item) => item.id === selectedAddressId);
    if (selectedAddress) return;
    if (!address || !selectedAddressId) {
      applySavedAddress(addresses[0]);
    }
  }, [address, addresses, addressesHydrated, selectedAddressId]);

  return {
    addressTitle,
    address,
    addressDetails,
    alternateNumber,
    setAlternateNumber,
    selectedAddressId,
    isAddressBookOpen,
    setIsAddressBookOpen,
    addresses,
    addAddress,
    applySavedAddress,
    applyCurrentLocationAddress,
  };
}
