import { BadgeCheck, Star } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import type { GoogleReview } from '@/lib/restaurant-types';

type RestaurantReviewCardProps = {
  review: GoogleReview;
};

export function RestaurantReviewCard({ review }: RestaurantReviewCardProps) {
  return (
    <Surface className="rounded-[32px] border-slate-100 bg-white p-5 sm:p-6 shadow-sm shadow-slate-200/50">
      <div className="flex items-start gap-4">
        {/* AVATAR: Clean Letter Circle */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-50 text-sm font-black text-slate-400 border border-slate-100/50">
          {review.author.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          {/* TOP ROW: Name, Badge, Rating */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <h3 className="truncate text-base font-black italic tracking-tighter text-slate-900 leading-tight">
                {review.author}
              </h3>
              {review.verified && (
                <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" />
              )}
            </div>
            
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-600 border border-amber-100/50 shadow-inner">
              <Star className="h-2.5 w-2.5 fill-current" />
              {review.rating.toFixed(1)}
            </div>
          </div>
          
          {/* DATE: Small & Muted */}
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-300">
            {review.date}
          </p>
          
          {/* CONTENT: Robust text wrapping */}
          <p className="mt-4 text-sm leading-relaxed text-slate-600 break-words hyphens-auto">
            {review.text}
          </p>
        </div>
      </div>
    </Surface>
  );
}
