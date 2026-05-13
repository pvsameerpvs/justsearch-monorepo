import { MapPin, Plus } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

interface AddressSelectorEmptyProps {
  onUseCurrentLocation: () => void;
  onAddAddress: () => void;
}

export function AddressSelectorEmpty({ onUseCurrentLocation, onAddAddress }: AddressSelectorEmptyProps) {
  return (
    <EmptyState
      title="No saved addresses yet"
      description="Add an address in your profile to use it quickly at checkout."
      className="rounded-[24px] p-6"
      action={
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={onUseCurrentLocation}
            className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--brand)/0.3)] bg-white px-4 py-2.5 text-sm font-semibold text-[rgb(var(--brand))]"
          >
            <MapPin className="h-4 w-4" />
            Choose location on map
          </button>
          <button
            type="button"
            onClick={onAddAddress}
            className="inline-flex items-center gap-2 rounded-full bg-[rgb(var(--brand))] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Add delivery address
          </button>
        </div>
      }
    />
  );
}
