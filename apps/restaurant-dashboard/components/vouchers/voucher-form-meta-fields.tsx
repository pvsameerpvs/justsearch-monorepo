import { Hash, CalendarDays } from "lucide-react";
import { FormField } from "./voucher-form-field";
import type { VoucherFormData } from "./types/voucher.types";

interface MetaFieldsProps {
  form: VoucherFormData;
  errors: Record<string, string>;
  onChange: <K extends keyof VoucherFormData>(field: K, value: VoucherFormData[K]) => void;
}

export function VoucherFormMetaFields({ form, errors, onChange }: MetaFieldsProps) {
  return (
    <div className="space-y-3">
      <FormField label="Usage Limit" icon={Hash} error={errors.usageLimit}>
        <input
          type="number"
          min={1}
          value={form.usageLimit}
          onChange={(e) => onChange("usageLimit", Number(e.target.value))}
          placeholder="100"
          className={`elegant-input w-full ${errors.usageLimit ? "border-red-300" : ""}`}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Start Date" icon={CalendarDays} error={errors.startDate}>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
            className={`elegant-input w-full ${errors.startDate ? "border-red-300" : ""}`}
          />
        </FormField>

        <FormField label="End Date" icon={CalendarDays} error={errors.endDate}>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            className={`elegant-input w-full ${errors.endDate ? "border-red-300" : ""}`}
          />
        </FormField>
      </div>
    </div>
  );
}
