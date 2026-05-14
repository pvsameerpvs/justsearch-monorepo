import type { LucideIcon } from "lucide-react";

interface SettingsSectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

export function SettingsSectionHeader({ icon: Icon, title, description, iconBg, iconColor }: SettingsSectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}
