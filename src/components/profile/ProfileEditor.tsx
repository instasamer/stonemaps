'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Profile, UserRole } from '@/lib/types';
import { COUNTRIES } from '@/lib/constants';
import { Save, Upload, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  profile: Profile;
}

export default function ProfileEditor({ profile: initialProfile }: Props) {
  const [profile, setProfile] = useState(initialProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('profiles')
      .update({
        company_name: profile.company_name,
        description: profile.description,
        phone: profile.phone,
        website: profile.website,
        country: profile.country,
        city: profile.city,
        latitude: profile.latitude,
        longitude: profile.longitude,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    if (error) {
      setMessage('Error al guardar: ' + error.message);
    } else {
      setMessage('Perfil guardado correctamente');
      router.refresh();
    }
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `${profile.id}/${type}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setMessage('Error al subir imagen: ' + uploadError.message);
      return;
    }

    const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);

    const field = type === 'logo' ? 'logo_url' : 'banner_url';
    await supabase.from('profiles').update({ [field]: data.publicUrl }).eq('id', profile.id);
    setProfile({ ...profile, [field]: data.publicUrl });
    setMessage('Imagen actualizada');
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/gallery/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) {
        setMessage('Error al subir: ' + uploadError.message);
        continue;
      }

      const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);

      await supabase.from('profile_images').insert({
        profile_id: profile.id,
        url: data.publicUrl,
      });
    }

    setMessage('Fotos subidas correctamente');
    router.refresh();
  };

  const update = (field: keyof Profile, value: string | number | null) => {
    setProfile({ ...profile, [field]: value } as Profile);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Logo</label>
          <label className="flex items-center gap-2 px-4 py-2.5 border border-stone-300 rounded-lg cursor-pointer hover:bg-stone-50 transition text-sm text-stone-600">
            <Upload size={16} />
            {profile.logo_url ? 'Cambiar logo' : 'Subir logo'}
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} className="hidden" />
          </label>
          {profile.logo_url && (
            <img src={profile.logo_url} alt="Logo" className="mt-2 w-20 h-20 rounded-lg object-cover" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Banner</label>
          <label className="flex items-center gap-2 px-4 py-2.5 border border-stone-300 rounded-lg cursor-pointer hover:bg-stone-50 transition text-sm text-stone-600">
            <Upload size={16} />
            {profile.banner_url ? 'Cambiar banner' : 'Subir banner'}
            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} className="hidden" />
          </label>
          {profile.banner_url && (
            <img src={profile.banner_url} alt="Banner" className="mt-2 w-full h-20 rounded-lg object-cover" />
          )}
        </div>
      </div>

      {/* Company info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Nombre de empresa</label>
          <input
            type="text"
            value={profile.company_name || ''}
            onChange={(e) => update('company_name', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition text-stone-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Teléfono</label>
          <input
            type="tel"
            value={profile.phone || ''}
            onChange={(e) => update('phone', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition text-stone-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Web</label>
        <input
          type="url"
          value={profile.website || ''}
          onChange={(e) => update('website', e.target.value)}
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition text-stone-800"
          placeholder="https://tu-empresa.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1.5">Descripción</label>
        <textarea
          value={profile.description || ''}
          onChange={(e) => update('description', e.target.value)}
          rows={4}
          className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition text-stone-800 resize-none"
          placeholder="Describe tu empresa y actividad..."
        />
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">País</label>
          <select
            value={profile.country || ''}
            onChange={(e) => update('country', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition text-stone-800 bg-white"
          >
            <option value="">Seleccionar país</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Ciudad</label>
          <input
            type="text"
            value={profile.city || ''}
            onChange={(e) => update('city', e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition text-stone-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Latitud</label>
          <input
            type="number"
            step="any"
            value={profile.latitude || ''}
            onChange={(e) => update('latitude', e.target.value ? parseFloat(e.target.value) : null)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition text-stone-800"
            placeholder="40.4168"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">Longitud</label>
          <input
            type="number"
            step="any"
            value={profile.longitude || ''}
            onChange={(e) => update('longitude', e.target.value ? parseFloat(e.target.value) : null)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition text-stone-800"
            placeholder="-3.7038"
          />
        </div>
      </div>

      {/* Gallery upload */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Galería de fotos</label>
        <label className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-stone-300 rounded-lg cursor-pointer hover:bg-stone-50 transition text-sm text-stone-600">
          <Upload size={16} />
          Subir fotos a la galería
          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
        </label>
      </div>

      {/* Save */}
      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition font-medium disabled:opacity-50"
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        {saving ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
}
