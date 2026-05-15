"use client";

import { PageHeader } from "@justsearch/ui";
import { useRestaurantQuery } from "@/lib/hooks/use-restaurant-query";
import { HomepageSkeleton } from "@/components/homepage/homepage-skeleton";
import { HomepageError } from "@/components/homepage/homepage-error";
import { HomepageEditor } from "@/components/homepage/homepage-editor";

export default function HomepagePage() {
  const { data, isLoading, error, refetch } = useRestaurantQuery();

  if (isLoading) return <HomepageSkeleton />;
  if (error) return <HomepageError error={error} onRetry={refetch} />;
  if (!data) return <HomepageError error={new Error("No restaurant found")} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Homepage Editor" description="Customize your customer-facing homepage" />
      <HomepageEditor restaurant={data} />
    </div>
  );
}
