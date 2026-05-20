type CancelReasonFooterProps = {
  canConfirm: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function CancelReasonFooter({ canConfirm, onClose, onConfirm }: CancelReasonFooterProps) {
  return (
    <div className="mt-5 flex gap-2">
      <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">
        Back
      </button>
      <button
        onClick={() => canConfirm && onConfirm()}
        disabled={!canConfirm}
        className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50"
      >
        Confirm Cancel
      </button>
    </div>
  );
}
