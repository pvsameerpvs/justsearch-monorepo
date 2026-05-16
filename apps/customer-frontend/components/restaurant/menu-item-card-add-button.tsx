import { cn } from '@/lib/cn';

interface AddToCartButtonProps {
  onClick: () => void;
}

export function AddToCartButton({ onClick }: AddToCartButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-11 w-full items-center justify-center rounded-[14px] text-sm font-semibold transition-all',
        'bg-[rgb(var(--brand))] text-white shadow-[0_16px_28px_rgb(var(--brand)/0.2)] hover:brightness-105',
      )}
    >
      Add to Delivery Cart
    </button>
  );
}

interface SmallAddButtonProps {
  onClick: () => void;
}

export function SmallAddButton({ onClick }: SmallAddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl font-semibold text-[rgb(var(--ink))] shadow-[0_10px_24px_rgba(15,23,42,0.14)] transition-all hover:brightness-105"
    >
      +
    </button>
  );
}
