import { Ticket, Type, FileText } from "lucide-react";
import { FormField } from "./voucher-form-field";
import type { VoucherFormData } from "./types/voucher.types";

interface BasicFieldsProps {
  form: VoucherFormData;
  errors: Record<string, string>;
  onChange: <K extends keyof VoucherFormData>(field: K, value: VoucherFormData[K]) => void;
}

export function VoucherFormBasicFields({ form, errors, onChange }: BasicFieldsProps) {
  return (
    <div className="space-y-3">
      <FormField label="Voucher Code" icon={Ticket} error={errors.code}>
        <input
          value={form.code}
          onChange={(e) => onChange("code", e.target.value.toUpperCase())}
          placeholder="e.g. WELCOME20"
          className={`elegant-input w-full font-mono uppercase ${errors.code ? "border-red-300" : ""}`}
        />
      </FormField>

      <FormField label="Title" icon={Type} error={errors.title}>
        <input
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="e.g. Welcome Offer"
          className={`elegant-input w-full ${errors.title ? "border-red-300" : ""}`}
        />
      </FormField>

      <FormField label="Description" icon={FileText}>
        <textarea
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Brief description visible to customers"
          rows={2}
          className="elegant-input w-full resize-none"
        />
      </FormField>
    </div>
  );
}
