"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDriverAuth } from "@/lib/driver-auth-store";
import { extractDriverFromHostname, VALID_CREDENTIALS } from "@/lib/login/driver-credentials";

interface UrlInfo {
  restaurantSlug: string | null;
  driverUniqueId: string | null;
}

export function useLoginForm() {
  const router = useRouter();
  const { login } = useDriverAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [urlInfo, setUrlInfo] = useState<UrlInfo>({
    restaurantSlug: null,
    driverUniqueId: null,
  });

  useEffect(() => {
    const info = extractDriverFromHostname();
    setUrlInfo(info);
    if (info.driverUniqueId) {
      setUsername(info.driverUniqueId);
    }
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);

      const normalizedUsername = username.trim().toLowerCase();
      const creds = VALID_CREDENTIALS[normalizedUsername];

      if (!creds || creds.password !== password) {
        setError("Invalid username or password");
        setIsLoading(false);
        return;
      }

      const restaurantSlug = urlInfo.restaurantSlug ?? creds.restaurantSlug;
      login(normalizedUsername, restaurantSlug, creds.name);
      router.push("/");
    },
    [username, password, urlInfo, login, router]
  );

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    isLoading,
    urlInfo,
    onSubmit,
  };
}
