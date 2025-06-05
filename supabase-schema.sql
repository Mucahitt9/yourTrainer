-- YourTrainer Supabase Database Schema
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- 1. PT (Personal Trainer) Users Tablosu
CREATE TABLE pt_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    kullanici_adi TEXT UNIQUE NOT NULL,
    ad TEXT NOT NULL,
    soyad TEXT NOT NULL,
    telefon TEXT,
    uzmanlik_alani TEXT,
    yas INTEGER,
    profil_resmi_url TEXT,
    ders_basina_ucret DECIMAL(10,2) DEFAULT 0,
    aktif_mi BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Clients (Müşteriler) Tablosu  
CREATE TABLE clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pt_id UUID REFERENCES pt_users(id) ON DELETE CASCADE,
    ad TEXT NOT NULL,
    soyad TEXT NOT NULL,
    telefon TEXT,
    email TEXT,
    yas INTEGER,
    alinan_ders_sayisi INTEGER DEFAULT 0,
    ders_basina_ucret DECIMAL(10,2) DEFAULT 0,
    toplam_ucret DECIMAL(10,2) DEFAULT 0,
    ders_baslangic_tarihi DATE,
    tahmini_bitis_tarihi DATE,
    haftalik_ders_gunleri TEXT[], -- JSON array of days
    aktif_mi BOOLEAN DEFAULT true,
    notlar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Body Measurements (Vücut Ölçüleri) Tablosu
CREATE TABLE body_measurements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    boy INTEGER, -- cm
    kilo DECIMAL(5,2), -- kg
    bel_cevresi DECIMAL(5,2), -- cm  
    kalca_cevresi DECIMAL(5,2), -- cm
    gogus_cevresi DECIMAL(5,2), -- cm
    kol_cevresi DECIMAL(5,2), -- cm
    bacak_cevresi DECIMAL(5,2), -- cm
    olcum_tarihi DATE DEFAULT CURRENT_DATE,
    notlar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Lessons (Dersler) Tablosu
CREATE TABLE lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    pt_id UUID REFERENCES pt_users(id) ON DELETE CASCADE,
    ders_tarihi DATE NOT NULL,
    ders_saati TIME,
    durum TEXT DEFAULT 'planli' CHECK (durum IN ('planli', 'tamamlandi', 'iptal', 'eksik')),
    notlar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Settings (PT Ayarları) Tablosu
CREATE TABLE pt_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pt_id UUID REFERENCES pt_users(id) ON DELETE CASCADE UNIQUE,
    varsayilan_ders_ucreti DECIMAL(10,2) DEFAULT 0,
    calisme_saatleri JSONB, -- Working hours
    tatil_gunleri TEXT[], -- Holiday days
    bildirim_tercihleri JSONB,
    tema_tercihi TEXT DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_clients_pt_id ON clients(pt_id);
CREATE INDEX idx_lessons_client_id ON lessons(client_id);
CREATE INDEX idx_lessons_pt_id ON lessons(pt_id);
CREATE INDEX idx_lessons_tarih ON lessons(ders_tarihi);
CREATE INDEX idx_body_measurements_client_id ON body_measurements(client_id);

-- Row Level Security (RLS) Policies
ALTER TABLE pt_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE pt_settings ENABLE ROW LEVEL SECURITY;

-- PT'ler sadece kendi verilerini görsün
CREATE POLICY "PT can view own data" ON pt_users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "PT can view own clients" ON clients
    FOR ALL USING (pt_id = auth.uid());

CREATE POLICY "PT can view own client measurements" ON body_measurements
    FOR ALL USING (client_id IN (SELECT id FROM clients WHERE pt_id = auth.uid()));

CREATE POLICY "PT can view own lessons" ON lessons
    FOR ALL USING (pt_id = auth.uid());

CREATE POLICY "PT can view own settings" ON pt_settings
    FOR ALL USING (pt_id = auth.uid());

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_pt_users_updated_at 
    BEFORE UPDATE ON pt_users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON clients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at 
    BEFORE UPDATE ON lessons 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pt_settings_updated_at 
    BEFORE UPDATE ON pt_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================
-- KAYİT SONRASI OTOMATİK İŞLEMLER
-- =====================================

-- Yeni PT kaydolunca otomatik pt_users tablosuna ekleme trigger'ı
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.pt_users (id, email, kullanici_adi, ad, soyad, created_at)
  VALUES (NEW.id, NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'kullanici_adi', split_part(NEW.email, '@', 1)), 
    COALESCE(NEW.raw_user_meta_data->>'ad', 'PT'), 
    COALESCE(NEW.raw_user_meta_data->>'soyad', 'User'),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auth user oluşturulunca pt_users'a da ekle
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- =====================================
-- İSTATİSTİK HESAPLAMA FONKSİYONU
-- =====================================

-- PT için temel istatistikleri hesaplayan fonksiyon
CREATE OR REPLACE FUNCTION get_pt_stats(pt_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  WITH stats AS (
    SELECT 
      COUNT(*) as total_clients,
      COUNT(CASE WHEN aktif_mi = true THEN 1 END) as active_clients,
      COALESCE(SUM(toplam_ucret), 0) as total_revenue,
      COALESCE(AVG(ders_basina_ucret), 0) as avg_session_price
    FROM clients 
    WHERE clients.pt_id = get_pt_stats.pt_id
  )
  SELECT to_json(stats) INTO result FROM stats;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================
-- DEMO VERİ (OPSİYONEL)
-- =====================================

-- İlk test için bir demo PT hesabı oluşturmak isterseniz:
-- (Bu kısmı çalıştırmak isteğe bağlıdır)

/*
-- Test PT hesabı
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'test@yourtrainer.com',
  crypt('test123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"ad": "Test", "soyad": "Trainer", "kullanici_adi": "test.trainer"}'::jsonb
);

-- Test PT profili
INSERT INTO pt_users (
  id,
  email,
  kullanici_adi,
  ad,
  soyad,
  uzmanlik_alani,
  yas,
  ders_basina_ucret
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'test@yourtrainer.com',
  'test.trainer',
  'Test',
  'Trainer',
  'Genel Fitness',
  30,
  400.00
);
*/
