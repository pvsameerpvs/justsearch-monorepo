"use client";

import { Hash, CalendarDays } from "lucide-react";
import { Controller } from "react-hook-form";
import { FormField } from "./voucher-form-field";
import type { VoucherFormData } from "@/lib/validations/dashboard.schema";
import type { Control } from "react-hook-form";

interface MetaFieldsProps {
  control: Control<VoucherFormData>;
}

export function VoucherFormMetaFields({ control }: MetaFieldsProps) {
  return (
    <div className="space-y-3">
      <Controller
        name="usageLimit"
        control={control}
        render={({ field, fieldState }) => (
          <FormField label="Usage Limit" icon={Hash} error={fieldState.error?.message}>
            <input
              type="number"
              min={1}
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
              placeholder="100"
              className={`elegant-input w-full ${fieldState.error ? "border-red-300" : ""}`}
            />
          </FormField>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <Controller
          name="startDate"
          control={control}
          render={({ field, fieldState }) => (
            <FormField label="Start Date" icon={CalendarDays} error={fieldState.error?.message}>
              <input
                type="date"
                {...field}
                className={`elegant-input w-full ${fieldState.error ? "border-red-300" : ""}`}
              />
            </FormField>
          )}
        />

        <Controller
          name="endDate"
          control={control}
          render={({ field, fieldState }) => (
            <FormField label="End Date" icon={CalendarDays} error={fieldState.error?.message}>
              <input
                type="date"
                {...field}
                className={`elegant-input w-full ${fieldState.error ? "border-red-300" : ""}`}
              />
            </FormField>
          )}
        />
      </div>
    </div>
  );
}
