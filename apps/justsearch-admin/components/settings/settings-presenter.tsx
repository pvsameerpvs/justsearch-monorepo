import { SettingsTabs } from "./settings-tabs";
import { SettingsSaveBar } from "./settings-save-bar";
import { SettingsGeneral } from "./settings-general";
import { SettingsNotifications } from "./settings-notifications";
import { SettingsSecurity } from "./settings-security";
import { SettingsRestaurants } from "./settings-restaurants";
import { SettingsRevenue } from "./settings-revenue";
import { SettingsGames } from "./settings-games";
import { SettingsBilling } from "./settings-billing";
import type { SettingsStore } from "@/lib/stores/settings-store";
import type { SettingsTab } from "./types/settings.types";

interface SettingsPresenterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  settings: SettingsStore;
  saved: boolean;
  onSave: () => void;
}

const TAB_COMPONENTS: Record<SettingsTab, React.FC<{ settings: SettingsStore }>> = {
  general: SettingsGeneral,
  notifications: SettingsNotifications,
  security: SettingsSecurity,
  restaurants: SettingsRestaurants,
  revenue: SettingsRevenue,
  games: SettingsGames,
  billing: SettingsBilling,
};

export function SettingsPresenter({ activeTab, onTabChange, settings, saved, onSave }: SettingsPresenterProps) {
  const TabComponent = TAB_COMPONENTS[activeTab as SettingsTab] ?? SettingsGeneral;

  return (
    <div className="space-y-5">
      <SettingsTabs activeTab={activeTab} onTabChange={onTabChange} />
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6">
          <TabComponent settings={settings} />
        </div>
      </div>
      <SettingsSaveBar saved={saved} onSave={onSave} />
    </div>
  );
}
