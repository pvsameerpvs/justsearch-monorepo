"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, X, Lock, User, Trash2 } from "lucide-react";
import { FormInput } from "./restaurant-form-field";
import { deleteRestaurantSchema } from "./restaurant-delete-schema";
import type { DeleteRestaurantFormData } from "./restaurant-delete-schema";
import type { AdminRestaurant } from "@/lib/types/restaurant.types";

interface RestaurantDeleteDialogProps {
  restaurant: AdminRestaurant;
  onConfirm: (username: string, password: string) => Promise<void>;
  onCancel: () => void;
}

export function RestaurantDeleteDialog({ restaurant, onConfirm, onCancel }: RestaurantDeleteDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<DeleteRestaurantFormData>({
    resolver: zodResolver(deleteRestaurantSchema),
    defaultValues: { username: "", password: "", confirmation: "" },
  });

  const { errors } = form.formState;

  const handleSubmit = form.handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      await onConfirm(data.username, data.password);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Delete failed. Please try again.");
    }
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative mx-4 w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Restaurant</h3>
              <p className="text-sm text-slate-500">{restaurant.name}</p>
            </div>
          </div>
          <button onClick={onCancel} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          This will permanently delete <strong>{restaurant.name}</strong> and all associated data including menus, orders,
          users, staff, and loyalty records. This action <strong>cannot be undone</strong>.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
              <p className="font-bold">{submitError}</p>
              {submitError.includes('Cannot reach') && (
                <p className="mt-1 text-[11px] opacity-80">The delete endpoint may not be ready on the backend yet.</p>
              )}
            </div>
          )}

          <FormInput label="Admin Username" icon={User} {...form.register("username")} error={errors.username?.message} placeholder="Enter your username" />
          <FormInput label="Admin Password" icon={Lock} type="password" {...form.register("password")} error={errors.password?.message} placeholder="Enter your password" />
          <FormInput
            label='Type "delete this restaurant" to confirm'
            icon={Trash2}
            {...form.register("confirmation")}
            error={errors.confirmation?.message}
            placeholder="delete this restaurant"
          />

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              {form.formState.isSubmitting ? "Deleting..." : "Delete Restaurant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
