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
          Villa no. / Flat no. <span className="text-red-500">*</span>
        </p>
        <input
          {...register('villaNo')}
          placeholder="Enter"
          className="mt-2 w-full rounded-[18px] border border-[rgb(var(--border)/0.72)] bg-[rgb(var(--card-surface-muted)/0.6)] px-4 py-3 text-sm font-medium text-[rgb(var(--ink))] outline-none transition-colors focus:border-[rgb(var(--brand)/0.55)]"
        />
        {errors.villaNo && (
          <p className="mt-1 text-xs font-medium text-red-500">{errors.villaNo.message}</p>
        )}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
          Villa / Building name <span className="text-red-500">*</span>
        </p>
        <input
          {...register('buildingName')}
          placeholder="Enter"
          className="mt-2 w-full rounded-[18px] border border-[rgb(var(--border)/0.72)] bg-[rgb(var(--card-surface-muted)/0.6)] px-4 py-3 text-sm font-medium text-[rgb(var(--ink))] outline-none transition-colors focus:border-[rgb(var(--brand)/0.55)]"
        />
        {errors.buildingName && (
          <p className="mt-1 text-xs font-medium text-red-500">{errors.buildingName.message}</p>
        )}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
          Area / Street <span className="text-red-500">*</span>
        </p>
        <input
          {...register('areaStreet')}
          placeholder="Enter"
          className="mt-2 w-full rounded-[18px] border border-[rgb(var(--border)/0.72)] bg-[rgb(var(--card-surface-muted)/0.6)] px-4 py-3 text-sm font-medium text-[rgb(var(--ink))] outline-none transition-colors focus:border-[rgb(var(--brand)/0.55)]"
        />
        {errors.areaStreet && (
          <p className="mt-1 text-xs font-medium text-red-500">{errors.areaStreet.message}</p>
        )}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
          Nearby landmark (Optional)
        </p>
        <input
          {...register('landmark')}
          placeholder="Enter"
          className="mt-2 w-full rounded-[18px] border border-[rgb(var(--border)/0.72)] bg-[rgb(var(--card-surface-muted)/0.6)] px-4 py-3 text-sm font-medium text-[rgb(var(--ink))] outline-none transition-colors focus:border-[rgb(var(--brand)/0.55)]"
        />
      </div>
    </div>
  );
}
