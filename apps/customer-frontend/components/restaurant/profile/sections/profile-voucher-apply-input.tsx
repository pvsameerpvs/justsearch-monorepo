"use client";

import { useState } from 'react';
import { Ticket } from 'lucide-react';

interface ProfileVoucherApplyInputProps {
  onApply: (code: string) => void;
}

export function ProfileVoucherApplyInput({ onApply }: ProfileVoucherApplyInputProps) {
  const [code, setCode] = useState('');
  return (
    <div className="flex items-center gap-3 overflow-hidden rounded-[28px] border border-[rgb(var(--brand)/0.15)] bg-[rgb(var(--brand-soft)/0.2)] px-2 py-2">
      <Ticket className="ml-3 h-4 w-4 text-[rgb(var(--brand))]" />
      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter voucher code" className="flex-1 bg-transparent text-sm font-bold uppercase tracking-widest text-[rgb(var(--brand))] placeholder:font-normal placeholder:lowercase placeholder:tracking-normal outline-none" />
      <button type="button" onClick={() => { onApply(code); setCode(''); }} disabled={!code.trim()} className="rounded-xl bg-[rgb(var(--brand))] px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-all active:scale-95 disabled:opacity-40">Apply</button>
    </div>
  );
}
