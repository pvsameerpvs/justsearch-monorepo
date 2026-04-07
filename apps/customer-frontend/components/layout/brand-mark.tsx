import { cn } from '@/lib/cn';

type BrandMarkProps = {
  initials: string;
  className?: string;
};

export function BrandMark({ initials, className }: BrandMarkProps) {
  return (
    <div
      className={cn(
        'flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(var(--brand))] text-sm font-bold text-white shadow-lg',
        className
      )}
    >
      {initials}
    </div>
  );
}
