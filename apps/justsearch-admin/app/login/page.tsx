import { LogIn } from "lucide-react";
import { LoginContainer } from "./login-container";
import { LoginDemoCredentials } from "./demo-credentials";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600">
            <LogIn className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">JustSearch Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to platform admin</p>
        </div>
        <LoginContainer />
        <LoginDemoCredentials />
      </div>
    </div>
  );
}
