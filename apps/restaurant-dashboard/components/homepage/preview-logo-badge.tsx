import Image from 'next/image';

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

interface PreviewLogoBadgeProps {
  logoUrl?: string;
  name: string;
  theme: Record<string, string>;
  size?: 'sm' | 'lg';
}

const sizeClasses = {
  sm: 'h-14 w-14 rounded-[22px] text-base',
  lg: 'h-28 w-28 rounded-[32px] text-3xl',
} as const;

export function PreviewLogoBadge({ logoUrl, name, theme, size = 'sm' }: PreviewLogoBadgeProps) {
  const initials = getInitials(name);

  return (
    <div
      className={`relative overflow-hidden ${sizeClasses[size]}`}
      style={{
        border: `1px solid rgba(${theme.cardBorder},0.9)`,
        background: `rgba(${theme.cardSurface},0.96)`,
        boxShadow: `0 18px 60px rgba(15,23,42,0.15), 0 0 0 1px rgba(${theme.border},0.28)`,
      }}
    >
      {logoUrl ? (
        <Image src={logoUrl} alt={`${name} logo`} fill className="object-cover" sizes={size === 'lg' ? '112px' : '56px'} />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-semibold tracking-[-0.08em] text-white"
          style={{
            background: `linear-gradient(145deg, rgb(${theme.logoGradientFrom}), rgba(${theme.logoGradientTo},0.92))`,
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
