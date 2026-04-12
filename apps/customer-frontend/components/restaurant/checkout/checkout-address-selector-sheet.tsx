"use client";

import { Loader2, MapPin, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/shared/empty-state';
import { useGeolocation, type GeolocationCoordinates } from '../use-geolocation';
import type { SavedAddress } from '../use-address-book';
import { CheckoutAddAddressForm } from './checkout-add-address-form';
import { CheckoutAddressSelectorItem } from './checkout-address-selector-item';
import { CheckoutMapAddressPicker } from './checkout-map-address-picker';

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
  const [mode, setMode] = useState<'list' | 'map' | 'add'>('list');
  const [mapSelection, setMapSelection] = useState<{ type: 'pinned' } | { type: 'saved'; id: string }>({ type: 'pinned' });
  const [currentLocationAddress, setCurrentLocationAddress] = useState<string | null>(null);
  const [currentLocationCoords, setCurrentLocationCoords] = useState<GeolocationCoordinates | null>(null);
  const { getCurrentLocation, isLocating, error } = useGeolocation();

  useEffect(() => {
    if (open) {
      return;
    }

    setMode('list');
    setMapSelection({ type: 'pinned' });
    setCurrentLocationAddress(null);
    setCurrentLocationCoords(null);
  }, [open]);

  if (!open) {
    return null;
  }

  const getFallbackPinnedAddress = () => {
    const selectedAddress =
      addresses.find((address) => address.id === selectedAddressId) ??
      addresses[0];

    return selectedAddress?.address ?? 'Pinned delivery location';
  };

  const openMapMode = ({
    address,
    coords,
  }: {
    address: string;
    coords: GeolocationCoordinates | null;
  }) => {
    setCurrentLocationAddress(address);
    setCurrentLocationCoords(coords);
    setMapSelection({ type: 'pinned' });
    setMode('map');
  };

  const handleUseCurrentLocation = async () => {
    const result = await getCurrentLocation();
    const resolvedAddress = result.address;

    if (resolvedAddress) {
      openMapMode({
        address: resolvedAddress,
        coords: result.coords,
      });
      return;
    }

    if (error) {
      alert(error);
    }

    openMapMode({
      address: getFallbackPinnedAddress(),
      coords: null,
    });
  };

  const handleOpenMapChooser = () => {
    openMapMode({
      address: currentLocationAddress ?? getFallbackPinnedAddress(),
      coords: currentLocationCoords ?? null,
    });
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
            {mode === 'add' ? (
              <CheckoutAddAddressForm
                initialAddress={currentLocationAddress ?? undefined}
                onSave={(address) => {
                  onAddAddress(address);
                  setMode('list');
                  setCurrentLocationAddress(null);
                  setCurrentLocationCoords(null);
                  onClose();
                }}
                onCancel={() => {
                  setMode(currentLocationAddress ? 'map' : 'list');
                }}
              />
            ) : mode === 'map' && currentLocationAddress ? (
              <CheckoutMapAddressPicker
                pinnedAddress={currentLocationAddress}
                pinnedCoords={currentLocationCoords}
                addresses={addresses}
                selection={mapSelection}
                isLocating={isLocating}
                onLocateMe={handleUseCurrentLocation}
                onSelectPinned={() => setMapSelection({ type: 'pinned' })}
                onSelectSaved={(id) => setMapSelection({ type: 'saved', id })}
                onUsePinnedForOrder={() => {
                  onUseCurrentLocation(currentLocationAddress);
                  onClose();
                }}
                onPinnedLocationChange={(address, coords) => {
                  setCurrentLocationAddress(address);
                  setCurrentLocationCoords(coords);
                  setMapSelection({ type: 'pinned' });
                }}
                onPrimaryAction={() => {
                  if (mapSelection.type === 'saved') {
                    const selectedAddress = addresses.find(
                      (address) => address.id === mapSelection.id,
                    );

                    if (selectedAddress) {
                      onSelectAddress(selectedAddress);
                      onClose();
                    }

                    return;
                  }

                  setMode('add');
                }}
                primaryActionLabel={
                  mapSelection.type === 'saved'
                    ? 'Deliver to selected address'
                    : 'Add address details'
                }
              />
            ) : addresses.length === 0 ? (
              <EmptyState
                title="No saved addresses yet"
                description="Add an address in your profile to use it quickly at checkout."
                className="rounded-[24px] p-6"
                action={
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--brand)/0.3)] bg-white px-4 py-2.5 text-sm font-semibold text-[rgb(var(--brand))]"
                    >
                      <MapPin className="h-4 w-4" />
                      Choose location on map
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('add')}
                      className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--brand))] px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      <Plus className="h-4 w-4" />
                      Add delivery address
                    </button>
                  </div>
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

                  <button
                    type="button"
                    onClick={handleOpenMapChooser}
                    className="ml-2 mt-3 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--brand)/0.3)] bg-white px-3 py-2 text-[12px] font-semibold text-[rgb(var(--brand))] transition-colors hover:bg-[rgb(var(--brand-soft)/0.2)]"
                  >
                    <MapPin className="h-4 w-4" />
                    Choose location on map
                  </button>

                  <p className="mt-2 text-[12px] font-medium text-[rgb(var(--muted))]">
                    If location is different from your saved addresses, we will open map choose mode.
                  </p>
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
                    onClick={() => {
                      setCurrentLocationAddress(null);
                      setCurrentLocationCoords(null);
                      setMode('add');
                    }}
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
