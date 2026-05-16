"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { useDashboardAuth } from "@/lib/auth-context";
import { LoginFormPresenter } from "./login-form-presenter";
import { LoginForgotPresenter } from "./login-forgot-presenter";

export function LoginContainer() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [subdomain, setSubdomain] = useState(() => {
    if (typeof window === 'undefined') return "";
    return localStorage.getItem('restaurant-slug') || "";
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useDashboardAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (subdomain) {
      localStorage.setItem('restaurant-slug', subdomain.trim().toLowerCase());
    }
    setLoading(true);
    const success = await login(username, password);
    if (success) router.push("/");
    else setError("Invalid username or password");
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500">
            <LogIn className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Restaurant Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            {showForgot ? "Recover your login credentials" : "Sign in to manage your restaurant"}
          </p>
        </div>

        {!showForgot ? (
          <LoginFormPresenter
            username={username} password={password} subdomain={subdomain} error={error} loading={loading} showPass={showPass}
            onUsernameChange={setUsername} onPasswordChange={setPassword} onSubdomainChange={setSubdomain} onTogglePass={() => setShowPass(!showPass)}
            onSubmit={handleSubmit} onForgot={() => { setShowForgot(true); setError(""); }}
          />
        ) : (
          <LoginForgotPresenter onBack={() => setShowForgot(false)} />
        )}
      </div>
    </div>
  );
}
