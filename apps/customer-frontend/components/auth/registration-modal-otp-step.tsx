"use client";
import type { UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { isValidOtp } from './registration-modal-utils';
import type { AuthMode } from './use-otp-registration';

type FormValues = { name: string; mobile: string; otp: string };

interface OtpStepProps {
  form: UseFormReturn<FormValues>;
  mode: AuthMode;
  busy: boolean;
  error: string | null;
  mobileFull: string;
  demoOtp: string | null;
  canRequestOtp: boolean;
  canVerifyOtp: boolean;
  onBack: () => void;
  onRequestOtp: () => void;
  onVerifyOtp: () => void;
}

export function OtpStep({ form, mode, busy, error, mobileFull, demoOtp, canRequestOtp, canVerifyOtp, onBack, onRequestOtp, onVerifyOtp }: OtpStepProps) {
  const { control, formState: { errors } } = form;

  return (
    <>
      <div className="rounded-[22px] border border-[rgb(var(--border)/0.9)] bg-white/70 p-4">
        <p className="text-xs font-semibold text-[rgb(var(--ink))]">OTP sent to <span className="font-mono">{mobileFull}</span></p>
        <p className="mt-1 text-xs text-[rgb(var(--muted))]">Enter the 4-digit code to {mode === 'login' ? 'log in' : 'sign up'}.</p>
        {demoOtp ? (
          <p className="mt-2 text-xs font-bold text-[rgb(var(--brand))]">
            Demo OTP: <span className="font-mono tracking-widest">{demoOtp}</span>
          </p>
        ) : null}
      </div>

      <label className="grid gap-1.5">
        <span className="text-xs font-semibold text-[rgb(var(--ink))]">OTP</span>
        <Controller
          control={control}
          name="otp"
          rules={{ required: 'OTP is required', validate: (value) => isValidOtp(value) ? true : 'Enter a 4-digit OTP' }}
          render={({ field }) => (
            <input
              value={field.value}
              onChange={(event) => field.onChange(String(event.target.value).replace(/[^0-9]/g, '').slice(0, 4))}
              placeholder="0000"
              className="h-14 w-full rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white px-4 text-center font-mono text-2xl tracking-[0.55em] text-[rgb(var(--ink))] outline-none transition-all focus:border-[rgb(var(--brand))] focus:ring-4 focus:ring-[rgb(var(--brand)/0.12)]"
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          )}
        />
        {errors.otp ? <span className="text-xs font-medium text-red-600">{errors.otp.message}</span> : null}
      </label>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={onBack} className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white px-5 text-sm font-semibold text-[rgb(var(--ink))] transition-all hover:bg-[rgb(var(--card-surface-muted)/0.6)] active:scale-[0.99]">Edit details</button>
        <button type="button" disabled={!canVerifyOtp || busy} onClick={onVerifyOtp} className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[rgb(var(--brand))] px-5 text-sm font-semibold text-white shadow-[0_14px_36px_rgb(var(--brand)/0.25)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]">{busy ? 'Verifying…' : (mode === 'login' ? 'Log In' : 'Sign Up')}</button>
      </div>

      <button type="button" disabled={!canRequestOtp || busy} onClick={onRequestOtp} className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white px-5 text-sm font-semibold text-[rgb(var(--brand))] transition-all hover:bg-[rgb(var(--brand-soft)/0.35)] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]">Resend OTP</button>
    </>
  );
}
