import { AlertCircle } from 'lucide-react';

interface VoucherItem { id: string; code: string; type: string; value: number; }
interface Props {
  selectedCode: string;
  vouchers: VoucherItem[];
  onSelect: (code: string) => void;
  onDelete: (id: string) => void;
}

export function ScratchCardVoucherManager({ selectedCode, vouchers, onSelect, onDelete }: Props) {
  const selectedVoucher = vouchers.find((v) => v.code === selectedCode);
  const otherVouchers = vouchers.filter((v) => v.code !== selectedCode);

  if (vouchers.length === 0) return (
    <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
      <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
      <div><p className="text-xs font-bold text-amber-800">No vouchers available</p><p className="text-xs text-amber-700 mt-0.5">Create one using the button above.</p></div>
    </div>
  );

  return (
    <div className="mt-3">
      {selectedVoucher ? (
        <div className="mb-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Selected Voucher</p>
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
            <div><p className="text-xs font-bold text-emerald-900">{selectedVoucher.code}</p>
              <p className="text-[10px] text-emerald-700">{selectedVoucher.type === 'percentage' ? `${selectedVoucher.value}% off` : `AED ${selectedVoucher.value} off`}</p>
            </div>
            <button type="button" onClick={() => onDelete(selectedVoucher.id)} className="text-[10px] font-bold text-red-600 hover:underline">Delete</button>
          </div>
        </div>
      ) : <p className="text-xs text-slate-400 italic mb-2">No voucher selected. Click one below to select.</p>}

      {otherVouchers.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Available Vouchers — Click to Select</p>
          <div className="space-y-1">
            {otherVouchers.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded border border-slate-100 bg-white px-3 py-2">
                <div className="flex items-center gap-2">
                  <input type="radio" name="voucherSelect" onClick={() => onSelect(v.code)} className="cursor-pointer" />
                  <span className="text-xs font-bold text-slate-700">{v.code}</span>
                  <span className="text-[10px] text-slate-400">{v.type === 'percentage' ? `${v.value}% off` : `AED ${v.value} off`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
