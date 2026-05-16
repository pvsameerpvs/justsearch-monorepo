export interface LoginFormPresenterProps {
  username: string;
  password: string;
  error: string;
  loading: boolean;
  showPass: boolean;
  onUsernameChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onTogglePass: () => void;
  onSubmit: (e: React.FormEvent) => void;
}
