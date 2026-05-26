import { AlertCircle } from "lucide-react";

interface LoginErrorMessageProps {
  message: string;
}

export function LoginErrorMessage({ message }: LoginErrorMessageProps) {
  return (
    <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 flex items-center gap-2">
      <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
      <p className="text-sm text-red-600">{message}</p>
    </div>
  );
}
