"use client";
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRegistration } from './registration-context';
import { normalizeUaeLocalDigits, isValidName, isValidUaeLocalDigits, isValidOtp, type OtpRequestResponse, type OtpVerifyResponse } from './registration-modal-utils';

export type Step = 'details' | 'otp';
export type FormValues = { name: string; mobile: string; otp: string };
export type AuthMode = 'login' | 'signup';

async function postOtp(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const payload = await response.json().catch(() => null) as Record<string, unknown> | null;
  if (!response.ok) throw new Error(payload?.error && typeof payload.error === 'string' ? payload.error as string : 'Request failed');
  return payload;
}

export function useOtpRegistration() {
  const { isModalOpen, closeModal, setUser, user } = useRegistration();
  const [step, setStep] = useState<Step>('details');
  const [mode, setMode] = useState<AuthMode>('login');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSwitched, setAutoSwitched] = useState(false);

  const form = useForm<FormValues>({ mode: 'onChange', defaultValues: { name: '', mobile: '', otp: '' } });
  const name = form.watch('name');
  const mobileLocalDigits = form.watch('mobile');
  const otp = form.watch('otp');
  const mobileFull = `+971${mobileLocalDigits || ''}`;

  // Validation: login only needs phone, signup needs name + phone
  const canRequestOtp = mode === 'login'
    ? isValidUaeLocalDigits(mobileLocalDigits) && !busy
    : isValidName(name) && isValidUaeLocalDigits(mobileLocalDigits) && !busy;

  const canVerifyOtp = step === 'otp' && Boolean(requestId) && isValidUaeLocalDigits(mobileLocalDigits) && isValidOtp(otp) && !busy;

  // Reset form ONLY when modal opens (not when mode switches programmatically)
  useEffect(() => {
    if (!isModalOpen) return;
    setError(null); setBusy(false); setStep('details'); setRequestId(null); setDemoOtp(null); setAutoSwitched(false);
    form.reset({
      name: mode === 'login' ? '' : (user?.name ?? ''),
      mobile: user?.mobile ? normalizeUaeLocalDigits(user.mobile) : '',
      otp: ''
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, form, user?.mobile, user?.name]);

  const requestOtp = useCallback(async () => {
    setError(null);
    setBusy(true);
    try {
      const payload: Record<string, unknown> = { mobile: `+971${mobileLocalDigits}` };
      // Only send name for signup mode
      if (mode === 'signup' && name.trim()) {
        payload.name = name.trim();
      }
      const data = await postOtp('/api/auth/otp/request', payload) as OtpRequestResponse;

      // If backend says this is a new user but we're in login mode, switch to signup
      if (data.flow === 'signup' && mode === 'login') {
        setMode('signup');
        setAutoSwitched(true);
        return; // Stay on details step — don't advance to OTP
      }

      setRequestId(data.requestId);
      if (data.demoOtp) setDemoOtp(data.demoOtp);
      setStep('otp');
      form.setValue('otp', '', { shouldValidate: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to request OTP');
    } finally {
      setBusy(false);
    }
  }, [mode, name, mobileLocalDigits, form]);

  const verifyOtp = useCallback(async () => {
    if (!requestId) return;
    setError(null); setBusy(true);
    try {
      const data = await postOtp('/api/auth/otp/verify', { requestId, mobile: `+971${mobileLocalDigits}`, otp: otp.trim() }) as OtpVerifyResponse;
      setUser({ id: data.user.id, name: data.user.name, mobile: data.user.phone, verifiedAt: Date.now() });
      closeModal();
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to verify OTP'); }
    setBusy(false);
  }, [requestId, mobileLocalDigits, otp, setUser, closeModal]);

  const switchMode = useCallback((newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setAutoSwitched(false);
    setStep('details');
    setRequestId(null);
    setDemoOtp(null);
    form.reset({
      name: newMode === 'login' ? '' : (user?.name ?? ''),
      mobile: form.getValues('mobile'),
      otp: ''
    });
  }, [form, user?.name]);

  return {
    isModalOpen,
    closeModal,
    form,
    step,
    mode,
    busy,
    error,
    autoSwitched,
    setError,
    setBusy,
    mobileFull,
    demoOtp,
    canRequestOtp,
    canVerifyOtp,
    setStep,
    requestOtp,
    verifyOtp,
    switchMode,
  };
}
