"use client";
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRegistration } from './registration-context';
import { normalizeUaeLocalDigits, isValidName, isValidUaeLocalDigits, isValidOtp, type OtpRequestResponse, type OtpVerifyResponse } from './registration-modal-utils';

export type Step = 'details' | 'otp';
export type FormValues = { name: string; mobile: string; otp: string };

async function postOtp(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const payload = await response.json().catch(() => null) as Record<string, unknown> | null;
  if (!response.ok) throw new Error(payload?.error && typeof payload.error === 'string' ? payload.error as string : 'Request failed');
  return payload;
}

export function useOtpRegistration() {
  const { isModalOpen, closeModal, setUser, user } = useRegistration();
  const [step, setStep] = useState<Step>('details');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({ mode: 'onChange', defaultValues: { name: '', mobile: '', otp: '' } });
  const name = form.watch('name');
  const mobileLocalDigits = form.watch('mobile');
  const otp = form.watch('otp');
  const mobileFull = `+971${mobileLocalDigits || ''}`;
  const canRequestOtp = isValidName(name) && isValidUaeLocalDigits(mobileLocalDigits) && !busy;
  const canVerifyOtp = step === 'otp' && Boolean(requestId) && isValidUaeLocalDigits(mobileLocalDigits) && isValidOtp(otp) && !busy;

  useEffect(() => {
    if (!isModalOpen) return;
    setError(null); setBusy(false); setStep('details'); setRequestId(null); setDemoOtp(null);
    form.reset({ name: user?.name ?? '', mobile: user?.mobile ? normalizeUaeLocalDigits(user.mobile) : '', otp: '' });
  }, [isModalOpen, form, user?.mobile, user?.name]);

  const requestOtp = useCallback(async () => {
    setError(null); setBusy(true);
    try {
      const data = await postOtp('/api/auth/otp/request', { name: name.trim(), mobile: `+971${mobileLocalDigits}` }) as OtpRequestResponse;
      setRequestId(data.requestId);
      setDemoOtp(data.demoOtp ?? null);
      setStep('otp');
      form.setValue('otp', '', { shouldValidate: true });
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to request OTP'); }
    setBusy(false);
  }, [name, mobileLocalDigits, form]);

  const verifyOtp = useCallback(async () => {
    if (!requestId) return;
    setError(null); setBusy(true);
    try {
      const data = await postOtp('/api/auth/otp/verify', { requestId, mobile: `+971${mobileLocalDigits}`, otp: otp.trim() }) as OtpVerifyResponse;
      setUser({ name: data.user.name, mobile: data.user.phone, verifiedAt: Date.now() });
      closeModal();
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to verify OTP'); }
    setBusy(false);
  }, [requestId, mobileLocalDigits, otp, setUser, closeModal]);

  return { isModalOpen, closeModal, form, step, busy, error, setError, setBusy, mobileFull, canRequestOtp, canVerifyOtp, setStep, demoOtp, setDemoOtp, requestOtp, verifyOtp };
}
