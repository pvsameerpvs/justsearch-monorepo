export function CheckoutAddressCardBadge({ count }: { count: number }) {
  return (
    <span className="rounded-full bg-[rgb(var(--brand-soft)/0.3)] px-3 py-1 text-[11px] font-semibold text-[rgb(var(--brand))]">
      {count} saved
    </span>
  );
}
