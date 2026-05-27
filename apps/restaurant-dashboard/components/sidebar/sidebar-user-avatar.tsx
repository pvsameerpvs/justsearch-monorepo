interface SidebarUserAvatarProps {
  color: string;
  initials: string;
  mounted: boolean;
}

export function SidebarUserAvatar({ color, initials, mounted }: SidebarUserAvatarProps) {
  return (
    <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${color} shadow-lg shadow-slate-900/10 ring-2 ring-white`}>
      <span className="text-[11px] font-black">{mounted ? initials : 'U'}</span>
    </div>
  );
}
