"use client";

import { HelpCircle, ArrowLeft } from "lucide-react";

type LoginForgotPresenterProps = {
  onBack: () => void;
};

export function LoginForgotPresenter({ onBack }: LoginForgotPresenterProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-center py-4">
        <HelpCircle className="mx-auto h-8 w-8 text-slate-300 mb-2" />
        <p className="text-sm font-bold text-slate-900">Contact Platform Admin</p>
        <p className="text-xs text-slate-500 mt-1">
          Your restaurant dashboard credentials were created by the JustSearch administrator. Please contact them to recover or reset your password.
        </p>
      </div>

      <button type="button" onClick={onBack} className="flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
        <ArrowLeft className="h-3 w-3" /> Back to Sign In
      </button>
    </div>
  );
}
