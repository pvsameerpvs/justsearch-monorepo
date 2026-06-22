import { useState, useEffect, useCallback } from 'react';
import { useUpdateScratchCampaignMutation } from './hooks/use-scratch-campaigns';

interface Props { triggerKey: string; minAmount: number; }

export function ScratchCardThresholdConfig({ triggerKey, minAmount: init }: Props) {
  const update = useUpdateScratchCampaignMutation();
  const [value, setValue] = useState(init);
  useEffect(() => { setValue(init); }, [init]);

  const handleBlur = useCallback(() => {
    if (value > 0) update.mutate({ trigger: triggerKey, data: { config: { minAmount: value } } });
  }, [value, triggerKey, update]);

  return (
    <div className="mt-3 flex items-center gap-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">Min Order</label>
      <div className="flex items-center gap-1">
        <span className="text-xs font-bold text-slate-600">AED</span>
        <input type="number" value={value} onChange={(e) => setValue(Math.max(0, Number(e.target.value)))}
          onBlur={handleBlur} className="w-20 rounded border border-slate-200 px-2 py-1 text-xs font-bold" min="0" />
      </div>
    </div>
  );
}
