import { User } from "lucide-react";

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
      <div className="relative mt-1.5">
        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. aem-101"
          className="elegant-input w-full pl-10"
          autoComplete="username"
        />
      </div>
      {showHint && (
        <p className="mt-1 text-[10px] text-slate-400">Found on your driver card</p>
      )}
    </div>
  );
}
