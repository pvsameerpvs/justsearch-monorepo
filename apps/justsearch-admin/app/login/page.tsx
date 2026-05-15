"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { useAdminAuth } from "@/lib/auth-store";
import { LoginFormPresenter } from "./login-form-presenter";
import { LoginDemoCredentials } from "./demo-credentials";

export default function AdminLoginPage() {
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">
            <LogIn className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">JustSearch Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to platform admin</p>
        </div>

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

        <LoginDemoCredentials />
      </div>
    </div>
  );
}
