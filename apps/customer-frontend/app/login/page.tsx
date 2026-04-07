import { AuthShell } from '@/components/auth/auth-shell';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Log in with OTP or password so the customer wallet and game progress can be tied to the current guest."
      badge="Customer login"
    >
      <LoginForm />
    </AuthShell>
  );
}

