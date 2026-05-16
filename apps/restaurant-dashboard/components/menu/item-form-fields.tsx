"use client";

import type { ComponentPropsWithoutRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { ImageUpload } from "@/components/ui/image-upload";

export const itemEditorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().max(200, "Description too long").optional(),
  price: z.coerce.number().positive("Price must be positive"),
  currency: z.string().default("AED"),
  image: z.string().optional(),
  tags: z.string().optional(),
  subcategory: z.string().optional(),
  isAvailable: z.boolean().default(true),
  isVeg: z.boolean().default(false),
});

export type ItemEditorFormData = z.infer<typeof itemEditorSchema>;

interface ItemFormFieldsProps {
  form: UseFormReturn<ItemEditorFormData>;
}

export function ItemFormFields({ form }: ItemFormFieldsProps) {
  const { register, formState: { errors }, watch, setValue } = form;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message} {...register("name")} placeholder="Item name" />
        <Field label="Price" error={errors.price?.message} {...register("price", { valueAsNumber: true })} type="number" placeholder="0.00" />
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
        <textarea {...register("description")} rows={2} className="elegant-input w-full mt-1" />
        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Currency" {...register("currency")} placeholder="AED" />
        <Field label="Subcategory" {...register("subcategory")} placeholder="e.g. Chef Selection" />
      </div>
      <ImageUpload value={watch("image") ?? ""} onChange={(v) => setValue("image", v)} label="Item Image" aspect="landscape" />
      <Field label="Tags (comma separated)" {...register("tags")} placeholder="Popular, Vegetarian, Spicy" />
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <input {...register("isAvailable")} type="checkbox" className="h-4 w-4 rounded" />
          <span className="text-sm font-medium text-slate-700">Item is available</span>
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
          <input {...register("isVeg")} type="checkbox" className="h-4 w-4 rounded accent-emerald-600" />
          <span className="text-sm font-medium text-emerald-800">Pure Veg</span>
        </label>
      </div>
    </div>
  );
}

function Field({ label, error, ...props }: { label: string; error?: string } & ComponentPropsWithoutRef<"input">) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</label>
      <input {...props} className="elegant-input w-full mt-1" />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
