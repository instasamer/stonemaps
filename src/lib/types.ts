export type UserRole = 'cantero' | 'fabricante' | 'distribuidor' | 'arquitecto' | 'diseñador' | 'cliente';
export type SubscriptionTier = 'free' | 'basic' | 'standard' | 'premium';
export type StoneType = 'marmol' | 'granito' | 'pizarra' | 'caliza' | 'travertino' | 'cuarcita' | 'arenisca' | 'onix' | 'basalto';
export type StoneFinish = 'pulido' | 'apomazado' | 'envejecido' | 'flameado' | 'abujardado' | 'arenado' | 'tamboreado';
export type StoneUse = 'suelo' | 'revestimiento' | 'encimera' | 'exterior' | 'decoracion' | 'fachada';
export type PriceRange = 'bajo' | 'medio' | 'alto' | 'premium';

export interface Profile {
  id: string;
  email: string;
  company_name: string | null;
  role: UserRole;
  subscription: SubscriptionTier;
  description: string | null;
  phone: string | null;
  website: string | null;
  country: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  banner_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Stone {
  id: string;
  owner_id: string;
  name: string;
  stone_type: StoneType;
  colors: string[];
  country_origin: string;
  finish: StoneFinish[];
  uses: StoneUse[];
  description: string | null;
  price_range: PriceRange | null;
  available: boolean;
  created_at: string;
  // Joined data
  owner?: Profile;
  images?: StoneImage[];
}

export interface StoneImage {
  id: string;
  stone_id: string;
  url: string;
  is_primary: boolean;
  created_at: string;
}

export interface ProfileImage {
  id: string;
  profile_id: string;
  url: string;
  caption: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  // Joined data
  author?: Profile;
}

export interface StoneFilters {
  stone_type?: StoneType[];
  colors?: string[];
  country_origin?: string;
  finish?: StoneFinish[];
  uses?: StoneUse[];
  price_range?: PriceRange[];
  supplier_type?: UserRole[];
  search?: string;
}
