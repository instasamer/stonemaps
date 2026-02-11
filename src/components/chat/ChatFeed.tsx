'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export default function ChatFeed() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*, author:profiles(*)')
        .order('created_at', { ascending: true })
        .limit(100);

      setMessages((data as ChatMessageType[]) || []);
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        async (payload) => {
          // Fetch the full message with author
          const { data } = await supabase
            .from('chat_messages')
            .select('*, author:profiles(*)')
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages((prev) => [...prev, data as ChatMessageType]);
            setTimeout(scrollToBottom, 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-stone-200 bg-white">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-stone-500" />
          <h1 className="text-lg font-medium text-stone-800">Chat Global</h1>
        </div>
        <p className="text-xs text-stone-500 mt-0.5">
          Comparte ofertas, novedades y conecta con la comunidad
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-stone-50/50">
        {loading ? (
          <div className="flex items-center justify-center h-full text-stone-400">
            Cargando mensajes...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-stone-400">
            <MessageSquare size={32} className="mb-2" />
            <p>Aún no hay mensajes</p>
            <p className="text-sm">Sé el primero en escribir</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      {authLoading ? null : user ? (
        <ChatInput userId={user.id} />
      ) : (
        <div className="p-4 border-t border-stone-200 bg-white text-center">
          <p className="text-sm text-stone-500">
            <Link href="/auth/login" className="text-stone-800 font-medium hover:underline">
              Inicia sesión
            </Link>{' '}
            para participar en el chat
          </p>
        </div>
      )}
    </div>
  );
}
