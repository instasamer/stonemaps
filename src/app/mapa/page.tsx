'use client';

import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('@/components/map/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-4rem)] bg-stone-100 flex items-center justify-center">
      <div className="text-stone-400">Cargando mapa...</div>
    </div>
  ),
});

export default function MapaPage() {
  return <WorldMap />;
}
