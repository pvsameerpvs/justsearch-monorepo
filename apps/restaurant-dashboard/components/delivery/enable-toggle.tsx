export function EnableToggle({ isActive, onToggle }: { isActive: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        isActive ? "bg-emerald-500" : "bg-slate-300"
      }`}
      aria-label={isActive ? "Disable agent" : "Enable agent"}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
          isActive ? "translate-x-[18px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}
