import { Gift, Gamepad2, Trophy } from 'lucide-react';

const GAME_FEATURES = [
  { title: 'Branded games', detail: 'Customers play after scanning QR codes or ordering online.', icon: Gamepad2 },
  { title: 'Reward points', detail: 'Scores can become loyalty points, offers, and return visits.', icon: Trophy },
  { title: 'Restaurant offers', detail: 'Restaurants can attach rewards to games and popular dishes.', icon: Gift },
];

export function GamesFeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {GAME_FEATURES.map(({ detail, icon: Icon, title }) => (
        <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <Icon className="text-tomato" size={24} aria-hidden="true" />
          <h2 className="mt-5 text-xl font-semibold text-ink">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
        </article>
      ))}
    </div>
  );
}
