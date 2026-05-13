import { Percent, Banknote, ShoppingCart } from "lucide-react";
import { FormField } from "./voucher-form-field";
import type { VoucherFormData, VoucherType } from "./types/voucher.types";

interface DiscountFieldsProps {
  form: VoucherFormData;
  errors: Record<string, string>;
  onChange: <K extends keyof VoucherFormData>(field: K, value: VoucherFormData[K]) => void;
}

const TYPE_OPTIONS = [
  { value: "percentage" as VoucherType, label: "Percentage Discount" },
  { value: "fixed" as VoucherType, label: "Fixed Amount (AED)" },
];

export function VoucherFormDiscountFields({ form, errors, onChange }: DiscountFieldsProps) {
  const isPercentage = form.type === "percentage";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Discount Type" icon={Percent}>
          <select
            value={form.type}
            onChange={(e) => onChange("type", e.target.value as VoucherType)}
            className="elegant-input w-full"
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </FormField>

        <FormField label={isPercentage ? "Discount %" : "Amount (AED)"} icon={Banknote} error={errors.value}>
          <input
            type="number"
            min={1}
            value={form.value}
            onChange={(e) => onChange("value", Number(e.target.value))}
            placeholder={isPercentage ? "20" : "50"}
            className={`elegant-input w-full ${errors.value ? "border-red-300" : ""}`}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label={isPercentage ? "Max Cap (AED)" : "—"} icon={Banknote}>
          <input
            type="number"
            min={0}
            value={form.maxDiscount}
            onChange={(e) => onChange("maxDiscount", Number(e.target.value))}
            placeholder="30"
            disabled={!isPercentage}
            className="elegant-input w-full disabled:opacity-50"
          />
        </FormField>

        <FormField label="Min Order (AED)" icon={ShoppingCart}>
          <input
            type="number"
            min={0}
            value={form.minOrderValue}
            onChange={(e) => onChange("minOrderValue", Number(e.target.value))}
            placeholder="50"
            className="elegant-input w-full"
          />
        </FormField>
      </div>
    </div>
  );
}
