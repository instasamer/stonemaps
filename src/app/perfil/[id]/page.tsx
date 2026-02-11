import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileGallery from '@/components/profile/ProfileGallery';
import StoneCard from '@/components/stones/StoneCard';
import Link from 'next/link';
import { Pencil } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (!profile) return notFound();

  const { data: images } = await supabase
    .from('profile_images')
    .select('*')
    .eq('profile_id', id)
    .order('created_at', { ascending: false });

  const { data: stones } = await supabase
    .from('stones')
    .select('*, images:stone_images(*)')
    .eq('owner_id', id)
    .eq('available', true)
    .order('created_at', { ascending: false });

  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === profile.id;

  return (
    <div className="pb-16">
      <ProfileHeader profile={profile} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">
        {isOwner && (
          <Link
            href="/perfil/editar"
            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition text-sm mb-8"
          >
            <Pencil size={14} />
            Editar perfil
          </Link>
        )}

        {/* Gallery */}
        {images && images.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-medium text-stone-800 mb-4">Galería</h2>
            <ProfileGallery images={images} />
          </section>
        )}

        {/* Stones */}
        {stones && stones.length > 0 && (
          <section>
            <h2 className="text-xl font-medium text-stone-800 mb-4">
              Piedras ({stones.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stones.map((stone) => (
                <StoneCard key={stone.id} stone={stone} />
              ))}
            </div>
          </section>
        )}

        {(!stones || stones.length === 0) && (
          <div className="text-center py-12 text-stone-400">
            {isOwner ? 'Todavía no tienes piedras publicadas. Añade tus productos desde el editor de perfil.' : 'Este perfil aún no tiene piedras publicadas.'}
          </div>
        )}
      </div>
    </div>
  );
}
