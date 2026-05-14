"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";
import { PageHeader } from "@justsearch/ui";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { GeneralSettingsTab } from "@/components/settings/general-settings-tab";
import { NotificationSettingsTab } from "@/components/settings/notification-settings-tab";
import { SecuritySettingsTab } from "@/components/settings/security-settings-tab";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Platform configuration" />
      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {activeTab === "general" && <GeneralSettingsTab />}
        {activeTab === "notifications" && <NotificationSettingsTab />}
        {activeTab === "security" && <SecuritySettingsTab />}
      </div>
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
