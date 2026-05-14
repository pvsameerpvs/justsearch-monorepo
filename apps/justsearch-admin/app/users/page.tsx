import { PageHeader } from "@justsearch/ui";
import { UserContainer } from "@/components/users";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="View registered users per restaurant with game points"
      />
      <UserContainer />
    </div>
  );
}
