'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send } from 'lucide-react';

interface Props {
  userId: string;
}

export default function ChatInput({ userId }: Props) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const supabase = createClient();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || sending) return;

    setSending(true);
    await supabase.from('chat_messages').insert({
      author_id: userId,
      content: trimmed,
    });

    setMessage('');
    setSending(false);
  };

  return (
    <form onSubmit={handleSend} className="flex gap-2 p-4 border-t border-stone-200 bg-white">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
        maxLength={500}
        className="flex-1 px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition text-stone-800 text-sm"
      />
      <button
        type="submit"
        disabled={!message.trim() || sending}
        className="px-4 py-2.5 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition disabled:opacity-50"
      >
        <Send size={16} />
      </button>
    </form>
  );
}
