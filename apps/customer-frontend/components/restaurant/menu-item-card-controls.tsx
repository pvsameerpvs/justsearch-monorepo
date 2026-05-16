interface CartQuantityControlsProps {
  itemId: string;
  quantity: number;
  onUpdate: (id: string, quantity: number) => void;
  size?: 'sm' | 'md';
}

export function CartQuantityControls({ itemId, quantity, onUpdate, size = 'md' }: CartQuantityControlsProps) {
  const isSm = size === 'sm';
  return (
    <div className={`inline-flex items-center rounded-full ${isSm ? 'bg-white p-1 shadow-sm' : 'bg-[rgb(var(--card-surface-muted)/0.9)] p-1'}`}>
      <button
        type="button"
        onClick={() => onUpdate(itemId, quantity - 1)}
        className={`flex items-center justify-center rounded-full font-semibold text-[rgb(var(--ink))] ${isSm ? 'h-8 w-8 text-lg' : 'h-9 w-9 text-lg'}`}
      >
        -
      </button>
      <span className={`text-center font-bold text-[rgb(var(--ink))] ${isSm ? 'min-w-[1.75rem] text-sm' : 'min-w-[2rem] text-sm'}`}>
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onUpdate(itemId, quantity + 1)}
        className={`flex items-center justify-center rounded-full font-semibold text-[rgb(var(--ink))] ${isSm ? 'h-8 w-8 text-lg' : 'h-9 w-9 text-lg'}`}
      >
        +
      </button>
    </div>
  );
}
