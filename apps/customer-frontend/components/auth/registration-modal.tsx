"use client";
import { X, AlertTriangle } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import { useOtpRegistration } from './use-otp-registration';
import { DetailsStep } from './registration-modal-details-step';
import { OtpStep } from './registration-modal-otp-step';

export function RegistrationModal() {
  const otr = useOtpRegistration();

  if (!otr.isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Authentication">
      <Surface className="w-full max-w-[520px] rounded-[28px] border-white/60 bg-white/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:p-6">
        {otr.sessionExpiredReason && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <p className="text-sm font-semibold">{otr.sessionExpiredReason}</p>
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[rgb(var(--brand))]">
              {otr.step === 'otp'
                ? 'Secure Verification'
                : (otr.mode === 'login' ? 'Welcome Back' : 'Get Started')}
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
              {otr.step === 'otp'
                ? `Verify your mobile number`
                : (otr.mode === 'login' ? 'Log in to your account' : 'Create your account')}
            </h2>
            <p className="mt-1 text-sm text-[rgb(var(--muted))]">
              {otr.step === 'otp'
                ? 'Enter the 4-digit OTP sent to your phone.'
                : (otr.mode === 'login'
                    ? 'Enter your mobile number to receive an OTP.'
                    : 'Enter your name and mobile to sign up.')}
            </p>
          </div>
          <button type="button" onClick={otr.closeModal} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white/70 text-slate-500 transition-all hover:bg-white active:scale-90" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Login / Sign Up tabs */}
        {otr.step === 'details' && (
          <div className="mt-5 flex gap-1 rounded-2xl border border-[rgb(var(--border)/0.6)] bg-[rgb(var(--card-surface-muted)/0.4)] p-1">
            <button
              type="button"
              onClick={() => otr.switchMode('login')}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                otr.mode === 'login'
                  ? 'bg-white text-[rgb(var(--brand))] shadow-sm'
                  : 'text-[rgb(var(--muted))] hover:text-[rgb(var(--ink))]'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => otr.switchMode('signup')}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                otr.mode === 'signup'
                  ? 'bg-white text-[rgb(var(--brand))] shadow-sm'
                  : 'text-[rgb(var(--muted))] hover:text-[rgb(var(--ink))]'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        <div className="mt-5 space-y-4">
          {otr.step === 'details' ? (
            <DetailsStep
              form={otr.form}
              mode={otr.mode}
              autoSwitched={otr.autoSwitched}
              busy={otr.busy}
              error={otr.error}
              onRequestOtp={otr.form.handleSubmit(otr.requestOtp)}
              canRequestOtp={otr.canRequestOtp}
            />
          ) : (
            <OtpStep
              form={otr.form}
              mode={otr.mode}
              busy={otr.busy}
              error={otr.error}
              mobileFull={otr.mobileFull}
              demoOtp={otr.demoOtp}
              canRequestOtp={otr.canRequestOtp}
              canVerifyOtp={otr.canVerifyOtp}
              onBack={() => { otr.setStep('details'); otr.setError(null); otr.setBusy(false); otr.form.setValue('otp', '', { shouldValidate: true }); }}
              onRequestOtp={otr.form.handleSubmit(otr.requestOtp)}
              onVerifyOtp={otr.form.handleSubmit(otr.verifyOtp)}
            />
          )}
        </div>
      </Surface>
    </div>
  );
}
