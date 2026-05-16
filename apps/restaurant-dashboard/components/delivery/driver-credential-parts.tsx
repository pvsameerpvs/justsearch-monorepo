import { Key, Lock, Copy, Check } from "lucide-react";

interface CredentialRowProps {
  label: string;
  value: string;
  copyKey: string;
  copied: string | null;
  onCopy: (text: string, key: string) => void;
  icon?: React.ReactNode;
}

export function CredentialRow({ label, value, copyKey, copied, onCopy, icon }: CredentialRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        {icon}
        <div>
          <p className="text-[10px] text-indigo-400">{label}</p>
          <p className="text-sm font-mono font-bold text-indigo-800">{value}</p>
        </div>
      </div>
      <button
        onClick={() => onCopy(value, copyKey)}
        className="flex h-6 w-6 items-center justify-center rounded text-indigo-400 hover:bg-indigo-100 transition-colors"
        title={`Copy ${label.toLowerCase()}`}
      >
        {copied === copyKey ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
      </button>
    </div>
  );
}

export function CredentialCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-2">
      <div className="flex items-center gap-1.5 mb-1">
        <Key className="h-3 w-3 text-indigo-500" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Login Credentials</span>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
