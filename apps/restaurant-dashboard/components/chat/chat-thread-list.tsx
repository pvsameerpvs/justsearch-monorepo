import type { ChatThread } from '@/lib/stores/chat-store';

export function ChatThreadList({
  threads,
  onSelect,
}: {
  threads: ChatThread[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {threads.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onSelect(t.id)}
          className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 text-left transition-all hover:border-slate-200 hover:shadow-sm"
        >
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
              {t.customerName.split(' ').map((n) => n[0]).join('')}
            </div>
            {t.unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                {t.unreadCount}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-bold text-slate-900">{t.customerName}</p>
              <p className="text-xs text-slate-400">{t.customerPhone}</p>
            </div>
            <p className="mt-0.5 text-sm text-slate-500 truncate">{t.lastMessage}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
