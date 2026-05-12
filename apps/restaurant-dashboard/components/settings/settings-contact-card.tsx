"use client";

import { useState } from 'react';
import type { Restaurant } from '@justsearch/utils';
import { updateRestaurant } from '@justsearch/utils';
import { MapPin, Phone, Mail, Globe, Star, Check, X } from 'lucide-react';
import { ContactRow } from './contact-row';

export function SettingsContactCard({ restaurant }: { restaurant: Restaurant }) {
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState(restaurant.address);
  const [city, setCity] = useState(restaurant.city);
  const [phone, setPhone] = useState(restaurant.phone);
  const [email, setEmail] = useState(restaurant.email);
  const [website, setWebsite] = useState(restaurant.website ?? '');

  const handleSave = () => {
    updateRestaurant(restaurant.slug, { address, city, phone, email, website: website || undefined });
    setIsEditing(false);
  };

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Phone className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Contact Info</h3>
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

      <div className="space-y-3">
        <ContactRow icon={MapPin} label="Address" value={restaurant.address} isEditing={isEditing} onChange={setAddress} />
        <ContactRow icon={MapPin} label="City" value={restaurant.city} isEditing={isEditing} onChange={setCity} />
        <ContactRow icon={Phone} label="Phone" value={restaurant.phone} isEditing={isEditing} onChange={setPhone} />
        <ContactRow icon={Mail} label="Email" value={restaurant.email} isEditing={isEditing} onChange={setEmail} />
        <ContactRow icon={Globe} label="Website" value={restaurant.website ?? ''} isEditing={isEditing} onChange={setWebsite} />
        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3">
          <Star className="mt-0.5 h-4 w-4 text-slate-400" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Rating</p>
            <p className="text-sm font-medium text-slate-700">{restaurant.overallRating} / 5 ({restaurant.totalReviews} reviews)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
