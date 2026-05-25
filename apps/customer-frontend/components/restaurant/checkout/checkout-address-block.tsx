"use client";

import { CheckoutAddressCard } from './checkout-address-card';
import { CheckoutAddressSelectorContainer } from './checkout-address-selector-container';
import type { SavedAddress } from '../use-address-book';

interface CheckoutAddressBlockProps {
  state: {
    addressTitle: string;
    address: string;
    addressDetails: string;
    alternateNumber: string;
    setAlternateNumber: (v: string) => void;
    user?: { mobile?: string } | null;
    addresses: SavedAddress[];
    selectedAddressId: string | null;
    isAddressBookOpen: boolean;
    setIsAddressBookOpen: (v: boolean) => void;
    locationSource: 'saved' | 'gps' | 'pinned' | 'none';
    riderNote: string;
    setRiderNote: (v: string) => void;
    paymentMethod: 'cash' | 'card';
    setPaymentMethod: (v: 'cash' | 'card') => void;
    addressSaveWarn: string | null;
    deliveryAvailable: boolean;
    deliveryReason: string;
    deliveryFee: number;
    deliveryDistanceKm: number | undefined;
    deliveryEmirate: string | undefined;
    currency: string;
    isDeliveryEnabled: boolean;
    quoteLoading: boolean;
    addAddress: (address: Omit<SavedAddress, 'id'>) => Promise<SavedAddress>;
    editAddress: (id: string, updates: Omit<SavedAddress, 'id'>) => Promise<SavedAddress>;
    applySavedAddress: (addr: SavedAddress) => void;
    applyCurrentLocationAddress: (addr: string, lat?: number, lng?: number) => void;
    applyPinnedLocation: (addr: string, lat: number, lng: number) => void;
    coords: { setLatLng: (lat: number, lng: number) => void };
  };
}

export function CheckoutAddressBlock({ state }: CheckoutAddressBlockProps) {
  return (
    <>
      <CheckoutAddressCard
        addressTitle={state.addressTitle}
        address={state.address}
        addressDetails={state.addressDetails}
        userPhone={state.user?.mobile}
        alternateNumber={state.alternateNumber}
        savedAddressesCount={state.addresses.length}
        setAlternateNumber={state.setAlternateNumber}
        note={state.riderNote}
        setNote={state.setRiderNote}
        onOpenAddressBook={() => state.setIsAddressBookOpen(true)}
        paymentMethod={state.paymentMethod}
        setPaymentMethod={state.setPaymentMethod}
        addressSaveWarn={state.addressSaveWarn}
        deliveryAvailable={state.deliveryAvailable}
        deliveryReason={state.deliveryReason}
        deliveryFee={state.deliveryFee}
        deliveryDistanceKm={state.deliveryDistanceKm}
        deliveryEmirate={state.deliveryEmirate}
        currency={state.currency}
        isDeliveryEnabled={state.isDeliveryEnabled}
        locationSource={state.locationSource}
        quoteLoading={state.quoteLoading}
      />
      <CheckoutAddressSelectorContainer state={state} />
    </>
  );
}
