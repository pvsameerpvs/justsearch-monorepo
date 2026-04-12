"use client";

import { Loader2, MapPin, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/shared/empty-state';
import { useGeolocation } from '../use-geolocation';
import type { SavedAddress } from '../use-address-book';
import { CheckoutAddAddressForm } from './checkout-add-address-form';
import { CheckoutAddressSelectorItem } from './checkout-address-selector-item';

type CheckoutAddressSelectorSheetProps = {
  open: boolean;
  addresses: SavedAddress[];
  selectedAddressId?: string;
  onClose: () => void;
  onSelectAddress: (address: SavedAddress) => void;
  onAddAddress: (address: Omit<SavedAddress, 'id'>) => void;
  onUseCurrentLocation: (address: string) => void;
};

export function CheckoutAddressSelectorSheet({
  open,
  addresses,
  selectedAddressId,
  onClose,
  onSelectAddress,
  onAddAddress,
  onUseCurrentLocation,
}: CheckoutAddressSelectorSheetProps) {
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [currentLocationAddress, setCurrentLocationAddress] = useState<string | null>(null);
  const { getCurrentAddress, isLocating, error } = useGeolocation();

  useEffect(() => {
    if (open) {
      return;
    }

    setIsAddingAddress(false);
    setCurrentLocationAddress(null);
  }, [open]);

  if (!open) {
    return null;
  }

  const normalizeAddress = (value: string) =>
    value
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/,/g, '')
      .trim();

  const handleUseCurrentLocation = async () => {
    const resolvedAddress = await getCurrentAddress();

    if (resolvedAddress) {
      const matchingSavedAddress = addresses.find(
        (address) =>
          normalizeAddress(address.address) === normalizeAddress(resolvedAddress),
      );

      if (matchingSavedAddress) {
        onSelectAddress(matchingSavedAddress);
        onClose();
        return;
      }

      setCurrentLocationAddress(resolvedAddress);
      return;
    }

    if (error) {
      alert(error);
    }
  };

  return (
    <div className="fixed inset-0 z-[10002] bg-black/40 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close address selector"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
      />

      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-3xl">
        <div className="relative rounded-t-[28px] bg-white shadow-[0_-18px_56px_rgba(15,23,42,0.18)]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute left-4 top-0 -translate-y-[calc(100%+12px)] inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[rgb(var(--ink))] shadow-[0_8px_24px_rgba(15,23,42,0.18)]"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="px-5 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] pt-5 sm:px-6">
            {isAddingAddress ? (
              <CheckoutAddAddressForm
                initialAddress={currentLocationAddress ?? undefined}
                onSave={(address) => {
                  onAddAddress(address);
                  setIsAddingAddress(false);
                  setCurrentLocationAddress(null);
                  onClose();
                }}
                onCancel={() => {
                  setIsAddingAddress(false);
                  setCurrentLocationAddress(null);
                }}
              />
            ) : addresses.length === 0 ? (
              <EmptyState
                title="No saved addresses yet"
                description="Add an address in your profile to use it quickly at checkout."
                className="rounded-[24px] p-6"
                action={
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--brand))] px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add delivery address
                  </button>
                }
              />
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                    Select delivery address
                  </p>
                  <p className="mt-1 text-sm text-[rgb(var(--muted))]">
                    Use one of the saved addresses from your profile.
                  </p>

                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={isLocating}
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-[rgb(var(--brand-soft)/0.34)] px-3 py-2 text-[12px] font-semibold text-[rgb(var(--brand))] transition-colors hover:bg-[rgb(var(--brand-soft)/0.5)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLocating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                    {isLocating ? 'Locating...' : 'Use current location'}
                  </button>

                  {currentLocationAddress ? (
                    <div className="mt-3 rounded-[20px] border border-[rgb(var(--brand)/0.24)] bg-[rgb(var(--brand-soft)/0.28)] p-3.5">
                      <p className="text-sm font-semibold text-[rgb(var(--brand))]">
                        Current location detected
                      </p>
                      <p className="mt-1 text-[13px] leading-5 text-[rgb(var(--muted))]">
                        {currentLocationAddress}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onUseCurrentLocation(currentLocationAddress);
                            onClose();
                          }}
                          className="flex-1 rounded-full border border-[rgb(var(--brand)/0.3)] bg-white px-3 py-2 text-[12px] font-semibold text-[rgb(var(--brand))]"
                        >
                          Use for this order
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingAddress(true)}
                          className="flex-1 rounded-full bg-[rgb(var(--brand))] px-3 py-2 text-[12px] font-semibold text-white"
                        >
                          Save as address
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="max-h-[52vh] space-y-3 overflow-y-auto pb-4">
                  {addresses.map((address) => (
                    <CheckoutAddressSelectorItem
                      key={address.id}
                      address={address}
                      isSelected={address.id === selectedAddressId}
                      onSelect={(selected) => {
                        onSelectAddress(selected);
                        onClose();
                      }}
                    />
                  ))}
                </div>

                <div className="border-t border-[rgb(var(--border)/0.7)] pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(true)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[rgb(var(--brand))] px-5 py-4 text-base font-semibold text-white shadow-[0_10px_24px_rgba(15,118,110,0.22)] transition-transform active:scale-[0.99]"
                  >
                    <Plus className="h-4 w-4" />
                    Add delivery address
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
