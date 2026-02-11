import Link from 'next/link';
import { ArrowRight, Globe, Mountain } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50/30" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 sm:pt-28 sm:pb-36">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 border border-stone-200 rounded-full text-sm text-stone-600 mb-8">
            <Globe size={14} className="text-stone-500" />
            Plataforma global de piedra natural
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-stone-800 tracking-tight leading-[1.1]">
            Piedras
            <br />
            <span className="font-normal text-stone-900">Naturales</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-stone-500 max-w-xl mx-auto leading-relaxed font-light">
            Conectamos canteros, fabricantes y distribuidores con profesionales y clientes de todo el mundo.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/explorar"
              className="group flex items-center gap-2 px-8 py-3.5 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition text-base font-medium shadow-lg shadow-stone-300/30"
            >
              Explorar
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/mapa"
              className="flex items-center gap-2 px-8 py-3.5 bg-white text-stone-700 rounded-xl border border-stone-300 hover:border-stone-400 hover:bg-stone-50 transition text-base"
            >
              <MapIcon />
              Ver mapa mundial
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {[
            { number: '9', label: 'Tipos de piedra' },
            { number: '30+', label: 'Países' },
            { number: '7', label: 'Acabados' },
            { number: '∞', label: 'Posibilidades' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-light text-stone-800">{stat.number}</div>
              <div className="text-xs sm:text-sm text-stone-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MapIcon() {
  return (
    <Mountain size={18} className="text-stone-500" />
  );
}
