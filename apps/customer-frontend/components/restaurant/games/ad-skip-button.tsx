type AdSkipButtonProps = {
  isLastAd: boolean;
  onSkip: () => void;
};

export function AdSkipButton({ isLastAd, onSkip }: AdSkipButtonProps) {
  return (
    <div className="border-t border-slate-100 p-4">
      <button
        type="button"
        onClick={onSkip}
        className="w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
      >
        {isLastAd ? 'Play Game' : 'Skip Ad'}
      </button>
    </div>
  );
}
