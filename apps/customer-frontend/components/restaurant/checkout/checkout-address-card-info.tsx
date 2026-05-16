import { Phone } from 'lucide-react';

interface CheckoutAddressCardInfoProps {
  addressTitle: string;
  address?: string;
  addressDetails?: string;
  alternateNumber?: string;
}

export function CheckoutAddressCardInfo({
  addressTitle,
  address,
  addressDetails,
  alternateNumber,
}: CheckoutAddressCardInfoProps) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
        Select delivery address
      </p>
      <p className="mt-1 text-sm font-semibold text-[rgb(var(--ink))]">
        {addressTitle}
      </p>
      <p className="mt-1 text-sm leading-5 text-[rgb(var(--muted))]">
        {address || 'Choose a saved address from your profile'}
      </p>
      {addressDetails ? (
        <p className="mt-2 text-[12px] text-[rgb(var(--muted))]">
          {addressDetails}
        </p>
      ) : null}
      {alternateNumber ? (
        <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-medium text-[rgb(var(--muted))]">
          <Phone className="h-3.5 w-3.5" />
          {alternateNumber}
        </p>
      ) : null}
    </div>
  );
}
