import { Badge } from '@justsearch/ui';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/cn';

type MenuItemCardProps = {
  name: string;
  description: string;
  price: number;
  tag?: string;
  className?: string;
};

export function MenuItemCard({ name, description, price, tag, className }: MenuItemCardProps) {
  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-white p-5', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h4 className="font-medium text-[rgb(var(--ink))]">{name}</h4>
          <p className="text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <p className="shrink-0 font-display text-lg font-semibold tracking-[-0.03em] text-[rgb(var(--ink))]">
          {formatCurrency(price, 'AED')}
        </p>
      </div>
      {tag ? <Badge className="mt-4">{tag}</Badge> : null}
    </div>
  );
}

