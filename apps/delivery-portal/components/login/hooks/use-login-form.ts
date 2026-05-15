"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDriverAuth } from "@/lib/driver-auth-store";

export function useLoginForm() {
  const router = useRouter();
  const { login } = useDriverAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);

      const success = await login(username.trim(), password);
      if (success) {
        router.push("/");
      } else {
        setError("Invalid username or password");
      }
      setIsLoading(false);
    },
    [username, password, login, router]
  );

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isLoading,
    onSubmit,
  };
}
