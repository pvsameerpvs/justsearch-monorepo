"use client";

import { CheckoutAddressCardContent } from './checkout-address-card-content';

export type CheckoutAddressCardProps = {
  addressTitle: string;
  address: string;
  addressDetails: string;
  userPhone?: string;
  alternateNumber?: string;
  savedAddressesCount?: number;
  note: string;
  setAlternateNumber?: (val: string) => void;
  setNote: (val: string) => void;
  onOpenAddressBook?: () => void;
  paymentMethod: 'cash' | 'card';
  setPaymentMethod: (value: 'cash' | 'card') => void;
};

export function CheckoutAddressCard(props: CheckoutAddressCardProps) {
  return (
    <div className="rounded-[32px] border border-[rgb(var(--border)/0.6)] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <CheckoutAddressCardContent {...props} />
    </div>
  );
}
