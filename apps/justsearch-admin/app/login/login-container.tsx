"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/auth-store";
import { LoginFormPresenter } from "./login-form-presenter";

export function LoginContainer() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAdminAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(username, password);
    if (success) {
      router.push("/");
    } else {
      setError("Invalid username or password");
    }
    setLoading(false);
  };

  return (
    <LoginFormPresenter
      username={username}
      password={password}
      error={error}
      loading={loading}
      showPass={showPass}
      onUsernameChange={setUsername}
      onPasswordChange={setPassword}
      onTogglePass={() => setShowPass(!showPass)}
      onSubmit={handleSubmit}
    />
  );
}
