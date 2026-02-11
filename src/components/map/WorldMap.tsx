'use client';

import { useEffect, useState, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/types';
import { ROLE_COLORS, ROLE_LABELS, MARKER_SIZES, BUSINESS_ROLES } from '@/lib/constants';
import Link from 'next/link';
import { MapPin, ExternalLink } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

type MapProfile = Profile & { latitude: number; longitude: number };

export default function WorldMap() {
  const [profiles, setProfiles] = useState<MapProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<MapProfile | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .in('role', BUSINESS_ROLES)
        .in('subscription', ['basic', 'standard', 'premium'])
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      setProfiles((data as MapProfile[]) || []);
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = filter === 'all'
    ? profiles
    : profiles.filter((p) => p.role === filter);

  const handleMarkerClick = useCallback((profile: MapProfile) => {
    setSelectedProfile(profile);
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      {/* Filter buttons */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {[
          { value: 'all', label: 'Todos' },
          { value: 'cantero', label: 'Canteros', color: ROLE_COLORS.cantero },
          { value: 'fabricante', label: 'Fabricantes', color: ROLE_COLORS.fabricante },
          { value: 'distribuidor', label: 'Distribuidores', color: ROLE_COLORS.distribuidor },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shadow-sm ${
              filter === opt.value
                ? 'bg-stone-800 text-white'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {opt.value !== 'all' && (
              <span
                className="inline-block w-2 h-2 rounded-full mr-1.5"
                style={{ backgroundColor: opt.color }}
              />
            )}
            {opt.label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-xl border border-stone-200 p-3 shadow-sm">
        <div className="text-xs font-medium text-stone-700 mb-2">Leyenda</div>
        <div className="space-y-1.5">
          {[
            { role: 'cantero', label: 'Cantero' },
            { role: 'fabricante', label: 'Fabricante' },
            { role: 'distribuidor', label: 'Distribuidor' },
          ].map(({ role, label }) => (
            <div key={role} className="flex items-center gap-2 text-xs text-stone-600">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ROLE_COLORS[role as keyof typeof ROLE_COLORS] }} />
              {label}
            </div>
          ))}
          <hr className="border-stone-200" />
          <div className="text-[10px] text-stone-400">
            Tamaño = nivel de suscripción
          </div>
        </div>
      </div>

      {/* Map */}
      <Map
        initialViewState={{
          latitude: 30,
          longitude: 10,
          zoom: 2,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <NavigationControl position="top-right" />

        {filteredProfiles.map((profile) => {
          const size = MARKER_SIZES[profile.subscription] || 10;
          return (
            <Marker
              key={profile.id}
              latitude={profile.latitude}
              longitude={profile.longitude}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(profile);
              }}
            >
              <div
                className="rounded-full cursor-pointer hover:scale-125 transition-transform border-2 border-white shadow-md"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: ROLE_COLORS[profile.role],
                }}
              />
            </Marker>
          );
        })}

        {selectedProfile && (
          <Popup
            latitude={selectedProfile.latitude}
            longitude={selectedProfile.longitude}
            onClose={() => setSelectedProfile(null)}
            closeOnClick={false}
            offset={15}
            maxWidth="280px"
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium"
                  style={{ backgroundColor: ROLE_COLORS[selectedProfile.role] }}
                >
                  {selectedProfile.logo_url ? (
                    <img src={selectedProfile.logo_url} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    (selectedProfile.company_name || selectedProfile.email)[0].toUpperCase()
                  )}
                </div>
                <div>
                  <div className="font-medium text-stone-800 text-sm">
                    {selectedProfile.company_name || selectedProfile.email.split('@')[0]}
                  </div>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: ROLE_COLORS[selectedProfile.role] }}
                  >
                    {ROLE_LABELS[selectedProfile.role]}
                  </span>
                </div>
              </div>

              {(selectedProfile.city || selectedProfile.country) && (
                <div className="flex items-center gap-1 text-xs text-stone-500 mb-2">
                  <MapPin size={11} />
                  {[selectedProfile.city, selectedProfile.country].filter(Boolean).join(', ')}
                </div>
              )}

              {selectedProfile.description && (
                <p className="text-xs text-stone-500 mb-3 line-clamp-2">
                  {selectedProfile.description}
                </p>
              )}

              <Link
                href={`/perfil/${selectedProfile.id}`}
                className="flex items-center gap-1 text-xs text-stone-700 font-medium hover:text-stone-900 transition"
              >
                Ver perfil <ExternalLink size={11} />
              </Link>
            </div>
          </Popup>
        )}
      </Map>

      {loading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
          <div className="text-stone-500">Cargando mapa...</div>
        </div>
      )}
    </div>
  );
}
