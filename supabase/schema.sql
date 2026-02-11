-- ============================================
-- StoneMaps - Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Create ENUMS
CREATE TYPE user_role AS ENUM ('cantero', 'fabricante', 'distribuidor', 'arquitecto', 'diseñador', 'cliente');
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'standard', 'premium');
CREATE TYPE stone_type AS ENUM ('marmol', 'granito', 'pizarra', 'caliza', 'travertino', 'cuarcita', 'arenisca', 'onix', 'basalto');
CREATE TYPE stone_finish AS ENUM ('pulido', 'apomazado', 'envejecido', 'flameado', 'abujardado', 'arenado', 'tamboreado');
CREATE TYPE stone_use AS ENUM ('suelo', 'revestimiento', 'encimera', 'exterior', 'decoracion', 'fachada');

-- 2. Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  company_name TEXT,
  role user_role NOT NULL DEFAULT 'cliente',
  subscription subscription_tier NOT NULL DEFAULT 'free',
  description TEXT,
  phone TEXT,
  website TEXT,
  country TEXT,
  city TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  logo_url TEXT,
  banner_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Stones table
CREATE TABLE stones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  stone_type stone_type NOT NULL,
  colors TEXT[] NOT NULL,
  country_origin TEXT NOT NULL,
  finish stone_finish[] DEFAULT '{}',
  uses stone_use[] DEFAULT '{}',
  description TEXT,
  price_range TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Stone images
CREATE TABLE stone_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stone_id UUID REFERENCES stones(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Profile images (gallery)
CREATE TABLE profile_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Indexes
CREATE INDEX idx_stones_type ON stones(stone_type);
CREATE INDEX idx_stones_country ON stones(country_origin);
CREATE INDEX idx_stones_owner ON stones(owner_id);
CREATE INDEX idx_stones_colors ON stones USING GIN(colors);
CREATE INDEX idx_stones_finish ON stones USING GIN(finish);
CREATE INDEX idx_stones_uses ON stones USING GIN(uses);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_subscription ON profiles(subscription);
CREATE INDEX idx_profiles_location ON profiles(latitude, longitude);
CREATE INDEX idx_chat_created ON chat_messages(created_at);
CREATE INDEX idx_stone_images_stone ON stone_images(stone_id);
CREATE INDEX idx_profile_images_profile ON profile_images(profile_id);

-- 8. Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stones ENABLE ROW LEVEL SECURITY;
ALTER TABLE stone_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, owner write
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Stones: public read, owner write
CREATE POLICY "Stones are viewable by everyone" ON stones FOR SELECT USING (true);
CREATE POLICY "Users can insert own stones" ON stones FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own stones" ON stones FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own stones" ON stones FOR DELETE USING (auth.uid() = owner_id);

-- Stone images: public read, owner write
CREATE POLICY "Stone images are viewable by everyone" ON stone_images FOR SELECT USING (true);
CREATE POLICY "Users can manage own stone images" ON stone_images FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM stones WHERE stones.id = stone_id AND stones.owner_id = auth.uid()));
CREATE POLICY "Users can delete own stone images" ON stone_images FOR DELETE
  USING (EXISTS (SELECT 1 FROM stones WHERE stones.id = stone_id AND stones.owner_id = auth.uid()));

-- Profile images: public read, owner write
CREATE POLICY "Profile images are viewable by everyone" ON profile_images FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile images" ON profile_images FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete own profile images" ON profile_images FOR DELETE USING (auth.uid() = profile_id);

-- Chat: public read, authenticated insert
CREATE POLICY "Chat messages are viewable by everyone" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = author_id);

-- 9. Storage buckets (run in SQL editor)
INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('stones', 'stones', true);

-- Storage policies
CREATE POLICY "Profile images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'profiles');
CREATE POLICY "Users can upload profile images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profiles' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own profile images" ON storage.objects FOR UPDATE USING (bucket_id = 'profiles' AND auth.role() = 'authenticated');

CREATE POLICY "Stone images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'stones');
CREATE POLICY "Users can upload stone images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'stones' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own stone images" ON storage.objects FOR UPDATE USING (bucket_id = 'stones' AND auth.role() = 'authenticated');

-- 10. Enable Realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
