"use client";

import { create } from 'zustand';

export type ChatMessage = {
  id: string;
  sender: 'customer' | 'restaurant';
  text: string;
  timestamp: string;
  read: boolean;
};

export type ChatThread = {
  id: string;
  customerName: string;
  customerPhone: string;
  messages: ChatMessage[];
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
};

interface ChatStore {
  threads: ChatThread[];
  addMessage: (threadId: string, sender: 'customer' | 'restaurant', text: string) => void;
  markAsRead: (threadId: string) => void;
}

const INITIAL_THREADS: ChatThread[] = [
  {
    id: '1',
    customerName: 'Amina Hassan',
    customerPhone: '+971 55 111 2222',
    messages: [
      {
        id: '1',
        sender: 'customer',
        text: 'Hi, I have a question about my order #1024',
        timestamp: '2024-05-12T10:00:00',
        read: true,
      },
      {
        id: '2',
        sender: 'restaurant',
        text: 'Hello Amina! Sure, what would you like to know?',
        timestamp: '2024-05-12T10:01:00',
        read: true,
      },
    ],
    lastMessage: 'Hello Amina! Sure, what would you like to know?',
    updatedAt: '2024-05-12T10:01:00',
    unreadCount: 0,
  },
  {
    id: '2',
    customerName: 'Khalid Al Mansoori',
    customerPhone: '+971 50 333 4444',
    messages: [
      {
        id: '3',
        sender: 'customer',
        text: 'Can I add extra sauce to my order?',
        timestamp: '2024-05-12T10:15:00',
        read: false,
      },
    ],
    lastMessage: 'Can I add extra sauce to my order?',
    updatedAt: '2024-05-12T10:15:00',
    unreadCount: 1,
  },
];

export const useChatStore = create<ChatStore>((set) => ({
  threads: INITIAL_THREADS,
  addMessage: (threadId, sender, text) =>
    set((state) => ({
      threads: state.threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              messages: [
                ...t.messages,
                {
                  id: crypto.randomUUID(),
                  sender,
                  text,
                  timestamp: new Date().toISOString(),
                  read: sender === 'restaurant',
                },
              ],
              lastMessage: text,
              updatedAt: new Date().toISOString(),
              unreadCount: sender === 'customer' ? t.unreadCount + 1 : t.unreadCount,
            }
          : t
      ),
    })),
  markAsRead: (threadId) =>
    set((state) => ({
      threads: state.threads.map((t) =>
        t.id === threadId ? { ...t, unreadCount: 0 } : t
      ),
    })),
}));
