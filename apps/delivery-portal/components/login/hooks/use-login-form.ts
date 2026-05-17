"use client";

import { useCallback } from "react";
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
      subdomain: typeof window !== 'undefined'
        ? localStorage.getItem('restaurant-slug') || ''
        : '',
      username: "",
      password: "",
    },
  });

  const subdomain = form.watch("subdomain");
  const username = form.watch("username");
  const password = form.watch("password");

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
