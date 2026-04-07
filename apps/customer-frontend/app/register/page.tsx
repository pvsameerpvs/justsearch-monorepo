import { AuthShell } from '@/components/auth/auth-shell';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create a guest profile"
      description="Register once, then keep the wallet, points, and rewards tied to the same customer account."
      badge="New account"
    >
      <RegisterForm />
    </AuthShell>
  );
}

