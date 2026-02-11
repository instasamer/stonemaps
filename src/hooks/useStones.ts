'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Stone, StoneFilters } from '@/lib/types';

export function useStones(filters: StoneFilters) {
  const [stones, setStones] = useState<Stone[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStones = async () => {
      setLoading(true);

      let query = supabase
        .from('stones')
        .select('*, owner:profiles(*), images:stone_images(*)')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (filters.stone_type?.length) {
        query = query.in('stone_type', filters.stone_type);
      }

      if (filters.colors?.length) {
        query = query.overlaps('colors', filters.colors);
      }

      if (filters.country_origin) {
        query = query.eq('country_origin', filters.country_origin);
      }

      if (filters.finish?.length) {
        query = query.overlaps('finish', filters.finish);
      }

      if (filters.uses?.length) {
        query = query.overlaps('uses', filters.uses);
      }

      if (filters.price_range?.length) {
        query = query.in('price_range', filters.price_range);
      }

      if (filters.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data } = await query;

      let results = (data as Stone[]) || [];

      // Client-side filter for supplier_type (requires join)
      if (filters.supplier_type?.length) {
        results = results.filter(
          (s) => s.owner && filters.supplier_type!.includes(s.owner.role)
        );
      }

      setStones(results);
      setLoading(false);
    };

    fetchStones();
  }, [JSON.stringify(filters)]);

  return { stones, loading };
}
