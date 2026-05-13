interface LoginErrorMessageProps {
  message: string;
}

export function LoginErrorMessage({ message }: LoginErrorMessageProps) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-sm text-red-600">
      {message}
    </div>
  );
}
