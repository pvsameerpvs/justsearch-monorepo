import { PageHeader } from "@justsearch/ui";
import { RestaurantUsersPageContainer } from "@/components/users";

interface PageProps {
  params: Promise<{ restaurantId: string }>;
}

export default async function RestaurantUsersPage({ params }: PageProps) {
  const { restaurantId } = await params;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Restaurant Users"
        description="Registered customers and game points"
      />
      <RestaurantUsersPageContainer restaurantId={restaurantId} />
    </div>
  );
}
