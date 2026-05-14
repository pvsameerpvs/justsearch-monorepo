import { Bell, ShoppingBag, CreditCard, Megaphone } from "lucide-react";
import { SettingsSectionHeader } from "./settings-section-header";
import { SettingsToggleRow } from "./settings-toggle-row";
import type { SettingsStore } from "@/lib/stores/settings-store";

const ITEMS = [
  { key: "newOrderAlert" as const, label: "New Order Alerts", desc: "Email when any restaurant gets an order", icon: ShoppingBag },
  { key: "paymentFailure" as const, label: "Payment Failures", desc: "Alert when a subscription payment fails", icon: CreditCard },
  { key: "weeklyReport" as const, label: "Weekly Reports", desc: "Sunday summary of platform metrics", icon: Megaphone },
];

interface SettingsNotificationsProps {
  settings: SettingsStore;
}

export function SettingsNotifications({ settings }: SettingsNotificationsProps) {
  const { notifications, updateNotifications } = settings;

  return (
    <div className="space-y-5">
      <SettingsSectionHeader icon={Bell} title="Alerts" description="What you get notified about" iconBg="bg-amber-100" iconColor="text-amber-600" />
      <div className="space-y-1">
        {ITEMS.map((item) => (
          <SettingsToggleRow
            key={item.key}
            label={item.label}
            description={item.desc}
            icon={item.icon}
            checked={notifications[item.key]}
            onChange={(v) => updateNotifications({ [item.key]: v })}
          />
        ))}
      </div>
    </div>
  );
}
