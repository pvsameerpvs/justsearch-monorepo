import { LoginUsernameInput } from "./parts/login-username-input";
import { PasswordInput } from "./parts/password-input";
import { LoginErrorMessage } from "./parts/login-error-message";
import { LoginSubmitButton } from "./parts/login-submit-button";

interface LoginFormPresenterProps {
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
