import { Lock, Eye, EyeOff } from "lucide-react";
import { LoginInput } from "./login-input";

export function LoginPasswordInput({
  value,
  onChange,
  showPass,
  onTogglePass,
}: {
  value: string;
  onChange: (val: string) => void;
  showPass: boolean;
  onTogglePass: () => void;
}) {
  return (
    <div className="relative">
      <LoginInput
        icon={<Lock className="h-4 w-4" />}
        type={showPass ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="Enter password"
        required
        className="pr-10"
      />
      <button
        type="button"
        onClick={onTogglePass}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
