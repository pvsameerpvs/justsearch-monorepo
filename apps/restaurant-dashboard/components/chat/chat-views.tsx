import { ArrowLeft, Phone, Send } from 'lucide-react';
import type { ChatThread } from '@/lib/stores/chat-store';
import { ChatMessageBubble } from './chat-message-bubble';

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

      <div className="h-80 overflow-y-auto p-4 space-y-3">
        {thread.messages.map((msg) => (
          <ChatMessageBubble key={msg.id} msg={msg} />
        ))}
      </div>

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
