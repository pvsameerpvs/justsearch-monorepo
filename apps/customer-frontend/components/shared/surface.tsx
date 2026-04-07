import { cn } from '@/lib/cn';
import { Card } from '@justsearch/ui';
import type { PropsWithChildren } from 'react';

type SurfaceProps = PropsWithChildren<{
  className?: string;
}>;

export function Surface({ children, className }: SurfaceProps) {
  return (
    <Card className={cn('border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm', className)}>
      {children}
    </Card>
  );
}

