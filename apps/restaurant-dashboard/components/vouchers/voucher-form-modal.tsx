"use client";

import { useVoucherForm } from "./hooks/use-voucher-form";
import type { Voucher, VoucherFormData } from "./types/voucher.types";
import { VoucherFormFields } from "./voucher-form-fields";

interface VoucherFormModalProps {
  voucher: Voucher | null;
  onSave: (data: VoucherFormData) => void;
  onCancel: () => void;
}

export function VoucherFormModal({ voucher, onSave, onCancel }: VoucherFormModalProps) {
  const { form, setField, errors, onSubmit } = useVoucherForm(voucher, onSave);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="elegant-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">
              {voucher ? "Edit Voucher" : "Create Voucher"}
            </p>
            <button
              onClick={onCancel}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <VoucherFormFields form={form} errors={errors} onChange={setField} />

          <div className="flex gap-2 pt-1">
            <button onClick={onCancel} className="elegant-btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={onSubmit} className="elegant-btn-primary flex-1">
              {voucher ? "Save Changes" : "Create Voucher"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
