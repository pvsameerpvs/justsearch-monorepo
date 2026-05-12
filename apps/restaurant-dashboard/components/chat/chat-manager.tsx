"use client";

import { useState } from 'react';
import { useChatStore } from '@/lib/stores/chat-store';
import { Button } from '@justsearch/ui';
import { MessageCircle, Send, User } from 'lucide-react';

export function ChatManager() {
  const { threads, addMessage, markAsRead } = useChatStore();
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const thread = threads.find((t) => t.id === activeThread);

  const handleSend = () => {
    if (!newMessage.trim() || !activeThread) return;
    addMessage(activeThread, 'restaurant', newMessage.trim());
    setNewMessage('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Customer Chat</h3>

      {!activeThread ? (
        <div className="space-y-2">
          {threads.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setActiveThread(t.id);
                markAsRead(t.id);
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900">{t.customerName}</p>
                  {t.unreadCount > 0 && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                      {t.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">{t.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveThread(null)}
                className="text-sm text-slate-500"
              >
                ← Back
              </button>
              <p className="font-bold text-slate-900">{thread?.customerName}</p>
            </div>
          </div>

          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {thread?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.sender === 'customer'
                      ? 'bg-slate-100 text-slate-900'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t border-slate-100 p-4">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm"
            />
            <Button size="sm" onClick={handleSend} className="bg-amber-500">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
