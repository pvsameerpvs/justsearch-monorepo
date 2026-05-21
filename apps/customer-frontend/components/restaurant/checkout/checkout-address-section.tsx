"use client";

import { CheckoutAddressCardBadge } from './checkout-address-card-badge';
import { CheckoutAddressCardInfo } from './checkout-address-card-info';
import { CheckoutAddressCardActions } from './checkout-address-card-actions';
import { CheckoutLocationSourceBadge } from './checkout-location-source-badge';
import { CheckoutDeliveryFeeStatus } from './checkout-delivery-fee-status';
import { CheckoutAddressEmptyState } from './checkout-address-empty-state';

interface CheckoutAddressSectionProps {
  addressTitle: string;
  address: string;
  addressDetails: string;
  alternateNumber?: string;
  savedAddressesCount?: number;
  locationSource?: 'saved' | 'gps' | 'pinned' | 'none';
  addressSaveWarn?: string | null;
  deliveryAvailable?: boolean;
  deliveryReason?: string;
  deliveryFee?: number;
  deliveryDistanceKm?: number;
  deliveryEmirate?: string;
  currency?: string;
  isDeliveryEnabled?: boolean;
  quoteLoading?: boolean;
  onOpenAddressBook?: () => void;
}

export function CheckoutAddressSection({
  addressTitle, address, addressDetails, alternateNumber, savedAddressesCount = 0,
  locationSource, addressSaveWarn,
  deliveryAvailable, deliveryReason, deliveryFee, deliveryDistanceKm, deliveryEmirate, currency = 'AED',
  isDeliveryEnabled, quoteLoading, onOpenAddressBook,
}: CheckoutAddressSectionProps) {
  return (
    <div className="border-b border-[rgb(var(--border)/0.4)] px-6 py-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Delivery Address</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--muted))]">Tap to choose or add a delivery address</p>
        </div>
        <CheckoutAddressCardBadge count={savedAddressesCount} />
      </div>

      <CheckoutAddressCardActions onOpenAddressBook={onOpenAddressBook}>
        <div className="w-full">
          {address ? (
            <>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-bold text-[rgb(var(--ink))]">{addressTitle}</span>
                <CheckoutLocationSourceBadge source={locationSource} />
              </div>
              <CheckoutAddressCardInfo addressTitle={addressTitle} address={address} addressDetails={addressDetails} alternateNumber={alternateNumber} />
            </>
          ) : (
            <CheckoutAddressEmptyState />
          )}
        </div>
      </CheckoutAddressCardActions>

      {addressSaveWarn && (
        <p className="mt-3 text-xs font-bold text-amber-500">{addressSaveWarn}</p>
      )}

      <div className="mt-3">
        <CheckoutDeliveryFeeStatus
          address={address}
          isDeliveryEnabled={isDeliveryEnabled}
          quoteLoading={quoteLoading}
          deliveryAvailable={deliveryAvailable}
          deliveryFee={deliveryFee}
          deliveryDistanceKm={deliveryDistanceKm}
          deliveryEmirate={deliveryEmirate}
          deliveryReason={deliveryReason}
          currency={currency}
        />
      </div>
    </div>
  );
}
