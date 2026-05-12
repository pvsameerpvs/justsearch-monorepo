import { User, ArrowLeft, MessageCircle, Phone, Send } from 'lucide-react';
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

export function ChatMessageView({
  thread,
  newMessage,
  onMessageChange,
  onSend,
  onBack,
}: {
  thread: ChatThread;
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onBack: () => void;
}) {
  return (
    <div className="card-premium flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-4 border-b border-slate-100 p-4">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
          {thread.customerName.split(' ').map((n) => n[0]).join('')}
        </div>
        <div>
          <p className="font-bold text-slate-900">{thread.customerName}</p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Phone className="h-3 w-3" />
            {thread.customerPhone}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {thread.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                msg.sender === 'customer'
                  ? 'bg-slate-100 text-slate-900 rounded-tl-sm'
                  : 'bg-amber-500 text-white rounded-tr-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t border-slate-100 p-4">
        <input
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder="Type a message..."
          className="input-premium flex-1"
        />
        <button
          type="button"
          onClick={onSend}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 transition-all hover:bg-amber-600 active:scale-95"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
