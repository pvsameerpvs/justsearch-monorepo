import { PageHeader } from '@justsearch/ui';
import { MenuManager } from '@/components/menu/menu-manager';

export default function MenuPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Menu" description="Edit your restaurant menu" />
      <MenuManager />
    </div>
  );
}
