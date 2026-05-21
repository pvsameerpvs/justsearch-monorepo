"use client";

import { MapPin, AlertCircle } from 'lucide-react';
import { formatDeliveryFeeBadge } from '@/lib/delivery-fee-format';

interface CheckoutDeliveryFeeStatusProps {
  address: string;
  isDeliveryEnabled?: boolean;
  quoteLoading?: boolean;
  deliveryAvailable?: boolean;
  deliveryFee?: number;
  deliveryDistanceKm?: number;
  deliveryEmirate?: string;
  deliveryReason?: string;
  currency?: string;
}

export function CheckoutDeliveryFeeStatus({
  address,
  isDeliveryEnabled,
  quoteLoading,
  deliveryAvailable,
  deliveryFee,
  deliveryDistanceKm,
  deliveryEmirate,
  deliveryReason,
  currency,
}: CheckoutDeliveryFeeStatusProps) {
  if (!isDeliveryEnabled) return null;
  if (!address) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-400">
        <MapPin className="h-3.5 w-3.5 shrink-0" />
        <span>Select an address to see delivery fee</span>
      </div>
    );
  }
  if (quoteLoading) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500">
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-[rgb(var(--brand))]" />
        Calculating delivery fee…
      </div>
    );
  }
  if (deliveryAvailable != null) {
    const parts: string[] = [];
    if (deliveryAvailable) {
      parts.push(formatDeliveryFeeBadge(deliveryFee ?? 0, currency ?? 'AED'));
      if (deliveryDistanceKm) parts.push(`${deliveryDistanceKm.toFixed(1)} km`);
      if (deliveryEmirate) parts.push(deliveryEmirate);
    }
    return (
      <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${deliveryAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
        {deliveryAvailable ? <MapPin className="h-3.5 w-3.5 shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
        <span>{deliveryAvailable ? parts.join(' • ') : (deliveryReason || 'Delivery not available')}</span>
      </div>
    );
  }
  return null;
}
