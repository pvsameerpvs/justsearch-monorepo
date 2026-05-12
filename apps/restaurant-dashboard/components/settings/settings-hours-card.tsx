"use client";

import { useState } from 'react';
import type { Restaurant } from '@justsearch/utils';
import { updateRestaurant } from '@justsearch/utils';
import { Clock, Plus, Check, X } from 'lucide-react';
import { HourRow } from './hour-row';

export function SettingsHoursCard({ restaurant }: { restaurant: Restaurant }) {
  const [hours, setHours] = useState(restaurant.openingHours);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateRestaurant(restaurant.slug, { openingHours: hours });
    setIsEditing(false);
  };

  const updateHour = (index: number, updates: Partial<(typeof hours)[0]>) => {
    const next = [...hours];
    next[index] = { ...next[index], ...updates };
    setHours(next);
  };

  const removeDay = (index: number) => setHours(hours.filter((_, i) => i !== index));
  const addDay = () => setHours([...hours, { day: 'New Day', hours: '00:00 – 00:00' }]);

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Opening Hours</h3>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
            <button onClick={handleSave} className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
              <Check className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="elegant-btn-secondary text-xs">
            Edit
          </button>
        )}
      </div>

      <div className="space-y-2">
        {hours.map((oh, i) => (
          <HourRow
            key={i}
            hour={oh}
            isEditing={isEditing}
            onUpdateDay={(value) => updateHour(i, { day: value })}
            onUpdateHours={(value) => updateHour(i, { hours: value })}
            onToggleToday={() => updateHour(i, { isToday: !oh.isToday })}
            onRemoveDay={() => removeDay(i)}
          />
        ))}
        {isEditing && (
          <button onClick={addDay} className="flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-2 px-4 text-sm font-medium text-slate-400 hover:border-slate-300 hover:text-slate-600 w-full justify-center">
            <Plus className="h-4 w-4" /> Add Day
          </button>
        )}
      </div>
    </div>
  );
}
