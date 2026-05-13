import { LogIn } from "lucide-react";

interface LoginSubmitButtonProps {
  isLoading: boolean;
}

export function LoginSubmitButton({ isLoading }: LoginSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
    >
      <LogIn className="h-4 w-4" />
      {isLoading ? "Signing in..." : "Sign In"}
    </button>
  );
}
