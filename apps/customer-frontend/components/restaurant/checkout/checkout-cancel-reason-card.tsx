import { AlertTriangle } from 'lucide-react';

type Props = {
  reason?: string | null;
};

export function CheckoutCancelReasonCard({ reason }: Props) {
  const display = reason?.trim() || 'The restaurant was unable to fulfil this order.';

  return (
    <div className="rounded-[24px] border border-red-200 bg-red-50 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-500">Reason for cancellation</p>
          <p className="mt-1 text-sm font-semibold text-red-700">{display}</p>
          <p className="mt-1 text-[12px] text-red-500">Please contact the restaurant if you have questions.</p>
        </div>
      </div>
    </div>
  );
}
