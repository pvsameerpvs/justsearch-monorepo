export function AdminSidebarFooter() {
  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">
      <div className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-bold">
          JS
        </div>
        <div>
          <p className="text-sm font-medium">Super Admin</p>
          <p className="text-xs text-slate-400">Platform Control</p>
        </div>
      </div>
    </div>
  );
}
