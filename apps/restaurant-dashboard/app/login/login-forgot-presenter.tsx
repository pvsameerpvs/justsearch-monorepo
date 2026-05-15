"use client";

import { useState } from "react";
import { HelpCircle, ArrowLeft, Copy, Check } from "lucide-react";

type LoginForgotPresenterProps = {
  creds: { username: string; password: string; name: string } | null;
  onBack: () => void;
};

export function LoginForgotPresenter({ creds, onBack }: LoginForgotPresenterProps) {
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const copyText = async (text: string, type: "user" | "pass") => {
    await navigator.clipboard.writeText(text);
    if (type === "user") { setCopiedUser(true); setTimeout(() => setCopiedUser(false), 2000); }
    else { setCopiedPass(true); setTimeout(() => setCopiedPass(false), 2000); }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {creds ? (
        <>
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-center">
            <p className="text-sm font-bold text-slate-900">{creds.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">Your dashboard credentials</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Username</p>
                <p className="text-sm font-medium text-slate-700">{creds.username}</p>
              </div>
              <button onClick={() => copyText(creds.username, "user")} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 transition-colors">
                {copiedUser ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Password</p>
                <p className="text-sm font-medium text-slate-700">{"•".repeat(creds.password.length)}</p>
              </div>
              <button onClick={() => copyText(creds.password, "pass")} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 transition-colors">
                {copiedPass ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              If you need to change your password, please contact the <strong>JustSearch platform administrator</strong> who created your restaurant account.
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <HelpCircle className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm font-bold text-slate-900">Contact Platform Admin</p>
          <p className="text-xs text-slate-500 mt-1">
            Your restaurant dashboard credentials were created by the JustSearch administrator. Please contact them to recover or reset your password.
          </p>
        </div>
      )}

      <button type="button" onClick={onBack} className="flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
        <ArrowLeft className="h-3 w-3" /> Back to Sign In
      </button>
    </div>
  );
}
