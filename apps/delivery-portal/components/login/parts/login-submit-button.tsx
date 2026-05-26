import { LogIn } from "lucide-react";
import { motion } from "framer-motion";

interface LoginSubmitButtonProps {
  isLoading: boolean;
}

export function LoginSubmitButton({ isLoading }: LoginSubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      disabled={isLoading}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 shadow-sm shadow-emerald-100"
    >
      <LogIn className="h-4 w-4" />
      {isLoading ? "Signing in..." : "Sign In"}
    </motion.button>
  );
}
