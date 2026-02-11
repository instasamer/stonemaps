'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_COLORS, ROLE_LABELS } from '@/lib/constants';
import { Menu, X, User, LogOut, MapPin, MessageSquare, Search } from 'lucide-react';

export default function Navbar() {
  const { user, profile, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-xl font-light text-stone-800 tracking-wide hidden sm:block">
              StoneMaps
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/explorar"
              className="flex items-center gap-1.5 px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition text-sm"
            >
              <Search size={16} />
              Explorar
            </Link>
            <Link
              href="/mapa"
              className="flex items-center gap-1.5 px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition text-sm"
            >
              <MapPin size={16} />
              Mapa
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-1.5 px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition text-sm"
            >
              <MessageSquare size={16} />
              Chat
            </Link>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-stone-200 animate-pulse" />
            ) : user && profile ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/perfil/${profile.id}`}
                  className="flex items-center gap-2 px-3 py-1.5 hover:bg-stone-100 rounded-lg transition"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: ROLE_COLORS[profile.role] }}
                  >
                    {(profile.company_name || profile.email)[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-stone-700">
                    {profile.company_name || profile.email.split('@')[0]}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: ROLE_COLORS[profile.role] }}
                  >
                    {ROLE_LABELS[profile.role]}
                  </span>
                </Link>
                <button
                  onClick={signOut}
                  className="p-2 text-stone-400 hover:text-stone-600 transition"
                  title="Cerrar sesión"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/registro"
                  className="px-4 py-2 text-sm bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-stone-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/explorar"
              className="flex items-center gap-2 px-3 py-2.5 text-stone-600 hover:bg-stone-100 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              <Search size={18} /> Explorar
            </Link>
            <Link
              href="/mapa"
              className="flex items-center gap-2 px-3 py-2.5 text-stone-600 hover:bg-stone-100 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              <MapPin size={18} /> Mapa
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-2 px-3 py-2.5 text-stone-600 hover:bg-stone-100 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              <MessageSquare size={18} /> Chat
            </Link>
            <hr className="border-stone-200" />
            {user && profile ? (
              <>
                <Link
                  href={`/perfil/${profile.id}`}
                  className="flex items-center gap-2 px-3 py-2.5 text-stone-600 hover:bg-stone-100 rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={18} /> Mi perfil
                </Link>
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 text-stone-600 hover:bg-stone-100 rounded-lg w-full"
                >
                  <LogOut size={18} /> Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block px-3 py-2.5 text-stone-600 hover:bg-stone-100 rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/registro"
                  className="block px-3 py-2.5 text-white bg-stone-800 rounded-lg text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
