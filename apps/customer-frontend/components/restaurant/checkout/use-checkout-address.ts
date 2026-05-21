"use client";

import { useState, useEffect } from 'react';
import { type SavedAddress, useAddressBook } from '../use-address-book';

export type LocationSource = 'saved' | 'gps' | 'pinned' | 'none';

export function useCheckoutAddress() {
  const { addresses, addAddress, editAddress, hydrated: addressesHydrated, isSaving } = useAddressBook();

  const [addressTitle, setAddressTitle] = useState('Home');
  const [address, setAddress] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [locationSource, setLocationSource] = useState<LocationSource>('none');
  const [isAddressBookOpen, setIsAddressBookOpen] = useState(false);

  const applySavedAddress = (savedAddress: SavedAddress) => {
    setSelectedAddressId(savedAddress.id);
    setAddressTitle(savedAddress.label);
    setAddress(savedAddress.address);
    setAddressDetails(savedAddress.details);
    setAlternateNumber(savedAddress.alternateNumber || '');
    setLocationSource('saved');
  };

  const applyCurrentLocationAddress = (resolvedAddress: string) => {
    setSelectedAddressId(null);
    setAddressTitle('Current Location');
    setAddress(resolvedAddress);
    setAddressDetails('');
    setAlternateNumber('');
    setLocationSource('gps');
  };

  const applyPinnedLocation = (resolvedAddress: string, _lat: number, _lng: number) => {
    setSelectedAddressId(null);
    setAddressTitle('Pinned Location');
    setAddress(resolvedAddress);
    setAddressDetails('');
    setAlternateNumber('');
    setLocationSource('pinned');
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
    editAddress,
    locationSource,
    applySavedAddress,
    applyCurrentLocationAddress,
    applyPinnedLocation,
    isSaving,
  };
}
