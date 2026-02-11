'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { USER_ROLES } from '@/lib/constants';
import type { UserRole } from '@/lib/types';

export default function RegistroPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState<UserRole>('cliente');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        company_name: companyName || null,
        role,
      });

      if (profileError) {
        setError('Error al crear el perfil: ' + profileError.message);
        setLoading(false);
        return;
      }
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-stone-800 tracking-wide">StoneMaps</h1>
          <p className="text-stone-500 mt-2">Crea tu cuenta</p>
        </div>

        <form onSubmit={handleRegister} className="bg-white rounded-xl shadow-sm border border-stone-200 p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition text-stone-800"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition text-stone-800"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Tipo de cuenta</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition text-stone-800 bg-white"
            >
              {USER_ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label} — {r.description}
                </option>
              ))}
            </select>
          </div>

          {['cantero', 'fabricante', 'distribuidor'].includes(role) && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Nombre de empresa</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none transition text-stone-800"
                placeholder="Tu empresa S.L."
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p className="text-center text-sm text-stone-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-stone-800 font-medium hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
