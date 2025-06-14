-- YourTrainer Supabase Database Schema - GÜNCEL VE ÇALIŞAN VERSİYON
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- 1. PT (Personal Trainer) Users Tablosu - Varsa güncelle, yoksa oluştur
CREATE TABLE IF NOT EXISTS pt_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    kullanici_adi TEXT UNIQUE,
    ad TEXT,
    soyad TEXT,
    telefon TEXT,
    uzmanlik_alani TEXT,
    yas INTEGER,
    profil_resmi_url TEXT,
    ders_basina_ucret DECIMAL(10,2) DEFAULT 0,
    aktif_mi BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eksik kolonları ekle (hata vermez, varsa pas geçer)
DO $$ 
BEGIN 
    -- kullanici_adi kolonu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pt_users' AND column_name='kullanici_adi') THEN
        ALTER TABLE pt_users ADD COLUMN kullanici_adi TEXT UNIQUE;
    END IF;
    
    -- ad kolonu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pt_users' AND column_name='ad') THEN
        ALTER TABLE pt_users ADD COLUMN ad TEXT;
    END IF;
    
    -- soyad kolonu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pt_users' AND column_name='soyad') THEN
        ALTER TABLE pt_users ADD COLUMN soyad TEXT;
    END IF;
    
    -- telefon kolonu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pt_users' AND column_name='telefon') THEN
        ALTER TABLE pt_users ADD COLUMN telefon TEXT;
    END IF;
    
    -- uzmanlik_alani kolonu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pt_users' AND column_name='uzmanlik_alani') THEN
        ALTER TABLE pt_users ADD COLUMN uzmanlik_alani TEXT;
    END IF;
    
    -- yas kolonu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pt_users' AND column_name='yas') THEN
        ALTER TABLE pt_users ADD COLUMN yas INTEGER;
    END IF;
    
    -- profil_resmi_url kolonu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pt_users' AND column_name='profil_resmi_url') THEN
        ALTER TABLE pt_users ADD COLUMN profil_resmi_url TEXT;
    END IF;
    
    -- ders_basina_ucret kolonu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pt_users' AND column_name='ders_basina_ucret') THEN
        ALTER TABLE pt_users ADD COLUMN ders_basina_ucret DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- aktif_mi kolonu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pt_users' AND column_name='aktif_mi') THEN
        ALTER TABLE pt_users ADD COLUMN aktif_mi BOOLEAN DEFAULT true;
    END IF;
    
    -- updated_at kolonu yoksa ekle
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pt_users' AND column_name='updated_at') THEN
        ALTER TABLE pt_users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 2. Clients (Müşteriler) Tablosu  
CREATE TABLE IF NOT EXISTS clients (
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
    haftalik_ders_gunleri TEXT[],
    aktif_mi BOOLEAN DEFAULT true,
    notlar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Body Measurements (Vücut Ölçüleri) Tablosu
CREATE TABLE IF NOT EXISTS body_measurements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    boy INTEGER,
    kilo DECIMAL(5,2),
    bel_cevresi DECIMAL(5,2),
    kalca_cevresi DECIMAL(5,2),
    gogus_cevresi DECIMAL(5,2),
    kol_cevresi DECIMAL(5,2),
    bacak_cevresi DECIMAL(5,2),
    olcum_tarihi DATE DEFAULT CURRENT_DATE,
    notlar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Lessons (Dersler) Tablosu
CREATE TABLE IF NOT EXISTS lessons (
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
CREATE TABLE IF NOT EXISTS pt_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pt_id UUID REFERENCES pt_users(id) ON DELETE CASCADE,
    varsayilan_ders_ucreti DECIMAL(10,2) DEFAULT 0,
    calisme_saatleri JSONB,
    tatil_gunleri TEXT[],
    bildirim_tercihleri JSONB,
    tema_tercihi TEXT DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UNIQUE constraint'i ekle (yoksa)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'pt_settings_pt_id_key' 
        AND table_name = 'pt_settings'
    ) THEN
        ALTER TABLE pt_settings ADD CONSTRAINT pt_settings_pt_id_key UNIQUE (pt_id);
    END IF;
END $$;

-- Indexes for performance - IF NOT EXISTS
DO $$
BEGIN
    -- clients tablosu için index'ler
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clients_pt_id') THEN
        CREATE INDEX idx_clients_pt_id ON clients(pt_id);
    END IF;
    
    -- lessons tablosu için index'ler
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_lessons_client_id') THEN
        CREATE INDEX idx_lessons_client_id ON lessons(client_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_lessons_pt_id') THEN
        CREATE INDEX idx_lessons_pt_id ON lessons(pt_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_lessons_tarih') THEN
        CREATE INDEX idx_lessons_tarih ON lessons(ders_tarihi);
    END IF;
    
    -- body_measurements tablosu için index
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_body_measurements_client_id') THEN
        CREATE INDEX idx_body_measurements_client_id ON body_measurements(client_id);
    END IF;
END $$;

-- Row Level Security (RLS) Policies - Güvenli enable
DO $$
BEGIN
    -- RLS'yi aktif et (zaten aktifse hata vermez)
    ALTER TABLE pt_users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
    ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
    ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
    ALTER TABLE pt_settings ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN
    NULL; -- Hata olursa devam et
END $$;

-- Policies - varsa silip yeniden oluştur
DROP POLICY IF EXISTS "PT can view own data" ON pt_users;
DROP POLICY IF EXISTS "PT can view own clients" ON clients;
DROP POLICY IF EXISTS "PT can view own client measurements" ON body_measurements;
DROP POLICY IF EXISTS "PT can view own lessons" ON lessons;
DROP POLICY IF EXISTS "PT can view own settings" ON pt_settings;

-- Yeni policy'leri oluştur
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

-- Triggers for auto-updating timestamps - varsa silip yeniden oluştur
DROP TRIGGER IF EXISTS update_pt_users_updated_at ON pt_users;
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
DROP TRIGGER IF EXISTS update_pt_settings_updated_at ON pt_settings;

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
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'kullanici_adi', split_part(NEW.email, '@', 1)), 
    COALESCE(NEW.raw_user_meta_data->>'ad', 'PT'), 
    COALESCE(NEW.raw_user_meta_data->>'soyad', 'User'),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    kullanici_adi = COALESCE(EXCLUDED.kullanici_adi, pt_users.kullanici_adi),
    ad = COALESCE(EXCLUDED.ad, pt_users.ad),
    soyad = COALESCE(EXCLUDED.soyad, pt_users.soyad),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auth user oluşturulunca pt_users'a da ekle - varsa silip yeniden oluştur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
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
-- BAŞARI MESAJI
-- =====================================

DO $$
BEGIN
    RAISE NOTICE '🎉 YourTrainer Database Schema başarıyla kuruldu!';
    RAISE NOTICE '✅ Tüm tablolar hazır';
    RAISE NOTICE '✅ Trigger''lar aktif';
    RAISE NOTICE '✅ RLS policies kuruldu';
    RAISE NOTICE '🚀 Sistem kullanıma hazır!';
END $$;
