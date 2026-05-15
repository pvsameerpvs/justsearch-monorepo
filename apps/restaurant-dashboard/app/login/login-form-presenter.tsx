"use client";

import { useState } from "react";
import { Lock, User, LogIn, HelpCircle, Eye, EyeOff } from "lucide-react";

type LoginFormPresenterProps = {
  username: string;
  password: string;
  error: string;
  loading: boolean;
  showPass: boolean;
  onUsernameChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onTogglePass: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgot: () => void;
};

export function LoginFormPresenter({
  username, password, error, loading, showPass,
  onUsernameChange, onPasswordChange, onTogglePass, onSubmit, onForgot,
}: LoginFormPresenterProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">{error}</div>}

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Username</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={username} onChange={(e) => onUsernameChange(e.target.value)} placeholder="Enter username"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type={showPass ? "text" : "password"} value={password} onChange={(e) => onPasswordChange(e.target.value)} placeholder="Enter password"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" required />
          <button type="button" onClick={onTogglePass} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition-colors disabled:opacity-60">
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <button type="button" onClick={onForgot} className="flex w-full items-center justify-center gap-1 text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors">
        <HelpCircle className="h-3 w-3" /> Forgot your password?
      </button>
    </form>
  );
}
