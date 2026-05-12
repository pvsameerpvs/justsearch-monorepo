"use client";

import { useState } from 'react';
import { useChatStore } from '@/lib/stores/chat-store';
import { ChatThreadList, ChatMessageView } from './chat-views';

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

  const handleSelect = (id: string) => {
    setActiveThread(id);
    markAsRead(id);
  };

  if (!activeThread) {
    return (
      <div className="space-y-4">
        <ChatThreadList threads={threads} onSelect={handleSelect} />
      </div>
    );
  }

  if (!thread) return null;

  return (
    <div className="space-y-4">
      <ChatMessageView
        thread={thread}
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onSend={handleSend}
        onBack={() => setActiveThread(null)}
      />
    </div>
  );
}
