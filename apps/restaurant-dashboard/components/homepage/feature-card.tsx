import { ArrowUpRight } from "lucide-react";

interface FeatureCardProps {
  title: string;
  eyebrow: string;
  description: string;
  icon: React.ElementType;
  bg: string;
  iconBg: string;
  brandColor: string;
}

export function FeatureCard({ title, eyebrow, description, icon: Icon, bg, iconBg, brandColor }: FeatureCardProps) {
  return (
    <div className="group rounded-[28px] border border-slate-200/90 p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]" style={{ background: bg }}>
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/85 shadow-sm" style={{ background: iconBg }}>
            <Icon className="h-5 w-5" style={{ color: brandColor }} />
          </div>
          <span className="rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {eyebrow}
          </span>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-6 text-sm font-semibold" style={{ color: brandColor }}>
          <span>Open page</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </div>
  );
}
