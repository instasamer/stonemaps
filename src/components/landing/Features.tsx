import { Search, MapPin, MessageSquare, Building2 } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Search,
    title: 'Explora piedras',
    description: 'Busca entre mármoles, granitos, pizarras y más. Filtra por tipo, color, país, acabado y uso.',
    href: '/explorar',
    color: 'bg-amber-50 text-amber-700',
  },
  {
    icon: MapPin,
    title: 'Mapa mundial',
    description: 'Localiza canteras, fabricantes y distribuidores en un mapamundi interactivo.',
    href: '/mapa',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    icon: MessageSquare,
    title: 'Chat global',
    description: 'Comparte ofertas y conecta con profesionales del sector en tiempo real.',
    href: '/chat',
    color: 'bg-green-50 text-green-700',
  },
  {
    icon: Building2,
    title: 'Tu perfil',
    description: 'Crea la página de tu empresa con fotos, productos y toda tu información.',
    href: '/auth/registro',
    color: 'bg-purple-50 text-purple-700',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-light text-stone-800">
            Todo lo que necesitas
          </h2>
          <p className="text-stone-500 mt-3 max-w-lg mx-auto">
            Una plataforma diseñada para cada actor de la industria de la piedra natural.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="group p-6 rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all duration-200 bg-white"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon size={22} />
              </div>
              <h3 className="text-lg font-medium text-stone-800 mb-2 group-hover:text-stone-900">
                {feature.title}
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
