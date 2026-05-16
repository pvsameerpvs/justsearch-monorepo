import Link from 'next/link';
import { EmptyState } from '@/components/shared/empty-state';

export function ProfileOrderDetailsEmpty() {
  return (
    <EmptyState
      title="Order not found"
      description="We could not find that order summary in this restaurant profile."
      className="rounded-[24px] p-6 sm:p-8"
      action={
        <Link
          href="/profile/orders"
          className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--brand))] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Back to orders
        </Link>
      }
    />
  );
}
