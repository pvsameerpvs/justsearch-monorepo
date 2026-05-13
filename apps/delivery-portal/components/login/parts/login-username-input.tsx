interface LoginUsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  showHint: boolean;
}

export function LoginUsernameInput({ value, onChange, showHint }: LoginUsernameInputProps) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Username
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. aem-101"
        className="elegant-input w-full mt-1"
        autoComplete="username"
      />
      {showHint && (
        <p className="mt-1 text-[10px] text-slate-400">Found on your driver card</p>
      )}
    </div>
  );
}
