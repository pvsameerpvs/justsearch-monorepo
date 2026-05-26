"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDriverAuth } from "@/lib/driver-auth-store";

const loginSchema = z.object({
  subdomain: z.string().min(1, "Restaurant subdomain is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const router = useRouter();
  const { login } = useDriverAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      subdomain: "",
      username: "",
      password: "",
    },
  });

  // Hydrate subdomain from localStorage after mount to avoid hydration mismatch.
  useEffect(() => {
    const saved = localStorage.getItem('restaurant-slug');
    if (saved) {
      form.setValue('subdomain', saved);
    }
  }, [form]);

  const subdomain = form.watch("subdomain");
  const username = form.watch("username");
  const password = form.watch("password");

  // Save subdomain to localStorage as user types so logo API can fetch
  useEffect(() => {
    const trimmed = subdomain?.trim().toLowerCase();
    if (trimmed) {
      localStorage.setItem('restaurant-slug', trimmed);
    }
  }, [subdomain]);

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      localStorage.setItem('restaurant-slug', data.subdomain.trim().toLowerCase());
      const result = await login(data.username.trim(), data.password);
      if (result.success) {
        router.push("/");
      } else {
        form.setError("root", { message: result.error ?? "Invalid username or password" });
      }
    },
    [login, router, form]
  );

  return {
    subdomain,
    setSubdomain: (v: string) => form.setValue("subdomain", v),
    username,
    setUsername: (v: string) => form.setValue("username", v),
    password,
    setPassword: (v: string) => form.setValue("password", v),
    error: form.formState.errors.root?.message ?? null,
    subdomainError: form.formState.errors.subdomain?.message ?? null,
    isLoading: form.formState.isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
