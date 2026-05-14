"use client";

import { useState } from "react";

import { useSettingsStore } from "@/lib/stores/settings-store";
import { SettingsPresenter } from "./settings-presenter";

export function SettingsContainer() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const settings = useSettingsStore();

  return (
    <SettingsPresenter
      activeTab={activeTab}
      onTabChange={setActiveTab}
      settings={settings}
      saved={saved}
      onSave={handleSave}
    />
  );
}
