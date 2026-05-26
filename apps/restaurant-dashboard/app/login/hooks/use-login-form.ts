"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDashboardAuth } from "@/lib/auth-context";

export function useLoginForm(serverSubdomain?: string) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [subdomain, setSubdomain] = useState(serverSubdomain || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useDashboardAuth();
  const router = useRouter();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (subdomain) {
      localStorage.setItem("restaurant-slug", subdomain.trim().toLowerCase());
    }
    setLoading(true);
    const success = await login(username, password);
    if (success) router.push("/");
    else setError("Invalid username or password");
    setLoading(false);
  }, [subdomain, username, password, login, router]);

  return {
    username, setUsername,
    password, setPassword,
    subdomain, setSubdomain,
    error, setError, loading,
    showForgot, setShowForgot,
    showPass, setShowPass,
    handleSubmit,
  };
}
