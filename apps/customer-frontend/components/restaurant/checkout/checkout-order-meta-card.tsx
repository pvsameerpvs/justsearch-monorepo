interface CheckoutOrderMetaCardProps {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string | null;
  notes: string | null;
  createdAt: string;
}

export function CheckoutOrderMetaCard({
  customerName,
  customerPhone,
  deliveryAddress,
  notes,
  createdAt,
}: CheckoutOrderMetaCardProps) {
  return (
    <div className="rounded-[24px] border border-[rgb(var(--border)/0.56)] bg-white p-5 sm:p-6">
      <p className="text-sm font-semibold text-[rgb(var(--ink))]">Order details</p>
      <div className="mt-2 space-y-1 text-sm text-[rgb(var(--muted))]">
        <p>
          <span className="font-medium text-[rgb(var(--ink))]">Customer:</span> {customerName}
        </p>
        <p>
          <span className="font-medium text-[rgb(var(--ink))]">Phone:</span> {customerPhone}
        </p>
        <p>
          <span className="font-medium text-[rgb(var(--ink))]">Date:</span>{' '}
          {new Date(createdAt).toLocaleString()}
        </p>
        {deliveryAddress && (
          <p>
            <span className="font-medium text-[rgb(var(--ink))]">Address:</span>{' '}
            {deliveryAddress}
          </p>
        )}
        {notes && (
          <p>
            <span className="font-medium text-[rgb(var(--ink))]">Notes:</span> {notes}
          </p>
        )}
      </div>
    </div>
  );
}
