import { StoneType, StoneFinish, StoneUse, PriceRange, UserRole } from './types';

export const STONE_TYPES: { value: StoneType; label: string }[] = [
  { value: 'marmol', label: 'Mármol' },
  { value: 'granito', label: 'Granito' },
  { value: 'pizarra', label: 'Pizarra' },
  { value: 'caliza', label: 'Caliza' },
  { value: 'travertino', label: 'Travertino' },
  { value: 'cuarcita', label: 'Cuarcita' },
  { value: 'arenisca', label: 'Arenisca' },
  { value: 'onix', label: 'Ónix' },
  { value: 'basalto', label: 'Basalto' },
];

export const STONE_COLORS: { value: string; label: string; hex: string }[] = [
  { value: 'blanco', label: 'Blanco', hex: '#F5F5F0' },
  { value: 'negro', label: 'Negro', hex: '#1A1A1A' },
  { value: 'gris', label: 'Gris', hex: '#8C8C8C' },
  { value: 'beige', label: 'Beige', hex: '#D4C5A9' },
  { value: 'marron', label: 'Marrón', hex: '#7B5B3A' },
  { value: 'rojo', label: 'Rojo', hex: '#A0352C' },
  { value: 'verde', label: 'Verde', hex: '#4A6741' },
  { value: 'azul', label: 'Azul', hex: '#3D5A80' },
  { value: 'rosa', label: 'Rosa', hex: '#C48B9F' },
  { value: 'amarillo', label: 'Amarillo', hex: '#D4A843' },
  { value: 'multicolor', label: 'Multicolor', hex: 'linear-gradient(135deg, #A0352C, #D4A843, #4A6741, #3D5A80)' },
];

export const STONE_FINISHES: { value: StoneFinish; label: string }[] = [
  { value: 'pulido', label: 'Pulido' },
  { value: 'apomazado', label: 'Apomazado' },
  { value: 'envejecido', label: 'Envejecido' },
  { value: 'flameado', label: 'Flameado' },
  { value: 'abujardado', label: 'Abujardado' },
  { value: 'arenado', label: 'Arenado' },
  { value: 'tamboreado', label: 'Tamboreado' },
];

export const STONE_USES: { value: StoneUse; label: string }[] = [
  { value: 'suelo', label: 'Suelo' },
  { value: 'revestimiento', label: 'Revestimiento' },
  { value: 'encimera', label: 'Encimera' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'decoracion', label: 'Decoración' },
  { value: 'fachada', label: 'Fachada' },
];

export const PRICE_RANGES: { value: PriceRange; label: string }[] = [
  { value: 'bajo', label: 'Económico' },
  { value: 'medio', label: 'Medio' },
  { value: 'alto', label: 'Alto' },
  { value: 'premium', label: 'Premium' },
];

export const USER_ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'cantero', label: 'Cantero', description: 'Propietario de cantera' },
  { value: 'fabricante', label: 'Fabricante', description: 'Fabricante de piedra natural' },
  { value: 'distribuidor', label: 'Distribuidor', description: 'Distribuidor de piedra natural' },
  { value: 'arquitecto', label: 'Arquitecto', description: 'Profesional de arquitectura' },
  { value: 'diseñador', label: 'Diseñador', description: 'Profesional de diseño' },
  { value: 'cliente', label: 'Cliente', description: 'Cliente final' },
];

export const BUSINESS_ROLES: UserRole[] = ['cantero', 'fabricante', 'distribuidor'];

export const ROLE_COLORS: Record<UserRole, string> = {
  cantero: '#D4A853',
  fabricante: '#4A7FB5',
  distribuidor: '#5BA55B',
  arquitecto: '#8B5CF6',
  diseñador: '#EC4899',
  cliente: '#6B7280',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  cantero: 'Cantero',
  fabricante: 'Fabricante',
  distribuidor: 'Distribuidor',
  arquitecto: 'Arquitecto',
  diseñador: 'Diseñador',
  cliente: 'Cliente',
};

export const MARKER_SIZES: Record<string, number> = {
  premium: 24,
  standard: 16,
  basic: 10,
};

export const COUNTRIES = [
  'España', 'Italia', 'Portugal', 'Turquía', 'Grecia', 'Brasil', 'India',
  'China', 'Egipto', 'Irán', 'México', 'Perú', 'Argentina', 'Colombia',
  'Noruega', 'Suecia', 'Finlandia', 'Francia', 'Alemania', 'Reino Unido',
  'Estados Unidos', 'Canadá', 'Australia', 'Sudáfrica', 'Marruecos',
  'Túnez', 'Pakistán', 'Vietnam', 'Indonesia', 'Filipinas',
];
