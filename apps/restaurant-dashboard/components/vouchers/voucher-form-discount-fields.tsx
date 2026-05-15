"use client";
import { Percent, Banknote, ShoppingCart } from "lucide-react";
import { Controller, useWatch } from "react-hook-form";
import { FormField } from "./voucher-form-field";
import type { VoucherFormData } from "@/lib/validations/dashboard.schema";
import type { Control } from "react-hook-form";

interface DiscountFieldsProps { control: Control<VoucherFormData> }

const TYPE_OPTIONS = [
  { value: "percentage", label: "Percentage Discount" },
  { value: "fixed", label: "Fixed Amount (AED)" },
];

export function VoucherFormDiscountFields({ control }: DiscountFieldsProps) {
  const isPercentage = useWatch({ control, name: "type" }) === "percentage";
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Controller name="type" control={control} render={({ field }) => (
          <FormField label="Discount Type" icon={Percent}>
            <select {...field} className="elegant-input w-full">
              {TYPE_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
          </FormField>
        )} />
        <Controller name="value" control={control} render={({ field, fieldState }) => (
          <FormField label={isPercentage ? "Discount %" : "Amount (AED)"} icon={Banknote} error={fieldState.error?.message}>
            <input type="number" min={1} {...field} onChange={(e) => field.onChange(Number(e.target.value))} placeholder={isPercentage ? "20" : "50"} className={`elegant-input w-full ${fieldState.error ? "border-red-300" : ""}`} />
          </FormField>
        )} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Controller name="maxDiscount" control={control} render={({ field }) => (
          <FormField label={isPercentage ? "Max Cap (AED)" : "—"} icon={Banknote}>
            <input type="number" min={0} {...field} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="30" disabled={!isPercentage} className="elegant-input w-full disabled:opacity-50" />
          </FormField>
        )} />
        <Controller name="minOrderValue" control={control} render={({ field }) => (
          <FormField label="Min Order (AED)" icon={ShoppingCart}>
            <input type="number" min={0} {...field} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="50" className="elegant-input w-full" />
          </FormField>
        )} />
      </div>
    </div>
  );
}
