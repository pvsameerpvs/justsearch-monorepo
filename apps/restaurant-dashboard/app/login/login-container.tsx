"use client";

import { useEffect } from "react";
import { useLoginForm } from "./hooks/use-login-form";
import { LoginFormPresenter } from "./login-form-presenter";
import { LoginForgotPresenter } from "./login-forgot-presenter";
import { LoginLogo } from "./login-logo";

export function LoginContainer({
  restaurantName,
  logoUrl,
  subdomain: serverSubdomain,
}: {
  restaurantName?: string;
  logoUrl?: string;
  subdomain?: string;
}) {
  const form = useLoginForm();

  useEffect(() => {
    const saved = localStorage.getItem("restaurant-slug") || "";
    form.setSubdomain(serverSubdomain || saved);
  }, [serverSubdomain]);

  const displayName = restaurantName || "Restaurant";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-amber-50/30 p-4">
      <div className="w-full max-w-sm space-y-6">
        <LoginLogo name={displayName} logoUrl={logoUrl} />

        {!form.showForgot ? (
          <LoginFormPresenter
            username={form.username}
            password={form.password}
            subdomain={form.subdomain}
            error={form.error}
            loading={form.loading}
            showPass={form.showPass}
            onUsernameChange={form.setUsername}
            onPasswordChange={form.setPassword}
            onSubdomainChange={form.setSubdomain}
            onTogglePass={() => form.setShowPass(!form.showPass)}
            onSubmit={form.handleSubmit}
            onForgot={() => { form.setShowForgot(true); form.setError(""); }}
          />
        ) : (
          <LoginForgotPresenter onBack={() => form.setShowForgot(false)} />
        )}
      </div>
    </div>
  );
}
