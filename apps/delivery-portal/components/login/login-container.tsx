"use client";

import { useLoginForm } from "./hooks/use-login-form";
import { LoginLogo } from "./parts/login-logo";
import { LoginDriverBanner } from "./parts/login-driver-banner";
import { LoginFormPresenter } from "./login-form-presenter";
import { DemoCredentials } from "./parts/demo-credentials";

export function LoginContainer() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isLoading,
    urlInfo,
    onSubmit,
  } = useLoginForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <LoginLogo />

        {urlInfo.driverUniqueId && (
          <LoginDriverBanner driverUniqueId={urlInfo.driverUniqueId} />
        )}

        <LoginFormPresenter
          username={username}
          onUsernameChange={setUsername}
          password={password}
          onPasswordChange={setPassword}
          error={error}
          isLoading={isLoading}
          showUsernameHint={!urlInfo.driverUniqueId}
          onSubmit={onSubmit}
        />

        <DemoCredentials />
      </div>
    </div>
  );
}
