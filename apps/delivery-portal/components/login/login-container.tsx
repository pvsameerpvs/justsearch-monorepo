"use client";

import { motion } from "framer-motion";
import { useLoginForm } from "./hooks/use-login-form";
import { LoginLogo } from "./parts/login-logo";
import { LoginFormPresenter } from "./login-form-presenter";
import { useRestaurantQuery } from "@/lib/hooks/use-restaurant-query";

export function LoginContainer() {
  const {
    subdomain,
    setSubdomain,
    subdomainError,
    username,
    setUsername,
    password,
    setPassword,
    error,
    isLoading,
    onSubmit,
  } = useLoginForm();

  // Fetch real restaurant logo from API (no auth needed)
  const { logoUrl } = useRestaurantQuery();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <LoginLogo subdomain={subdomain} logoUrl={logoUrl} />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <LoginFormPresenter
            subdomain={subdomain}
            onSubdomainChange={setSubdomain}
            subdomainError={subdomainError}
            username={username}
            onUsernameChange={setUsername}
            password={password}
            onPasswordChange={setPassword}
            error={error}
            isLoading={isLoading}
            showUsernameHint={true}
            onSubmit={onSubmit}
          />
        </motion.div>
      </div>
    </div>
  );
}
