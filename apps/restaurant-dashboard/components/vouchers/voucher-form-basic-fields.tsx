"use client";
import { Ticket, Type, FileText } from "lucide-react";
import { Controller } from "react-hook-form";
import { FormField } from "./voucher-form-field";
import type { VoucherFormData } from "@/lib/validations/dashboard.schema";
import type { Control } from "react-hook-form";

interface Props { control: Control<VoucherFormData>; }

export function VoucherFormBasicFields({ control }: Props) {
  return (
    <div className="space-y-3">
      <Controller name="code" control={control}
        render={({ field, fieldState }) => (
          <FormField label="Voucher Code" icon={Ticket} error={fieldState.error?.message}>
            <input {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())}
              placeholder="e.g. WELCOME20" className={`elegant-input w-full font-mono uppercase ${fieldState.error ? "border-red-300" : ""}`} />
          </FormField>
        )} />
      <Controller name="title" control={control}
        render={({ field, fieldState }) => (
          <FormField label="Title" icon={Type} error={fieldState.error?.message}>
            <input {...field} placeholder="e.g. Welcome Offer" className={`elegant-input w-full ${fieldState.error ? "border-red-300" : ""}`} />
          </FormField>
        )} />
      <Controller name="description" control={control}
        render={({ field }) => (
          <FormField label="Description" icon={FileText}>
            <textarea {...field} value={field.value ?? ""} placeholder="Brief description visible to customers" rows={2} className="elegant-input w-full resize-none" />
          </FormField>
        )} />
    </div>
  );
}
