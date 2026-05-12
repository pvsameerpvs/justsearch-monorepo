import type { Restaurant } from '@justsearch/utils';
import { MapPin, Phone, Mail, Globe, ExternalLink, Star, ChefHat } from 'lucide-react';

export function RestaurantInfoCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="elegant-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
          <ChefHat className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Restaurant Info</h3>
          <p className="text-sm text-slate-500">Details shown on customer frontend</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-700 leading-relaxed">{restaurant.description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow icon={MapPin} label="Address" value={restaurant.address} />
          <InfoRow icon={MapPin} label="City" value={restaurant.city} />
          <InfoRow icon={Phone} label="Phone" value={restaurant.phone} />
          <InfoRow icon={Mail} label="Email" value={restaurant.email} />
          {restaurant.website && (
            <InfoRow icon={Globe} label="Website" value={restaurant.website} isLink />
          )}
          <InfoRow icon={Star} label="Rating" value={`${restaurant.overallRating} / 5 (${restaurant.totalReviews} reviews)`} />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Cuisine</p>
          <div className="flex flex-wrap gap-2">
            {restaurant.cuisine.map((c) => (
              <span key={c} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  isLink,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3">
      <Icon className="mt-0.5 h-4 w-4 text-slate-400" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            {value} <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <p className="text-sm font-medium text-slate-700 truncate">{value}</p>
        )}
      </div>
    </div>
  );
}
