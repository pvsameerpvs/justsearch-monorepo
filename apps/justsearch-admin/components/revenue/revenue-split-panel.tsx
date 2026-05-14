import { SplitBar } from './split-bar';

interface RevenueSplitPanelProps {
  title: string;
  subtitle: string;
  total: number;
  primaryLabel: string;
  primaryValue: number;
  secondaryLabel: string;
  secondaryValue: number;
  primaryColor: string;
  secondaryColor: string;
  highlightLabel: string;
  highlightValue: number;
}

export function RevenueSplitPanel({
  title,
  subtitle,
  total,
  primaryLabel,
  primaryValue,
  secondaryLabel,
  secondaryValue,
  primaryColor,
  secondaryColor,
  highlightLabel,
  highlightValue,
}: RevenueSplitPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>

      <div className="mt-3 space-y-3">
        <SplitBar label={primaryLabel} value={primaryValue} total={total} color={primaryColor} />
        <SplitBar label={secondaryLabel} value={secondaryValue} total={total} color={secondaryColor} />
      </div>

      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-center">
        <p className="text-xs text-slate-500">{highlightLabel}</p>
        <p className="text-lg font-bold text-slate-900">AED {highlightValue.toLocaleString()}</p>
      </div>
    </div>
  );
}
