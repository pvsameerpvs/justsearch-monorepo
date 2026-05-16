"use client";

type Props = {
  address: string;
  details: string;
  onAddressChange: (value: string) => void;
  onDetailsChange: (value: string) => void;
};

export function CheckoutAddressFormFields({ address, details, onAddressChange, onDetailsChange }: Props) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
          Address
        </p>
        <textarea
          rows={3}
          value={address}
          onChange={(event) => onAddressChange(event.target.value)}
          placeholder="Area, street, building..."
          className="mt-2 w-full resize-none rounded-[22px] border border-[rgb(var(--border)/0.72)] bg-[rgb(var(--card-surface-muted)/0.6)] px-4 py-3 text-sm font-medium text-[rgb(var(--ink))] outline-none transition-colors focus:border-[rgb(var(--brand)/0.55)]"
        />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
          Details
        </p>
        <input
          value={details}
          onChange={(event) => onDetailsChange(event.target.value)}
          placeholder="Flat, office, landmark"
          className="mt-2 w-full rounded-[18px] border border-[rgb(var(--border)/0.72)] bg-[rgb(var(--card-surface-muted)/0.6)] px-4 py-3 text-sm font-medium text-[rgb(var(--ink))] outline-none transition-colors focus:border-[rgb(var(--brand)/0.55)]"
        />
      </div>
    </div>
  );
}
