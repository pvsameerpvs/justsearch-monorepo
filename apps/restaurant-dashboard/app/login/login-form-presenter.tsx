"use client";

import { Globe, User, LogIn, HelpCircle } from "lucide-react";
import { Button, Card, CardContent } from "@justsearch/ui";
import { LoginInput } from "./login-input";
import { LoginPasswordInput } from "./login-password-input";

export type LoginFormPresenterProps = {
  username: string; password: string; subdomain: string; error: string; loading: boolean; showPass: boolean;
  onUsernameChange: (val: string) => void; onPasswordChange: (val: string) => void; onSubdomainChange: (val: string) => void;
  onTogglePass: () => void; onSubmit: (e: React.FormEvent) => void; onForgot: () => void;
};

export function LoginFormPresenter({
  username, password, subdomain, error, loading, showPass,
  onUsernameChange, onPasswordChange, onSubdomainChange, onTogglePass, onSubmit, onForgot,
}: LoginFormPresenterProps) {
  return (
    <Card className="border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <form onSubmit={onSubmit}>
        <CardContent className="p-6 space-y-4">
          {error && <div className="rounded-xl bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 border border-red-100">{error}</div>}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Restaurant Subdomain</label>
            <LoginInput icon={<Globe className="h-4 w-4" />} value={subdomain} onChange={onSubdomainChange} placeholder="e.g., naples" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Username</label>
            <LoginInput icon={<User className="h-4 w-4" />} value={username} onChange={onUsernameChange} placeholder="Enter username" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
            <LoginPasswordInput value={password} onChange={onPasswordChange} showPass={showPass} onTogglePass={onTogglePass} />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 transition-colors disabled:opacity-60">
            <LogIn className="h-4 w-4 mr-2" />{loading ? "Signing in..." : "Sign In"}
          </Button>
          <button type="button" onClick={onForgot} className="flex w-full items-center justify-center gap-1 text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors">
            <HelpCircle className="h-3 w-3" /> Forgot your password?
          </button>
        </CardContent>
      </form>
    </Card>
  );
}
