import { VoucherFormBasicFields } from "./voucher-form-basic-fields";
import { VoucherFormDiscountFields } from "./voucher-form-discount-fields";
import { VoucherFormMetaFields } from "./voucher-form-meta-fields";
import type { VoucherFormData } from "./types/voucher.types";

interface VoucherFormFieldsProps {
  form: VoucherFormData;
  errors: Record<string, string>;
  onChange: <K extends keyof VoucherFormData>(field: K, value: VoucherFormData[K]) => void;
}

export function VoucherFormFields({ form, errors, onChange }: VoucherFormFieldsProps) {
  return (
    <div className="space-y-4">
      <VoucherFormBasicFields form={form} errors={errors} onChange={onChange} />
      <VoucherFormDiscountFields form={form} errors={errors} onChange={onChange} />
      <VoucherFormMetaFields form={form} errors={errors} onChange={onChange} />
    </div>
  );
}
