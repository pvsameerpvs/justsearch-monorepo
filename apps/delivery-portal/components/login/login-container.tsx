"use client";

import { useLoginForm } from "./hooks/use-login-form";
import { LoginLogo } from "./parts/login-logo";
import { LoginFormPresenter } from "./login-form-presenter";
import { DemoCredentials } from "./parts/demo-credentials";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <LoginLogo />

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

        <DemoCredentials />
      </div>
    </div>
  );
}
