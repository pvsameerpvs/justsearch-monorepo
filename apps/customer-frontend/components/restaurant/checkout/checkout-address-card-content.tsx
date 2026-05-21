"use client";

import type { CheckoutAddressCardProps } from './checkout-address-card';
import { CheckoutPaymentMethod } from './checkout-payment-method';
import { CheckoutAddressSection } from './checkout-address-section';
import { CheckoutContactSection } from './checkout-contact-section';
import { CheckoutPromiseSection } from './checkout-promise-section';

export function CheckoutAddressCardContent({
  addressTitle, address, addressDetails, userPhone, alternateNumber, savedAddressesCount = 0,
  note, setAlternateNumber, setNote, onOpenAddressBook,
  paymentMethod, setPaymentMethod, addressSaveWarn,
  deliveryAvailable, deliveryReason, deliveryFee, deliveryDistanceKm, deliveryEmirate, currency = 'AED',
  isDeliveryEnabled, locationSource, quoteLoading,
}: CheckoutAddressCardProps) {
  return (
    <>
      <CheckoutAddressSection
        addressTitle={addressTitle}
        address={address}
        addressDetails={addressDetails}
        alternateNumber={alternateNumber}
        savedAddressesCount={savedAddressesCount}
        locationSource={locationSource}
        addressSaveWarn={addressSaveWarn}
        deliveryAvailable={deliveryAvailable}
        deliveryReason={deliveryReason}
        deliveryFee={deliveryFee}
        deliveryDistanceKm={deliveryDistanceKm}
        deliveryEmirate={deliveryEmirate}
        currency={currency}
        isDeliveryEnabled={isDeliveryEnabled}
        quoteLoading={quoteLoading}
        onOpenAddressBook={onOpenAddressBook}
      />
      <CheckoutContactSection
        userPhone={userPhone}
        alternateNumber={alternateNumber}
        onAlternateChange={setAlternateNumber}
      />
      <div className="border-b border-[rgb(var(--border)/0.4)] px-6 py-6">
        <CheckoutPaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
      </div>
      <div className="border-b border-[rgb(var(--border)/0.4)] px-6 py-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Note for the rider</p>
        <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/30 px-4 py-4">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Gate code, building entry, etc." className="w-full bg-transparent text-[13px] font-medium text-[rgb(var(--ink))] outline-none placeholder:text-slate-400" />
        </div>
      </div>
      <CheckoutPromiseSection />
    </>
  );
}
