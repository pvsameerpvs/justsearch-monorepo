interface ScratchCardToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function ScratchCardToggle({ enabled, onToggle }: ScratchCardToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
        enabled ? 'bg-indigo-600' : 'bg-slate-200'
      }`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
