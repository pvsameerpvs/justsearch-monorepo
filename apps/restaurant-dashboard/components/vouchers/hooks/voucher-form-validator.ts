import type { VoucherFormData } from "../types/voucher.types";

const MAX_PERCENTAGE = 100;
const MIN_VALUE = 0;

export function validateVoucherForm(form: VoucherFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form.title.trim()) errors.title = "Title is required";
  if (!form.code.trim()) errors.code = "Code is required";
  if (form.value <= MIN_VALUE) errors.value = "Value must be greater than 0";
  if (form.usageLimit <= MIN_VALUE) errors.usageLimit = "Usage limit must be greater than 0";
  if (!form.startDate) errors.startDate = "Start date is required";
  if (!form.endDate) errors.endDate = "End date is required";
  if (form.startDate && form.endDate && form.startDate > form.endDate) {
    errors.endDate = "End date must be after start date";
  }
  if (form.type === "percentage" && form.value > MAX_PERCENTAGE) {
    errors.value = `Percentage cannot exceed ${MAX_PERCENTAGE}%`;
  }
  return errors;
}
