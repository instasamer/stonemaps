import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-stone-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">S</span>
              </div>
              <span className="text-xl font-light text-white tracking-wide">StoneMaps</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              La plataforma global de piedra natural. Conectamos canteros, fabricantes,
              distribuidores y profesionales de todo el mundo.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-medium mb-3">Plataforma</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/explorar" className="hover:text-white transition">Explorar piedras</Link></li>
              <li><Link href="/mapa" className="hover:text-white transition">Mapa mundial</Link></li>
              <li><Link href="/chat" className="hover:text-white transition">Chat global</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-medium mb-3">Cuenta</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/registro" className="hover:text-white transition">Registrarse</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition">Iniciar sesión</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 text-center text-xs text-stone-500">
          &copy; {new Date().getFullYear()} StoneMaps. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
