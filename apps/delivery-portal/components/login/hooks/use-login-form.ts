"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDriverAuth } from "@/lib/driver-auth-store";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function useLoginForm() {
  const router = useRouter();
  const { login } = useDriverAuth();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const username = form.watch("username");
  const password = form.watch("password");

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      const success = await login(data.username.trim(), data.password);
      if (success) {
        router.push("/");
      } else {
        form.setError("root", { message: "Invalid username or password" });
      }
    },
    [login, router, form]
  );

  return {
    username,
    setUsername: (v: string) => form.setValue("username", v),
    password,
    setPassword: (v: string) => form.setValue("password", v),
    error: form.formState.errors.root?.message ?? null,
    isLoading: form.formState.isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
