type StatusCardProps = {
  code: string;
  headline: string;
  supportText: string;
  isCancelled: boolean;
};

export function CheckoutStatusCard({ code, headline, supportText, isCancelled }: StatusCardProps) {
  return (
    <div className={`rounded-[24px] border p-5 sm:p-6 ${isCancelled ? 'border-red-200 bg-red-50' : 'border-[rgb(var(--border)/0.56)] bg-white'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-lg font-bold ${isCancelled ? 'text-red-700' : 'text-[rgb(var(--ink))]'}`}>{headline}</p>
          <p className={`mt-1 text-sm ${isCancelled ? 'text-red-600' : 'text-slate-500'}`}>{supportText}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${isCancelled ? 'bg-red-100 text-red-600' : 'bg-[rgb(var(--brand-soft))] text-[rgb(var(--brand))]'}`}>
          {code}
        </span>
      </div>
    </div>
  );
}
