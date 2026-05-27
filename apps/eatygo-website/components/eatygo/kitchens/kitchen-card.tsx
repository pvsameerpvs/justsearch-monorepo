'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Star } from 'lucide-react';
import type { Kitchen } from '@/lib/types/eatygo.types';
import { KitchenCardMeta } from './kitchen-card-meta';

interface KitchenCardProps {
  kitchen: Kitchen;
}

const BADGE_STYLES: Record<string, string> = {
  'Top rated': 'bg-lagoon/10 text-lagoon border-lagoon/20',
  Fast: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Popular: 'bg-tomato/10 text-tomato border-tomato/20',
  New: 'bg-saffron/10 text-amber-700 border-amber-200',
  Fresh: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Family: 'bg-sky-50 text-sky-700 border-sky-200',
  Dinner: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Rewards: 'bg-purple-50 text-purple-700 border-purple-200',
  Cafe: 'bg-orange-50 text-orange-700 border-orange-200',
  'QR tables': 'bg-lagoon/10 text-lagoon border-lagoon/20',
  Premium: 'bg-ink/8 text-ink border-ink/10',
  Delivery: 'bg-tomato/10 text-tomato border-tomato/20',
};

function getBadgeStyle(badge: string): string {
  return BADGE_STYLES[badge] || 'bg-slate-50 text-slate-600 border-slate-200';
}

export function KitchenCard({ kitchen }: KitchenCardProps) {
  const { badges, cuisine, eta, featuredDish, imageAlt, imageSrc, name, priceNote, rating } = kitchen;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group overflow-hidden rounded-2xl border border-black/[0.04] bg-white shadow-[0_2px_8px_rgba(16,24,32,0.04)] transition-shadow duration-500 hover:shadow-[0_20px_48px_rgba(16,24,32,0.1)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {badges.map((badge) => (
            <span
              key={badge}
              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${getBadgeStyle(badge)}`}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Floating rating badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-white/95 px-2.5 py-1.5 text-sm font-bold text-ink shadow-sm backdrop-blur-sm">
          <Star size={14} fill="#F5A524" stroke="#F5A524" aria-hidden="true" />
          {rating}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-ink">{name}</h3>
            <p className="mt-0.5 text-sm text-slate-500">{cuisine}</p>
          </div>
          <span className="flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">
            <Clock size={12} aria-hidden="true" />
            {eta}
          </span>
        </div>
        <p className="mt-3 text-sm font-medium text-lagoon">{featuredDish}</p>
        <KitchenCardMeta priceNote={priceNote} />
      </div>
    </motion.article>
  );
}
