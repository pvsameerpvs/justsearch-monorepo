"use client";

import { useState } from 'react';
import { Button } from '@justsearch/ui';
import { useGameStore } from '@/lib/stores/game-store';
import { Gamepad2, ToggleLeft, ToggleRight, Trash2, Plus } from 'lucide-react';

export function GameManager() {
  const { games, toggleAvailability, removeGame } = useGameStore();
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Game Management</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-amber-500 hover:bg-amber-600">
          <Plus className="mr-1 h-4 w-4" />
          Add Game
        </Button>
      </div>

      {showAddForm && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">
            Use the Game Creation Agent playbook at docs/game-creation-agent.md to add new games.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {games.map((game) => (
          <div
            key={game.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-xl">
                {game.icon}
              </div>
              <div>
                <p className="font-bold text-slate-900">{game.name}</p>
                <p className="text-xs text-slate-500">
                  {game.prize} · ID: {game.localGameId}
                </p>
                {game.sponsorAd && (
                  <span className="mt-1 inline-block rounded bg-purple-50 px-2 py-0.5 text-xs font-bold text-purple-700">
                    Ad Enabled
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleAvailability(game.id)}
                className="text-slate-400 hover:text-amber-600"
              >
                {game.isAvailable ? (
                  <ToggleRight className="h-6 w-6 text-green-500" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-slate-300" />
                )}
              </button>
              <button
                type="button"
                onClick={() => removeGame(game.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
