interface RestaurantMobileHeaderCenterProps {
  title: string;
}

export function RestaurantMobileHeaderCenter({ title }: RestaurantMobileHeaderCenterProps) {
  return (
    <div className="min-w-0 flex-1 text-center">
      <p className="truncate text-sm font-bold tracking-tight text-[rgb(var(--ink))]">
        {title}
      </p>
    </div>
  );
}
