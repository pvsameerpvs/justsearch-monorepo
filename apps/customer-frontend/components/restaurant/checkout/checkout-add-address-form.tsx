"use client";

import { Loader2, MapPin } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGeolocation } from '../use-geolocation';
import type { SavedAddress } from '../use-address-book';
import {
  checkoutAddressSchema,
  type CheckoutAddressFormData,
} from '@/lib/validations/common.schema';
import { CheckoutAddressFormFields } from './checkout-address-form-fields';
import { CheckoutAddressLabelSelector } from './checkout-address-label-selector';

type CheckoutAddAddressFormProps = {
  initialAddress?: string;
  onSave: (address: Omit<SavedAddress, 'id'>) => void;
  onCancel: () => void;
};

export function CheckoutAddAddressForm({ initialAddress, onSave, onCancel }: CheckoutAddAddressFormProps) {
  const { getCurrentAddress, isLocating, error } = useGeolocation();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<CheckoutAddressFormData>({
    resolver: zodResolver(checkoutAddressSchema),
    mode: 'onChange',
    defaultValues: {
      label: 'Home',
      address: initialAddress?.trim() ?? '',
      details: '',
      alternateNumber: '',
    },
  });

  const label = watch('label');

  useEffect(() => {
    if (initialAddress) {
      setValue('address', initialAddress.trim(), { shouldValidate: true });
    }
  }, [initialAddress, setValue]);

  const handleGetCurrentLocation = async () => {
    const resolvedAddress = await getCurrentAddress();
    if (resolvedAddress) {
      setValue('address', resolvedAddress, { shouldValidate: true });
    } else if (error) {
      alert(error);
    }
  };

  const onSubmit = (data: CheckoutAddressFormData) => {
    onSave({
      label: data.label,
      address: data.address.trim(),
      details: data.details?.trim() ?? '',
      alternateNumber: data.alternateNumber?.trim() ?? '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">Add delivery address</p>
          <p className="mt-1 text-sm text-[rgb(var(--muted))]">Save a new address for checkout and profile.</p>
        </div>
        <button type="button" onClick={handleGetCurrentLocation} disabled={isLocating} className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--brand-soft)/0.34)] px-3 py-2 text-[12px] font-semibold text-[rgb(var(--brand))] transition-colors hover:bg-[rgb(var(--brand-soft)/0.5)] disabled:cursor-not-allowed disabled:opacity-60">
          {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
          {isLocating ? 'Locating...' : 'Use current location'}
        </button>
      </div>
      <CheckoutAddressLabelSelector
        value={label}
        onChange={(newLabel) => setValue('label', newLabel, { shouldValidate: true })}
      />
      <CheckoutAddressFormFields register={register} errors={errors} />
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 rounded-full border border-[rgb(var(--border)/0.72)] px-4 py-3 text-sm font-semibold text-[rgb(var(--muted))] transition-colors hover:bg-[rgb(var(--card-surface-muted)/0.6)]">Cancel</button>
        <button type="submit" disabled={!isValid} className="flex-[1.3] rounded-full bg-[rgb(var(--brand))] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,118,110,0.22)] transition-transform active:scale-[0.99] disabled:opacity-50">Save address</button>
      </div>
    </form>
  );
}
