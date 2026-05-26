import { PageHeader } from "@justsearch/ui";
import { SettingsContainer } from "@/components/settings/settings-container";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your restaurant profile, QR codes, delivery, and social links" />
      <SettingsContainer />
    </div>
  );
}
