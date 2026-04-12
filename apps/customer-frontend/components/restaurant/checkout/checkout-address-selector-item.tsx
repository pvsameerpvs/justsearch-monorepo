"use client";

import { Briefcase, Check, Home, MapPin, Pencil } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import type { SavedAddress } from '../use-address-book';

type CheckoutAddressSelectorItemProps = {
  address: SavedAddress;
  isSelected: boolean;
  onSelect: (address: SavedAddress) => void;
};

function AddressLabelIcon({ label }: { label: SavedAddress['label'] }) {
  if (label === 'Home') {
    return <Home className="h-4 w-4" />;
  }

  if (label === 'Work') {
    return <Briefcase className="h-4 w-4" />;
  }

  return <MapPin className="h-4 w-4" />;
}

export function CheckoutAddressSelectorItem({
  address,
  isSelected,
  onSelect,
}: CheckoutAddressSelectorItemProps) {
  return (
    <div
      className={cn(
        'rounded-[22px] border px-4 py-4 transition-all',
        isSelected
          ? 'border-[rgb(var(--brand)/0.4)] bg-[rgb(var(--brand-soft)/0.2)]'
          : 'border-[rgb(var(--border)/0.7)] bg-white',
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onSelect(address)}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
        >
          <div
            className={cn(
              'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl',
              isSelected
                ? 'bg-[rgb(var(--brand))] text-white'
                : 'bg-[rgb(var(--brand-soft)/0.28)] text-[rgb(var(--brand))]',
            )}
          >
            {isSelected ? <Check className="h-4 w-4" /> : <AddressLabelIcon label={address.label} />}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-[rgb(var(--ink))]">
              {address.label}
            </p>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-[rgb(var(--ink))]">
              {address.address}
            </p>
            <p className="mt-1 text-[13px] text-[rgb(var(--muted))]">
              {address.details}
              {address.alternateNumber ? ` · ${address.alternateNumber}` : ''}
            </p>
          </div>
        </button>

        <Link
          href="/profile/addresses"
          aria-label={`Edit ${address.label} address`}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--card-surface-muted)/0.9)] text-[rgb(var(--ink))] transition-colors hover:bg-[rgb(var(--brand-soft)/0.35)]"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
