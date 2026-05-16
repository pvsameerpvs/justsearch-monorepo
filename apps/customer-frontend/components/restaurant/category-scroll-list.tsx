import type { Restaurant } from "@/lib/restaurant-types";

interface CategoryScrollListProps {
  categories: Restaurant['menu'];
}

export function CategoryScrollList({ categories }: CategoryScrollListProps) {
  return (
    <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      {categories.map((category) => (
        <a
          key={category.id}
          href={`#${category.id}`}
          className="group relative flex shrink-0 items-center gap-3 rounded-[12px] border border-slate-200/50 bg-white px-6 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgb(var(--brand))] hover:shadow-[0_8px_20px_-6px_rgb(var(--brand)/0.15)] active:scale-95 sm:px-5 sm:py-3"
        >
          {category.emoji && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 transition-colors group-hover:bg-[rgb(var(--brand)/0.1)]">
              <span className="text-xl transition-transform duration-300 group-hover:scale-110">{category.emoji}</span>
            </div>
          )}
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-700 transition-colors group-hover:text-[rgb(var(--brand))] sm:text-sm sm:normal-case sm:tracking-normal">
            {category.title}
          </span>
        </a>
      ))}
    </div>
  );
}
