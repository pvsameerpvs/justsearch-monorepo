import { PageHeader } from "@justsearch/ui";
import { SettingsContainer } from "@/components/settings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure platform-wide preferences and policies"
      />
      <SettingsContainer />
    </div>
  );
}
