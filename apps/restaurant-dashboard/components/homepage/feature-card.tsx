import { ArrowUpRight } from "lucide-react";

interface FeatureCardProps {
  title: string;
  eyebrow: string;
  description: string;
  icon: React.ElementType;
  bg: string;
  iconBg: string;
  brandColor: string;
  cardBorder: string;
  cardSurface: string;
  border: string;
  muted: string;
}

export function FeatureCard({
  title,
  eyebrow,
  description,
  icon: Icon,
  bg,
  iconBg,
  brandColor,
  cardBorder,
  cardSurface,
  border,
  muted,
}: FeatureCardProps) {
  return (
    <div
      className="group h-full rounded-[28px] p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(15,23,42,0.12)]"
      style={{
        border: `1px solid rgba(${cardBorder},0.9)`,
        background: bg,
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm"
            style={{
              borderColor: `rgba(${cardBorder},0.85)`,
              background: iconBg,
            }}
          >
            <Icon className="h-4 w-4" style={{ color: brandColor }} />
          </div>
          <span
            className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{
              borderColor: `rgba(${border},0.7)`,
              background: `rgba(${cardSurface},0.82)`,
              color: muted,
            }}
          >
            {eyebrow}
          </span>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-1.5 text-xs leading-5 text-slate-500">{description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 text-xs font-semibold" style={{ color: brandColor }}>
          <span>Open page</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </div>
  );
}
