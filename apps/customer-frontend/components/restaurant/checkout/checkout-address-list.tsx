import { cn } from '@/lib/cn';
import type { SavedAddress } from '../use-address-book';
import type { MapSelection } from './checkout-map-types';
import { isSavedSelected } from './checkout-map-utils';

type CheckoutAddressListProps = {
  pinnedAddress: string;
  filteredAddresses: SavedAddress[];
  selection: MapSelection;
  onSelectPinned: () => void;
  onSelectSaved: (id: string) => void;
};

export function CheckoutAddressList({
  pinnedAddress,
  filteredAddresses,
  selection,
  onSelectPinned,
  onSelectSaved,
}: CheckoutAddressListProps) {
  return (
    <div className="max-h-[220px] space-y-2 overflow-y-auto rounded-[18px] border border-[rgb(var(--border)/0.68)] bg-white p-2.5">
      <button
        type="button"
        onClick={onSelectPinned}
        className={cn(
          'flex w-full items-start justify-between gap-3 rounded-[14px] px-3 py-3 text-left',
          selection.type === 'pinned' ? 'bg-[rgb(var(--brand-soft)/0.3)]' : 'hover:bg-[rgb(var(--card-surface-muted)/0.5)]',
        )}
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[rgb(var(--ink))]">{pinnedAddress}</p>
          <p className="mt-1 text-[12px] text-[rgb(var(--muted))]">Pinned location</p>
        </div>
        <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[rgb(var(--ink)/0.35)]">
          <span className={cn('h-2.5 w-2.5 rounded-full', selection.type === 'pinned' ? 'bg-[rgb(var(--ink))]' : 'bg-transparent')} />
        </span>
      </button>

      {filteredAddresses.map((address) => (
        <button
          key={address.id}
          type="button"
          onClick={() => onSelectSaved(address.id)}
          className={cn(
            'flex w-full items-start justify-between gap-3 rounded-[14px] px-3 py-3 text-left',
            isSavedSelected(selection, address.id) ? 'bg-[rgb(var(--brand-soft)/0.3)]' : 'hover:bg-[rgb(var(--card-surface-muted)/0.5)]',
          )}
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[rgb(var(--ink))]">{address.address}</p>
            <p className="mt-1 text-[12px] text-[rgb(var(--muted))]">{address.label} · {address.details}</p>
          </div>
          <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[rgb(var(--ink)/0.35)]">
            <span className={cn('h-2.5 w-2.5 rounded-full', isSavedSelected(selection, address.id) ? 'bg-[rgb(var(--ink))]' : 'bg-transparent')} />
          </span>
        </button>
      ))}
    </div>
  );
}
