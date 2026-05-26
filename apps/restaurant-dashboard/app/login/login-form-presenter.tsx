"use client";

import { useState } from "react";
import { Lock, User, LogIn, HelpCircle, Eye, EyeOff } from "lucide-react";

import { Globe } from "lucide-react";

type LoginFormPresenterProps = {
  username: string;
  password: string;
  subdomain: string;
  error: string;
  loading: boolean;
  showPass: boolean;
  onUsernameChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  onSubdomainChange: (val: string) => void;
  onTogglePass: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgot: () => void;
};

export function LoginFormPresenter({
  username, password, subdomain, error, loading, showPass,
  onUsernameChange, onPasswordChange, onSubdomainChange, onTogglePass, onSubmit, onForgot,
}: LoginFormPresenterProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {error && <div className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 border border-red-100">{error}</div>}

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Restaurant Subdomain</label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={subdomain} onChange={(e) => onSubdomainChange(e.target.value)} placeholder="e.g., naples"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/10 transition-all" required />
        </div>
        <p className="text-[10px] text-slate-400">The slug from justsearch-admin (e.g., naples)</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Username</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={username} onChange={(e) => onUsernameChange(e.target.value)} placeholder="Enter username"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/10 transition-all" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type={showPass ? "text" : "password"} value={password} onChange={(e) => onPasswordChange(e.target.value)} placeholder="Enter password"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/10 transition-all" required />
          <button type="button" onClick={onTogglePass} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-white shadow-sm shadow-amber-500/20 hover:bg-amber-600 transition-colors disabled:opacity-60">
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <button type="button" onClick={onForgot} className="flex w-full items-center justify-center gap-1 text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors">
        <HelpCircle className="h-3 w-3" /> Forgot your password?
      </button>
    </form>
  );
}
