'use client';

import { useState } from 'react';
import { StoneFilters as Filters } from '@/lib/types';
import { STONE_TYPES, STONE_COLORS, STONE_FINISHES, STONE_USES, PRICE_RANGES, COUNTRIES } from '@/lib/constants';
import { ChevronDown, ChevronUp, X, SlidersHorizontal } from 'lucide-react';

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function StoneFilters({ filters, onChange }: Props) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    type: true,
    color: true,
    country: false,
    finish: false,
    use: false,
    price: false,
    supplier: false,
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleArrayFilter = <K extends keyof Filters>(key: K, value: string) => {
    const current = (filters[key] as string[] | undefined) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: updated.length > 0 ? updated : undefined });
  };

  const activeCount = Object.values(filters).filter((v) => v !== undefined && (typeof v === 'string' ? v.length > 0 : true)).length;

  const clearAll = () => onChange({});

  const filterContent = (
    <div className="space-y-1">
      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 transition px-3 py-2"
        >
          <X size={12} />
          Limpiar filtros ({activeCount})
        </button>
      )}

      {/* Stone Type */}
      <FilterSection title="Tipo de piedra" isOpen={openSections.type} onToggle={() => toggleSection('type')}>
        <div className="space-y-1.5">
          {STONE_TYPES.map((type) => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800">
              <input
                type="checkbox"
                checked={filters.stone_type?.includes(type.value) || false}
                onChange={() => toggleArrayFilter('stone_type', type.value)}
                className="rounded border-stone-300 text-stone-800 focus:ring-stone-400"
              />
              {type.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection title="Color" isOpen={openSections.color} onToggle={() => toggleSection('color')}>
        <div className="flex flex-wrap gap-2">
          {STONE_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => toggleArrayFilter('colors', color.value)}
              className={`w-8 h-8 rounded-full border-2 transition ${
                filters.colors?.includes(color.value)
                  ? 'border-stone-800 scale-110'
                  : 'border-stone-200 hover:border-stone-400'
              }`}
              style={{ background: color.hex }}
              title={color.label}
            />
          ))}
        </div>
      </FilterSection>

      {/* Country */}
      <FilterSection title="País de origen" isOpen={openSections.country} onToggle={() => toggleSection('country')}>
        <select
          value={filters.country_origin || ''}
          onChange={(e) => onChange({ ...filters, country_origin: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-700 bg-white focus:ring-2 focus:ring-stone-400 focus:border-transparent outline-none"
        >
          <option value="">Todos los países</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </FilterSection>

      {/* Finish */}
      <FilterSection title="Acabado" isOpen={openSections.finish} onToggle={() => toggleSection('finish')}>
        <div className="space-y-1.5">
          {STONE_FINISHES.map((finish) => (
            <label key={finish.value} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800">
              <input
                type="checkbox"
                checked={filters.finish?.includes(finish.value) || false}
                onChange={() => toggleArrayFilter('finish', finish.value)}
                className="rounded border-stone-300 text-stone-800 focus:ring-stone-400"
              />
              {finish.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Use */}
      <FilterSection title="Uso" isOpen={openSections.use} onToggle={() => toggleSection('use')}>
        <div className="space-y-1.5">
          {STONE_USES.map((use) => (
            <label key={use.value} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800">
              <input
                type="checkbox"
                checked={filters.uses?.includes(use.value) || false}
                onChange={() => toggleArrayFilter('uses', use.value)}
                className="rounded border-stone-300 text-stone-800 focus:ring-stone-400"
              />
              {use.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Precio" isOpen={openSections.price} onToggle={() => toggleSection('price')}>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((pr) => (
            <label key={pr.value} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800">
              <input
                type="checkbox"
                checked={filters.price_range?.includes(pr.value) || false}
                onChange={() => toggleArrayFilter('price_range', pr.value)}
                className="rounded border-stone-300 text-stone-800 focus:ring-stone-400"
              />
              {pr.label}
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Supplier type */}
      <FilterSection title="Tipo de proveedor" isOpen={openSections.supplier} onToggle={() => toggleSection('supplier')}>
        <div className="space-y-1.5">
          {[
            { value: 'cantero', label: 'Cantero' },
            { value: 'fabricante', label: 'Fabricante' },
            { value: 'distribuidor', label: 'Distribuidor' },
          ].map((role) => (
            <label key={role.value} className="flex items-center gap-2 cursor-pointer text-sm text-stone-600 hover:text-stone-800">
              <input
                type="checkbox"
                checked={filters.supplier_type?.includes(role.value as any) || false}
                onChange={() => toggleArrayFilter('supplier_type', role.value)}
                className="rounded border-stone-300 text-stone-800 focus:ring-stone-400"
              />
              {role.label}
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-700 mb-4 w-full justify-center"
      >
        <SlidersHorizontal size={16} />
        Filtros {activeCount > 0 && `(${activeCount})`}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-stone-800">Filtros</h3>
              <button onClick={() => setMobileOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-20 bg-white rounded-xl border border-stone-200 p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h3 className="font-medium text-stone-800 mb-3 flex items-center gap-2">
            <SlidersHorizontal size={16} />
            Filtros
          </h3>
          {filterContent}
        </div>
      </div>
    </>
  );
}

function FilterSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-stone-100 last:border-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-3 text-sm font-medium text-stone-700 hover:text-stone-900"
      >
        {title}
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {isOpen && <div className="pb-3">{children}</div>}
    </div>
  );
}
