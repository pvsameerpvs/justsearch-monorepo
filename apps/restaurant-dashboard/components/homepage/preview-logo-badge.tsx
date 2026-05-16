import Image from 'next/image';

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

interface PreviewLogoBadgeProps {
  logoUrl?: string;
  name: string;
  theme: Record<string, string>;
}

export function PreviewLogoBadge({ logoUrl, name, theme }: PreviewLogoBadgeProps) {
  const initials = getInitials(name);

  return (
    <div
      className="relative h-20 w-20 overflow-hidden rounded-[32px]"
      style={{
        border: `1px solid rgba(${theme.cardBorder},0.9)`,
        background: `rgba(${theme.cardSurface},0.96)`,
        boxShadow: `0 18px 60px rgba(15,23,42,0.15), 0 0 0 1px rgba(${theme.border},0.28)`,
      }}
    >
      {logoUrl ? (
        <Image src={logoUrl} alt={`${name} logo`} fill className="object-cover" sizes="80px" />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-semibold tracking-tight text-white text-xl"
          style={{ background: `linear-gradient(145deg, rgb(${theme.logoGradientFrom}), rgba(${theme.logoGradientTo},0.92))` }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
