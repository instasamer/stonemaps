'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ChatMessage } from '@/lib/types';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('chat_messages')
        .select('*, author:profiles(*)')
        .order('created_at', { ascending: true })
        .limit(100);

      setMessages((data as ChatMessage[]) || []);
      setLoading(false);
    };

    fetchMessages();

    const channel = supabase
      .channel('chat-hook')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        async (payload) => {
          const { data } = await supabase
            .from('chat_messages')
            .select('*, author:profiles(*)')
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages((prev) => [...prev, data as ChatMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = async (userId: string, content: string) => {
    await supabase.from('chat_messages').insert({
      author_id: userId,
      content,
    });
  };

  return { messages, loading, sendMessage };
}
