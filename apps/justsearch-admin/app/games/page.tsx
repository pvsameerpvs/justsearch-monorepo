"use client";

import { PageHeader } from "@justsearch/ui";
import { GameManager } from "@/components/game/game-manager";

export default function GamesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Games" description="Manage platform games shared across all restaurants" />
      <GameManager />
    </div>
  );
}
