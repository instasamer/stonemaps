'use client';

import { Stone } from '@/lib/types';
import { STONE_TYPES, ROLE_COLORS, ROLE_LABELS, STONE_COLORS } from '@/lib/constants';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

interface Props {
  stone: Stone;
}

export default function StoneCard({ stone }: Props) {
  const primaryImage = stone.images?.find((img) => img.is_primary) || stone.images?.[0];
  const stoneTypeLabel = STONE_TYPES.find((t) => t.value === stone.stone_type)?.label || stone.stone_type;

  return (
    <div className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg hover:border-stone-300 transition-all duration-200">
      {/* Image */}
      <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={stone.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22C11.79 22 11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2C12.21 2 12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z" />
            </svg>
          </div>
        )}
        {/* Type badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-md text-xs font-medium text-stone-700">
          {stoneTypeLabel}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-stone-800 text-base leading-tight">{stone.name}</h3>

        <div className="mt-2 flex items-center gap-1 text-xs text-stone-500">
          <MapPin size={12} />
          {stone.country_origin}
        </div>

        {/* Colors */}
        <div className="mt-2.5 flex items-center gap-1.5">
          {stone.colors.slice(0, 4).map((color) => {
            const colorData = STONE_COLORS.find((c) => c.value === color);
            return (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-stone-200"
                style={{ background: colorData?.hex || '#ccc' }}
                title={colorData?.label || color}
              />
            );
          })}
          {stone.colors.length > 4 && (
            <span className="text-xs text-stone-400">+{stone.colors.length - 4}</span>
          )}
        </div>

        {/* Owner */}
        {stone.owner && (
          <Link
            href={`/perfil/${stone.owner.id}`}
            className="mt-3 flex items-center gap-2 text-xs text-stone-500 hover:text-stone-700 transition"
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-medium"
              style={{ backgroundColor: ROLE_COLORS[stone.owner.role] }}
            >
              {(stone.owner.company_name || stone.owner.email)[0].toUpperCase()}
            </div>
            <span>{stone.owner.company_name || stone.owner.email.split('@')[0]}</span>
            <span
              className="px-1.5 py-0.5 rounded text-[9px] text-white"
              style={{ backgroundColor: ROLE_COLORS[stone.owner.role] }}
            >
              {ROLE_LABELS[stone.owner.role]}
            </span>
          </Link>
        )}

        {/* Price range */}
        {stone.price_range && (
          <div className="mt-2 text-xs text-stone-400">
            {'€'.repeat(stone.price_range === 'bajo' ? 1 : stone.price_range === 'medio' ? 2 : stone.price_range === 'alto' ? 3 : 4)}
            <span className="text-stone-200">
              {'€'.repeat(4 - (stone.price_range === 'bajo' ? 1 : stone.price_range === 'medio' ? 2 : stone.price_range === 'alto' ? 3 : 4))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
