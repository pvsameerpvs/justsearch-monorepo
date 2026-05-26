"use client";

import { useVoucherForm } from "./hooks/use-voucher-form";
import { VoucherFormFields } from "./voucher-form-fields";
import type { VoucherFormData } from "@/lib/validations/dashboard.schema";
import type { Voucher } from "./types/voucher.types";

interface VoucherFormModalProps {
  voucher: Voucher | null;
  onSave: (data: VoucherFormData) => void;
  onCancel: () => void;
}

export function VoucherFormModal({ voucher, onSave, onCancel }: VoucherFormModalProps) {
  const form = useVoucherForm(voucher);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="elegant-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">
              {voucher ? "Edit Voucher" : "Create Voucher"}
            </p>
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <VoucherFormFields control={form.control} />

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onCancel} className="elegant-btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="elegant-btn-primary flex-1"
            >
              {voucher ? "Save Changes" : "Create Voucher"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
