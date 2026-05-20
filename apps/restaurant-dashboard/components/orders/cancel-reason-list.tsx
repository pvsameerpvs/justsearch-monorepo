"use client";

const PRESET_REASONS = [
  "Item not available today",
  "Driver not available",
  "Restaurant is closed",
  "Too far to deliver",
  "Customer request",
];

type CancelReasonListProps = {
  selected: string;
  custom: string;
  onSelect: (reason: string) => void;
  onCustomChange: (val: string) => void;
};

export function CancelReasonList({ selected, custom, onSelect, onCustomChange }: CancelReasonListProps) {
  const isCustom = selected === 'custom';

  return (
    <div className="mt-4 space-y-2">
      {PRESET_REASONS.map((reason) => (
        <button
          key={reason}
          onClick={() => onSelect(reason)}
          className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
            selected === reason ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {reason}
        </button>
      ))}
      <button
        onClick={() => onSelect('custom')}
        className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
          isCustom ? 'border-red-300 bg-red-50 text-red-700' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
        }`}
      >
        Other reason...
      </button>

      {isCustom && (
        <textarea
          value={custom}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="Please specify the reason..."
          rows={3}
          className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-red-300"
        />
      )}
    </div>
  );
}
