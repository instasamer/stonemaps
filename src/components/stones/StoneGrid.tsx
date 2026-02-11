'use client';

import { Stone } from '@/lib/types';
import StoneCard from './StoneCard';

interface Props {
  stones: Stone[];
  loading?: boolean;
}

export default function StoneGrid({ stones, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-stone-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-stone-200 rounded w-3/4" />
              <div className="h-3 bg-stone-100 rounded w-1/2" />
              <div className="flex gap-1.5">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="w-4 h-4 rounded-full bg-stone-200" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (stones.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-stone-300 mb-3">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22C11.79 22 11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2C12.21 2 12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z" />
          </svg>
        </div>
        <p className="text-stone-500">No se encontraron piedras con estos filtros</p>
        <p className="text-stone-400 text-sm mt-1">Prueba a cambiar o eliminar algunos filtros</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stones.map((stone) => (
        <StoneCard key={stone.id} stone={stone} />
      ))}
    </div>
  );
}
