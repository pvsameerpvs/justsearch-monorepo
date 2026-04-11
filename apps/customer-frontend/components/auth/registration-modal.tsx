"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import { useRegistration } from './registration-context';

type OtpRequestResponse = {
  requestId: string;
  demoOtp?: string;
};

type OtpVerifyResponse = {
  verified: true;
  user: {
    name: string;
    mobile: string;
  };
};

function normalizeUaeLocalDigits(raw: string) {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('971')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 9);
}

function isValidUaeLocalDigits(value: string) {
  return /^[0-9]{8,9}$/.test(value);
}

function isValidName(value: string) {
  const trimmed = value.trim();
  return trimmed.length >= 2 && trimmed.length <= 60;
}

function isValidOtp(value: string) {
  return /^[0-9]{4}$/.test(value);
}

type Step = 'details' | 'otp';

export function RegistrationModal() {
  const { isModalOpen, closeModal, setUser, user } = useRegistration();

  const [step, setStep] = useState<Step>('details');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<{ name: string; mobile: string; otp: string }>({
    mode: 'onChange',
    shouldUnregister: false,
    defaultValues: {
      name: '',
      mobile: '',
      otp: '',
    },
  });

  const name = watch('name');
  const mobileLocalDigits = watch('mobile');
  const otp = watch('otp');

  const mobileFull = useMemo(
    () => (mobileLocalDigits ? `+971${mobileLocalDigits}` : '+971'),
    [mobileLocalDigits],
  );

  const canRequestOtp = useMemo(
    () => isValidName(name) && isValidUaeLocalDigits(mobileLocalDigits) && !busy,
    [busy, mobileLocalDigits, name],
  );
  const canVerifyOtp = useMemo(
    () =>
      step === 'otp' &&
      Boolean(requestId) &&
      isValidUaeLocalDigits(mobileLocalDigits) &&
      isValidOtp(otp) &&
      !busy,
    [busy, mobileLocalDigits, otp, requestId, step],
  );

  useEffect(() => {
    if (!isModalOpen) return;
    setError(null);
    setBusy(false);
    setStep('details');
    setRequestId(null);
    setDemoOtp(null);

    const initialLocalDigits = user?.mobile ? normalizeUaeLocalDigits(user.mobile) : '';
    reset({
      name: user?.name ?? '',
      mobile: initialLocalDigits,
      otp: '',
    });
  }, [isModalOpen, reset, user?.mobile, user?.name]);

  const onClose = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const requestOtp = useCallback(async (values: { name: string; mobileLocalDigits: string }) => {
    setError(null);
    setBusy(true);
    try {
      const response = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: values.name.trim(), mobile: `+971${values.mobileLocalDigits}` }),
      });

      const payload = (await response.json().catch(() => null)) as any;

      if (!response.ok) {
        setError(typeof payload?.error === 'string' ? payload.error : 'Failed to request OTP');
        setBusy(false);
        return;
      }

      const data = payload as OtpRequestResponse;
      setRequestId(data.requestId);
      setDemoOtp(typeof data.demoOtp === 'string' ? data.demoOtp : null);
      setStep('otp');
      setValue('otp', '', { shouldValidate: true });
      setBusy(false);
    } catch {
      setError('Failed to request OTP. Please try again.');
      setBusy(false);
    }
  }, [setValue]);

  const verifyOtp = useCallback(async (values: { mobileLocalDigits: string; otp: string }) => {
    if (!requestId) return;
    setError(null);
    setBusy(true);
    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          requestId,
          mobile: `+971${values.mobileLocalDigits}`,
          otp: values.otp.trim(),
        }),
      });

      const payload = (await response.json().catch(() => null)) as any;

      if (!response.ok) {
        setError(typeof payload?.error === 'string' ? payload.error : 'Failed to verify OTP');
        setBusy(false);
        return;
      }

      const data = payload as OtpVerifyResponse;
      setUser({
        name: data.user.name,
        mobile: data.user.mobile,
        verifiedAt: Date.now(),
      });
      setBusy(false);
      closeModal();
    } catch {
      setError('Failed to verify OTP. Please try again.');
      setBusy(false);
    }
  }, [requestId, setUser, closeModal]);

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Registration"
    >
      <Surface className="w-full max-w-[520px] rounded-[28px] border-white/60 bg-white/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[rgb(var(--brand))]">
              Register to play
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
              Verify your mobile number
            </h2>
            <p className="mt-1 text-sm text-[rgb(var(--muted))]">
              Games and score tracking require a verified mobile number.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white/70 text-slate-500 transition-all hover:bg-white active:scale-90"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {step === 'details' ? (
            <>
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
                  {errors.name ? (
                    <span className="text-xs font-medium text-red-600">{errors.name.message}</span>
                  ) : null}
                </label>

                <label className="grid gap-1.5">
                  <span className="text-xs font-semibold text-[rgb(var(--ink))]">Mobile number</span>
                  <Controller
                    control={control}
                    name="mobile"
                    rules={{
                      required: 'Mobile number is required',
                      validate: (value) =>
                        isValidUaeLocalDigits(value) ? true : 'Enter a valid UAE number',
                    }}
                    render={({ field }) => (
                      <div className="flex h-12 items-center gap-2 rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white px-4 text-sm font-medium text-[rgb(var(--ink))] outline-none transition-all focus-within:border-[rgb(var(--brand))] focus-within:ring-4 focus-within:ring-[rgb(var(--brand)/0.12)]">
                        <span className="select-none font-mono text-[rgb(var(--muted))]">+971</span>
                        <input
                          value={field.value}
                          onChange={(event) =>
                            field.onChange(normalizeUaeLocalDigits(event.target.value))
                          }
                          placeholder="501234567"
                          className="h-full w-full bg-transparent font-mono text-[rgb(var(--ink))] outline-none"
                          inputMode="numeric"
                          autoComplete="tel"
                        />
                      </div>
                    )}
                  />
                  <span className="text-xs text-[rgb(var(--muted))]">
                    Example: <span className="font-mono">+971501234567</span>
                  </span>
                  {errors.mobile ? (
                    <span className="text-xs font-medium text-red-600">{errors.mobile.message}</span>
                  ) : null}
                </label>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="button"
                disabled={!canRequestOtp || busy}
                onClick={handleSubmit((values) =>
                  requestOtp({ name: values.name, mobileLocalDigits: values.mobile }),
                )}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[rgb(var(--brand))] px-5 text-sm font-semibold text-white shadow-[0_14px_36px_rgb(var(--brand)/0.25)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
              >
                {busy ? 'Sending OTP…' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <div className="rounded-[22px] border border-[rgb(var(--border)/0.9)] bg-white/70 p-4">
                <p className="text-xs font-semibold text-[rgb(var(--ink))]">
                  OTP sent to <span className="font-mono">{mobileFull}</span>
                </p>
                <p className="mt-1 text-xs text-[rgb(var(--muted))]">
                  Enter the 4-digit code to continue.
                </p>
                {demoOtp ? (
                  <p className="mt-2 text-xs font-semibold text-[rgb(var(--brand))]">
                    Demo OTP: <span className="font-mono">{demoOtp}</span>
                  </p>
                ) : null}
              </div>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold text-[rgb(var(--ink))]">OTP</span>
                <Controller
                  control={control}
                  name="otp"
                  rules={{
                    required: 'OTP is required',
                    validate: (value) => (/^[0-9]{4}$/.test(value) ? true : 'Enter a 4-digit OTP'),
                  }}
                  render={({ field }) => (
                    <input
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(
                          String(event.target.value).replace(/[^0-9]/g, '').slice(0, 4),
                        )
                      }
                      placeholder="0000"
                      className="h-14 w-full rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white px-4 text-center font-mono text-2xl tracking-[0.55em] text-[rgb(var(--ink))] outline-none transition-all focus:border-[rgb(var(--brand))] focus:ring-4 focus:ring-[rgb(var(--brand)/0.12)]"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                    />
                  )}
                />
                {errors.otp ? (
                  <span className="text-xs font-medium text-red-600">{errors.otp.message}</span>
                ) : null}
              </label>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep('details');
                    setError(null);
                    setBusy(false);
                    setValue('otp', '', { shouldValidate: true });
                  }}
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white px-5 text-sm font-semibold text-[rgb(var(--ink))] transition-all hover:bg-[rgb(var(--card-surface-muted)/0.6)] active:scale-[0.99]"
                >
                  Edit details
                </button>
                <button
                  type="button"
                  disabled={!canVerifyOtp || busy}
                  onClick={handleSubmit((values) =>
                    verifyOtp({ mobileLocalDigits: values.mobile, otp: values.otp }),
                  )}
                  className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[rgb(var(--brand))] px-5 text-sm font-semibold text-white shadow-[0_14px_36px_rgb(var(--brand)/0.25)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
                >
                  {busy ? 'Verifying…' : 'Verify & Continue'}
                </button>
              </div>

              <button
                type="button"
                disabled={!canRequestOtp || busy}
                onClick={handleSubmit((values) =>
                  requestOtp({ name: values.name, mobileLocalDigits: values.mobile }),
                )}
                className="inline-flex h-11 w-full items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white px-5 text-sm font-semibold text-[rgb(var(--brand))] transition-all hover:bg-[rgb(var(--brand-soft)/0.35)] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99]"
              >
                Resend OTP
              </button>
            </>
          )}
        </div>
      </Surface>
    </div>
  );
}
