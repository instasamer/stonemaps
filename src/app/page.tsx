import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />

      {/* CTA section for businesses */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-stone-800 mb-4">
            ¿Eres cantero, fabricante o distribuidor?
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto mb-8">
            Registra tu empresa, muestra tus piedras al mundo y aparece en nuestro mapa global.
            Conecta con arquitectos, diseñadores y clientes finales.
          </p>
          <Link
            href="/auth/registro"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-800 text-white rounded-xl hover:bg-stone-700 transition font-medium"
          >
            Registrar mi empresa
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
