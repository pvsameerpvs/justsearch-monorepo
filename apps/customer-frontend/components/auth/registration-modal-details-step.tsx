"use client";
import type { UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { normalizeUaeLocalDigits, isValidUaeLocalDigits } from './registration-modal-utils';

type FormValues = { name: string; mobile: string; otp: string };

interface DetailsStepProps {
  form: UseFormReturn<FormValues>;
  busy: boolean;
  error: string | null;
  onRequestOtp: () => void;
  canRequestOtp: boolean;
}

export function DetailsStep({ form, busy, error, onRequestOtp, canRequestOtp }: DetailsStepProps) {
  const { register, control, formState: { errors } } = form;

  return (
    <div className="grid gap-3">
      <label className="grid gap-1.5">
        <span className="text-xs font-semibold text-[rgb(var(--ink))]">Name</span>
        <input
          placeholder="Enter your name"
          className="h-12 w-full rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white px-4 text-sm font-medium text-[rgb(var(--ink))] outline-none transition-all focus:border-[rgb(var(--brand))] focus:ring-4 focus:ring-[rgb(var(--brand)/0.12)]"
          autoComplete="name"
          {...register('name', {
            required: 'Name is required',
            validate: (value) => {
              const trimmed = value.trim();
              if (trimmed.length < 2) return 'Name must be at least 2 characters';
              if (trimmed.length > 60) return 'Name is too long';
              return true;
            },
          })}
        />
        {errors.name ? <span className="text-xs font-medium text-red-600">{errors.name.message}</span> : null}
      </label>

      <label className="grid gap-1.5">
        <span className="text-xs font-semibold text-[rgb(var(--ink))]">Mobile number</span>
        <Controller
          control={control}
          name="mobile"
          rules={{ required: 'Mobile number is required', validate: (value) => isValidUaeLocalDigits(value) ? true : 'Enter a valid UAE number' }}
          render={({ field }) => (
            <div className="flex h-12 items-center gap-2 rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white px-4 text-sm font-medium text-[rgb(var(--ink))] outline-none transition-all focus-within:border-[rgb(var(--brand))] focus-within:ring-4 focus-within:ring-[rgb(var(--brand)/0.12)]">
              <span className="select-none font-mono text-[rgb(var(--muted))]">+971</span>
              <input value={field.value} onChange={(event) => field.onChange(normalizeUaeLocalDigits(event.target.value))} placeholder="501234567" className="h-full w-full bg-transparent font-mono text-[rgb(var(--ink))] outline-none" inputMode="numeric" autoComplete="tel" />
            </div>
          )}
        />
        <span className="text-xs text-[rgb(var(--muted))]">Example: <span className="font-mono">+971501234567</span></span>
        {errors.mobile ? <span className="text-xs font-medium text-red-600">{errors.mobile.message}</span> : null}
      </label>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}

      <button type="button" disabled={!canRequestOtp || busy} onClick={onRequestOtp} className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[rgb(var(--brand))] px-5 text-sm font-semibold text-white shadow-[0_14px_36px_rgb(var(--brand)/0.25)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]">
        {busy ? 'Sending OTP…' : 'Send OTP'}
      </button>
    </div>
  );
}
