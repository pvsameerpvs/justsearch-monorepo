"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ReferralCodeDisplayProps {
  link: string;
}

export function ReferralCodeDisplay({ link }: ReferralCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mt-2 flex gap-2">
      <input
        readOnly
        value={link}
        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600"
      />
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-xl bg-slate-100 p-3 text-slate-600 transition-colors hover:bg-slate-200"
      >
        {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
      </button>
    </div>
  );
}
