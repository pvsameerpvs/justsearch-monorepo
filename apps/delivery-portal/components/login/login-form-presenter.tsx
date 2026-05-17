import { Globe } from "lucide-react";
import { LoginUsernameInput } from "./parts/login-username-input";
import { PasswordInput } from "./parts/password-input";
import { LoginErrorMessage } from "./parts/login-error-message";
import { LoginSubmitButton } from "./parts/login-submit-button";

interface LoginFormPresenterProps {
  subdomain: string;
  onSubdomainChange: (value: string) => void;
  subdomainError: string | null;
  username: string;
  onUsernameChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  error: string | null;
  isLoading: boolean;
  showUsernameHint: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginFormPresenter({
  subdomain,
  onSubdomainChange,
  subdomainError,
  username,
  onUsernameChange,
  password,
  onPasswordChange,
  error,
  isLoading,
  showUsernameHint,
  onSubmit,
}: LoginFormPresenterProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="elegant-card p-5 space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Restaurant Subdomain
          </label>
          <div className="relative mt-1">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={subdomain}
              onChange={(e) => onSubdomainChange(e.target.value)}
              placeholder="e.g. naples"
              className="elegant-input w-full pl-10"
              autoComplete="off"
            />
          </div>
          {subdomainError && (
            <p className="mt-1 text-[10px] text-red-500">{subdomainError}</p>
          )}
          <p className="mt-1 text-[10px] text-slate-400">
            The slug from your restaurant dashboard (e.g. naples)
          </p>
        </div>

        <LoginUsernameInput
          value={username}
          onChange={onUsernameChange}
          showHint={showUsernameHint}
        />

        <PasswordInput value={password} onChange={onPasswordChange} />

        {error && <LoginErrorMessage message={error} />}

        <LoginSubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
}
