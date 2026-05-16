"use client";

import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { CheckoutAddressFormData } from '@/lib/validations/common.schema';

type Props = {
  register: UseFormRegister<CheckoutAddressFormData>;
  errors: FieldErrors<CheckoutAddressFormData>;
};

export function CheckoutAddressFormFields({ register, errors }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
          Address
        </p>
        <textarea
          {...register('address')}
          rows={3}
          placeholder="Area, street, building..."
          className="mt-2 w-full resize-none rounded-[22px] border border-[rgb(var(--border)/0.72)] bg-[rgb(var(--card-surface-muted)/0.6)] px-4 py-3 text-sm font-medium text-[rgb(var(--ink))] outline-none transition-colors focus:border-[rgb(var(--brand)/0.55)]"
        />
        {errors.address && (
          <p className="mt-1 text-xs font-medium text-red-500">{errors.address.message}</p>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
          Details
        </p>
        <input
          {...register('details')}
          placeholder="Flat, office, landmark"
          className="mt-2 w-full rounded-[18px] border border-[rgb(var(--border)/0.72)] bg-[rgb(var(--card-surface-muted)/0.6)] px-4 py-3 text-sm font-medium text-[rgb(var(--ink))] outline-none transition-colors focus:border-[rgb(var(--brand)/0.55)]"
        />
      </div>
    </div>
  );
}
