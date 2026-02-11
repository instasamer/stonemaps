'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import StoneFilters from '@/components/stones/StoneFilters';
import StoneGrid from '@/components/stones/StoneGrid';
import { useStones } from '@/hooks/useStones';
import type { StoneFilters as Filters } from '@/lib/types';
import { Search } from 'lucide-react';

function ExplorarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Parse filters from URL
  const parseArrayParam = (key: string) => {
    const val = searchParams.get(key);
    return val ? val.split(',') : undefined;
  };

  const [filters, setFilters] = useState<Filters>({
    stone_type: parseArrayParam('type') as any,
    colors: parseArrayParam('colors'),
    country_origin: searchParams.get('country') || undefined,
    finish: parseArrayParam('finish') as any,
    uses: parseArrayParam('uses') as any,
    price_range: parseArrayParam('price') as any,
    supplier_type: parseArrayParam('supplier') as any,
    search: searchParams.get('q') || undefined,
  });

  const [search, setSearch] = useState(filters.search || '');
  const { stones, loading } = useStones(filters);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.stone_type?.length) params.set('type', newFilters.stone_type.join(','));
    if (newFilters.colors?.length) params.set('colors', newFilters.colors.join(','));
    if (newFilters.country_origin) params.set('country', newFilters.country_origin);
    if (newFilters.finish?.length) params.set('finish', newFilters.finish.join(','));
    if (newFilters.uses?.length) params.set('uses', newFilters.uses.join(','));
    if (newFilters.price_range?.length) params.set('price', newFilters.price_range.join(','));
    if (newFilters.supplier_type?.length) params.set('supplier', newFilters.supplier_type.join(','));
    if (newFilters.search) params.set('q', newFilters.search);
    router.replace(`/explorar?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFiltersChange({ ...filters, search: search || undefined });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-light text-stone-800 mb-2">Explorar piedras</h1>
        <p className="text-stone-500">Descubre piedras naturales de todo el mundo</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-xl">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre de piedra..."
            className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition text-stone-800"
          />
        </div>
      </form>

      {/* Content */}
      <div className="flex gap-8">
        <StoneFilters filters={filters} onChange={handleFiltersChange} />
        <div className="flex-1 min-w-0">
          <div className="mb-4 text-sm text-stone-500">
            {loading ? 'Buscando...' : `${stones.length} piedra${stones.length !== 1 ? 's' : ''} encontrada${stones.length !== 1 ? 's' : ''}`}
          </div>
          <StoneGrid stones={stones} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-stone-200 rounded w-48 mb-4" />
          <div className="h-4 bg-stone-100 rounded w-64 mb-8" />
        </div>
      </div>
    }>
      <ExplorarContent />
    </Suspense>
  );
}
