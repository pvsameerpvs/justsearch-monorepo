import { BadgeCheck, Star } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import type { GoogleReview } from '@/lib/restaurant-types';

type RestaurantReviewCardProps = {
  review: GoogleReview;
};

export function RestaurantReviewCard({ review }: RestaurantReviewCardProps) {
  return (
    <Surface className="rounded-[2px] border-white/70 bg-white/88 p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-semibold text-[rgb(var(--ink))]">
              {review.author}
            </h3>
            {review.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-[rgb(var(--muted))]">{review.date}</p>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700">
          <Star className="h-4 w-4 fill-current" />
          {review.rating.toFixed(1)}
        </div>
      </div>

      <p className="mt-5 text-sm leading-7 text-[rgb(var(--muted))]">
        {review.text}
      </p>
    </Surface>
  );
}
