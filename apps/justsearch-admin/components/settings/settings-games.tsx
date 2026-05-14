import { Gamepad2, Trophy, Zap } from "lucide-react";
import { SettingsSectionHeader } from "./settings-section-header";
import { SettingsToggleRow } from "./settings-toggle-row";
import { SettingsInputField } from "./settings-input-field";
import type { SettingsStore } from "@/lib/stores/settings-store";

interface SettingsGamesProps {
  settings: SettingsStore;
}

export function SettingsGames({ settings }: SettingsGamesProps) {
  const { games, updateGames } = settings;

  return (
    <div className="space-y-5">
      <SettingsSectionHeader icon={Gamepad2} title="Game Rules" description="Points and ads in games" iconBg="bg-purple-100" iconColor="text-purple-600" />
      <div className="grid gap-4 sm:grid-cols-2">
        <SettingsInputField label="Max Points Per Game" value={String(games.maxPointsPerGame)} icon={Trophy} onChange={(v) => updateGames({ maxPointsPerGame: Number(v) })} />
      </div>
      <SettingsToggleRow
        label="Allow Sponsor Ads in Games"
        description="Show advertisement popups between rounds"
        icon={Zap}
        checked={games.allowSponsorAds}
        onChange={(v) => updateGames({ allowSponsorAds: v })}
      />
    </div>
  );
}
