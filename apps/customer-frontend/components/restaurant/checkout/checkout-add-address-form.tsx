"use client";

import type { SavedAddress } from '../use-address-book';
import type { CheckoutAddressFormData } from '@/lib/validations/common.schema';
import { CheckoutAddressFormFields } from './checkout-address-form-fields';
import { CheckoutAddressLabelSelector } from './checkout-address-label-selector';
import { CheckoutAddAddressHeader } from './checkout-add-address-header';
import { CheckoutAddAddressFooter } from './checkout-add-address-footer';
import { useCheckoutAddressForm } from './use-checkout-address-form';

type CheckoutAddAddressFormProps = {
  initialAddress?: string;
  onSave: (address: Omit<SavedAddress, 'id'>) => void;
  onCancel: () => void;
};

export function CheckoutAddAddressForm({ initialAddress, onSave, onCancel }: CheckoutAddAddressFormProps) {
  const {
    register, handleSubmit, setValue, watch,
    errors, isValid, saveError, isLocating,
    handleGetCurrentLocation, buildAddressPayload, setSaveError,
  } = useCheckoutAddressForm(initialAddress);

  const label = watch('label');

  const onSubmit = async (data: CheckoutAddressFormData) => {
    setSaveError(null);
    try {
      await onSave(buildAddressPayload(data));
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to save address. Please try again.';
      setSaveError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <CheckoutAddAddressHeader isLocating={isLocating} onGetCurrentLocation={handleGetCurrentLocation} />

      {saveError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
          {saveError}
        </div>
      )}

      <CheckoutAddressLabelSelector
        value={label}
        onChange={(newLabel) => setValue('label', newLabel, { shouldValidate: true })}
      />
      <CheckoutAddressFormFields register={register} errors={errors} />
      <CheckoutAddAddressFooter onCancel={onCancel} isValid={isValid} />
    </form>
  );
}
