type CheckoutAddAddressFooterProps = {
  onCancel: () => void;
  isValid: boolean;
};

export function CheckoutAddAddressFooter({ onCancel, isValid }: CheckoutAddAddressFooterProps) {
  return (
    <div className="flex gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-full border border-[rgb(var(--border)/0.72)] px-4 py-3 text-sm font-semibold text-[rgb(var(--muted))] transition-colors hover:bg-[rgb(var(--card-surface-muted)/0.6)]"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={!isValid}
        className="flex-[1.3] rounded-full bg-[rgb(var(--brand))] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,118,110,0.22)] transition-transform active:scale-[0.99] disabled:opacity-50"
      >
        Save address
      </button>
    </div>
  );
}
