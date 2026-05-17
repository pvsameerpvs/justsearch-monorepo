"use client";
import { X } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import { useOtpRegistration } from './use-otp-registration';
import { DetailsStep } from './registration-modal-details-step';
import { OtpStep } from './registration-modal-otp-step';

export function RegistrationModal() {
  const otr = useOtpRegistration();

  if (!otr.isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Registration">
      <Surface className="w-full max-w-[520px] rounded-[28px] border-white/60 bg-white/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.25)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[rgb(var(--brand))]">Get Started</p>
            <h2 className="mt-2 font-display text-xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">Verify your mobile number</h2>
            <p className="mt-1 text-sm text-[rgb(var(--muted))]">Ordering and games require a verified mobile number.</p>
          </div>
          <button type="button" onClick={otr.closeModal} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white/70 text-slate-500 transition-all hover:bg-white active:scale-90" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {otr.step === 'details' ? (
            <DetailsStep form={otr.form} busy={otr.busy} error={otr.error} onRequestOtp={otr.form.handleSubmit(otr.requestOtp)} canRequestOtp={otr.canRequestOtp} />
          ) : (
            <OtpStep form={otr.form} busy={otr.busy} error={otr.error} mobileFull={otr.mobileFull} demoOtp={otr.demoOtp} canRequestOtp={otr.canRequestOtp} canVerifyOtp={otr.canVerifyOtp} onBack={() => { otr.setStep('details'); otr.setError(null); otr.setBusy(false); otr.form.setValue('otp', '', { shouldValidate: true }); }} onRequestOtp={otr.form.handleSubmit(otr.requestOtp)} onVerifyOtp={otr.form.handleSubmit(otr.verifyOtp)} />
          )}
        </div>
      </Surface>
    </div>
  );
}
