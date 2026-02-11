'use client';

import { ChatMessage as ChatMessageType } from '@/lib/types';
import { ROLE_COLORS, ROLE_LABELS } from '@/lib/constants';
import Link from 'next/link';

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const author = message.author;
  const time = new Date(message.created_at).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const date = new Date(message.created_at).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="flex gap-3 py-3 px-4 hover:bg-stone-50/50 transition">
      {/* Avatar */}
      <Link href={author ? `/perfil/${author.id}` : '#'} className="flex-shrink-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium"
          style={{ backgroundColor: author ? ROLE_COLORS[author.role] : '#9CA3AF' }}
        >
          {author?.logo_url ? (
            <img src={author.logo_url} alt="" className="w-full h-full object-cover rounded-full" />
          ) : (
            (author?.company_name || author?.email || '?')[0].toUpperCase()
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={author ? `/perfil/${author.id}` : '#'}
            className="text-sm font-medium text-stone-800 hover:underline"
          >
            {author?.company_name || author?.email?.split('@')[0] || 'Anónimo'}
          </Link>
          {author && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded text-white"
              style={{ backgroundColor: ROLE_COLORS[author.role] }}
            >
              {ROLE_LABELS[author.role]}
            </span>
          )}
          <span className="text-[11px] text-stone-400">{date} {time}</span>
        </div>
        <p className="text-sm text-stone-600 mt-0.5 whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
}
