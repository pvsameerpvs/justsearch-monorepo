"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, ChefHat } from "lucide-react";
import { useDashboardAuth } from "@/lib/auth-context";
import { LoginFormPresenter } from "./login-form-presenter";
import { LoginForgotPresenter } from "./login-forgot-presenter";

export function LoginContainer() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [subdomain, setSubdomain] = useState("");

  useEffect(() => {
    setSubdomain(localStorage.getItem('restaurant-slug') || "");
  }, []);
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-amber-50/30 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm shadow-amber-500/10 border border-amber-100">
            <ChefHat className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Restaurant Dashboard</h1>
          <p className="mt-1.5 text-sm text-slate-500">
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
