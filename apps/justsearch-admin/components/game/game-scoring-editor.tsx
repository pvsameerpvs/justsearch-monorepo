"use client";

import { useState } from 'react';
import type { ScoringConfig } from '@/lib/types/game.types';

interface GameScoringEditorProps {
  config: ScoringConfig;
  onSave: (config: ScoringConfig) => void;
}

export function GameScoringEditor({ config, onSave }: GameScoringEditorProps) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState<ScoringConfig>(config);

  const handleChange = (field: keyof ScoringConfig, value: string) => {
    const num = field === 'scoringVersion' ? value : Number(value);
    setLocal((prev) => ({ ...prev, [field]: num }));
  };

  const handleSave = () => {
    onSave(local);
    setOpen(false);
  };

  return (
    <div className="border-t border-slate-100 pt-2 mt-2">
      <button type="button" onClick={() => setOpen(!open)} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors">
        {open ? 'Hide Scoring Config' : 'Scoring Config'}
      </button>
      {open && (
        <div className="mt-2 space-y-1.5">
          {(['basePoints', 'exponent', 'multiplier', 'maxPerPlay'] as const).map((field) => (
            <div key={field} className="flex items-center justify-between gap-2">
              <label className="text-[10px] font-medium text-slate-500 w-20">{field}</label>
              <input
                type="number"
                step={field === 'exponent' ? 0.1 : 1}
                value={local[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-20 rounded border border-slate-200 px-2 py-0.5 text-[10px] text-right outline-none focus:border-amber-400"
              />
            </div>
          ))}
          <button type="button" onClick={handleSave} className="mt-1 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-amber-600 transition-colors">
            Save
          </button>
        </div>
      )}
    </div>
  );
}
