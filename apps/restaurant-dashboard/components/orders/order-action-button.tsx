import { ArrowRight } from "lucide-react";

interface OrderActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  icon: React.ReactNode;
  label: string;
  gradient?: string;
  textColor?: string;
  borderTop?: boolean;
}

export function OrderActionButton({ onClick, icon, label, gradient, textColor, borderTop }: OrderActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group w-full py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
        gradient
          ? `text-white ${gradient} shadow-sm`
          : `${textColor || "text-slate-700"} bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200`
      } ${borderTop ? "border-t border-slate-100/80" : ""}`}
    >
      {icon}
      {label}
      <ArrowRight className="h-3.5 w-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}
