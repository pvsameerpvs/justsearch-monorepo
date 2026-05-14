import { PageHeader } from "@justsearch/ui";
import { GameContainer } from "@/components/game";

export default function GamesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Games" description="Activate or deactivate platform games available to all restaurants" />
      <GameContainer />
    </div>
  );
}
