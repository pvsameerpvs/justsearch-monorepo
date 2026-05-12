import type { ChatMessage } from '@/lib/stores/chat-store';

export function ChatMessageBubble({ msg }: { msg: ChatMessage }) {
  const isCustomer = msg.sender === 'customer';
  return (
    <div className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
          isCustomer ? 'bg-slate-100 text-slate-900 rounded-tl-sm' : 'bg-amber-500 text-white rounded-tr-sm'
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}
