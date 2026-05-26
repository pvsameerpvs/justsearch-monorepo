"use client";

import { HelpCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@justsearch/ui";

type LoginForgotPresenterProps = {
  onBack: () => void;
};

export function LoginForgotPresenter({ onBack }: LoginForgotPresenterProps) {
  return (
    <Card className="border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <CardContent className="p-6 space-y-4">
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
      </CardContent>
    </Card>
  );
}
