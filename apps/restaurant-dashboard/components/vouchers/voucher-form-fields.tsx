import { Control } from "react-hook-form";
import { VoucherFormBasicFields } from "./voucher-form-basic-fields";
import { VoucherFormDiscountFields } from "./voucher-form-discount-fields";
import { VoucherFormMetaFields } from "./voucher-form-meta-fields";
import type { VoucherFormData } from "@/lib/validations/dashboard.schema";

interface VoucherFormFieldsProps {
  control: Control<VoucherFormData>;
}

export function VoucherFormFields({ control }: VoucherFormFieldsProps) {
  return (
    <div className="space-y-4">
      <VoucherFormBasicFields control={control} />
      <VoucherFormDiscountFields control={control} />
      <VoucherFormMetaFields control={control} />
    </div>
  );
}
