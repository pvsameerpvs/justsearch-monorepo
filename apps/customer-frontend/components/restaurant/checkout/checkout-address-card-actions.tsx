import Link from 'next/link';
import { ChevronRight, MapPin } from 'lucide-react';

interface CheckoutAddressCardActionsProps {
  onOpenAddressBook?: () => void;
  children: React.ReactNode;
}

export function CheckoutAddressCardActions({
  onOpenAddressBook,
  children,
}: CheckoutAddressCardActionsProps) {
  return (
    <>
      <button type="button" onClick={onOpenAddressBook} className="flex w-full items-start gap-4 rounded-[24px] border border-[rgb(var(--border)/0.66)] bg-[rgb(var(--card-surface-muted)/0.72)] px-4 py-4 text-left transition-colors hover:bg-[rgb(var(--brand-soft)/0.16)]">
        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--brand-soft)/0.4)] text-[rgb(var(--brand))]">
          <MapPin className="h-5 w-5" />
        </div>
        {children}
        <ChevronRight className="mt-2 h-5 w-5 shrink-0 text-[rgb(var(--muted))]" />
      </button>
      <div className="mt-4 flex justify-end">
        <Link href="/profile/addresses" className="text-[12px] font-semibold text-[rgb(var(--brand))] transition-opacity hover:opacity-80">Manage addresses</Link>
      </div>
    </>
  );
}
