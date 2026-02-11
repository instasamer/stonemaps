'use client';

import { Profile } from '@/lib/types';
import { ROLE_COLORS, ROLE_LABELS } from '@/lib/constants';
import { MapPin, Globe, Phone } from 'lucide-react';

interface Props {
  profile: Profile;
}

export default function ProfileHeader({ profile }: Props) {
  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-48 sm:h-64 bg-gradient-to-r from-stone-300 to-stone-200 rounded-b-2xl overflow-hidden">
        {profile.banner_url && (
          <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Logo */}
          <div
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-light"
            style={{ backgroundColor: ROLE_COLORS[profile.role] }}
          >
            {profile.logo_url ? (
              <img src={profile.logo_url} alt={profile.company_name || ''} className="w-full h-full object-cover rounded-xl" />
            ) : (
              (profile.company_name || profile.email)[0].toUpperCase()
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-2 sm:pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-medium text-stone-800">
                {profile.company_name || profile.email.split('@')[0]}
              </h1>
              <span
                className="text-xs px-2.5 py-1 rounded-full text-white font-medium"
                style={{ backgroundColor: ROLE_COLORS[profile.role] }}
              >
                {ROLE_LABELS[profile.role]}
              </span>
            </div>

            {profile.description && (
              <p className="mt-2 text-stone-500 max-w-2xl">{profile.description}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-stone-500">
              {(profile.city || profile.country) && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {[profile.city, profile.country].filter(Boolean).join(', ')}
                </span>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-stone-700 transition"
                >
                  <Globe size={14} />
                  {profile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              {profile.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={14} />
                  {profile.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
