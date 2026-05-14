type AdSkipButtonProps = {
  isLastAd: boolean;
  onSkip: () => void;
  completeLabel?: string;
};

export function AdSkipButton({ isLastAd, onSkip, completeLabel = "Continue" }: AdSkipButtonProps) {
  return (
    <div className="border-t border-slate-100 p-4">
      <button
        type="button"
        onClick={onSkip}
        className="w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
      >
        {isLastAd ? completeLabel : "Skip Ad"}
      </button>
    </div>
  );
}
