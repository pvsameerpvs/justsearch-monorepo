import { Check, X, Ticket, CheckCircle2 } from 'lucide-react';

export function ValidationResultCard({
  result,
}: {
  result: {
    valid: boolean;
    message: string;
    voucher?: { title: string; discountLabel: string };
  };
}) {
  return (
    <div className={`mt-4 rounded-xl border p-4 ${
      result.valid
        ? 'border-emerald-200 bg-emerald-50/50'
        : 'border-red-200 bg-red-50/50'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
          result.valid ? 'bg-emerald-100' : 'bg-red-100'
        }`}>
          {result.valid ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <X className="h-5 w-5 text-red-600" />
          )}
        </div>
        <div>
          <p className={`font-bold ${result.valid ? 'text-emerald-800' : 'text-red-800'}`}>
            {result.message}
          </p>
          {result.voucher && (
            <div className="mt-1">
              <p className="text-sm font-bold text-emerald-700">{result.voucher.title}</p>
              <p className="text-sm text-emerald-600">{result.voucher.discountLabel}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function VoucherListItem({
  voucher,
}: {
  voucher: {
    id: string;
    code: string;
    title: string;
    discountLabel: string;
    expiryLabel: string;
  };
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
        <Ticket className="h-6 w-6 text-amber-500" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-slate-900">{voucher.title}</p>
        <p className="text-xs text-slate-500">{voucher.expiryLabel}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-mono font-bold text-amber-600">{voucher.code}</p>
        <p className="text-xs font-bold text-slate-700">{voucher.discountLabel}</p>
      </div>
    </div>
  );
}
