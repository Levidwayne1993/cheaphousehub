-- ============================================================
--  CHEAPHOUSEHUB.COM — COMPLETE SUPABASE SQL SCHEMA
--  Run this ENTIRE script in your Supabase SQL Editor
--  Supabase Dashboard -> SQL Editor -> New Query -> Paste -> Run
-- ============================================================

-- ========================
--  1. EXTENSIONS
-- ========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";


-- ========================
--  2. PROPERTIES TABLE
-- ========================
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  state VARCHAR(2) DEFAULT '',
  zip VARCHAR(10) DEFAULT '',
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  original_price NUMERIC(12,2),
  bedrooms INTEGER,
  bathrooms NUMERIC(3,1),
  sqft INTEGER,
  lot_size TEXT,
  property_type TEXT DEFAULT 'single-family',
  listing_type TEXT DEFAULT 'cheap',
  description TEXT DEFAULT '',
  source TEXT NOT NULL DEFAULT 'unknown',
  source_url TEXT NOT NULL DEFAULT '',
  image_urls TEXT[] DEFAULT '{}',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  savings_pct INTEGER,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_url)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_properties_state ON properties(state);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price ASC);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_savings ON properties(savings_pct DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_source ON properties(source);
CREATE INDEX IF NOT EXISTS idx_properties_title_trgm ON properties USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_properties_city_trgm ON properties USING gin(city gin_trgm_ops);


-- ========================
--  3. SAVED SEARCHES TABLE
-- ========================
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT,
  state VARCHAR(2),
  listing_type TEXT,
  min_price NUMERIC(12,2),
  max_price NUMERIC(12,2),
  min_bedrooms INTEGER,
  notify BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ========================
--  4. PUSH LOG TABLE
-- ========================
CREATE TABLE IF NOT EXISTS push_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source TEXT DEFAULT 'cityscraper',
  properties_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'success',
  error_message TEXT,
  pushed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_log_date ON push_log(pushed_at DESC);


-- ========================
--  5. AUTO-UPDATE TRIGGER
-- ========================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();


-- ========================
--  6. ROW LEVEL SECURITY
-- ========================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_log ENABLE ROW LEVEL SECURITY;

-- Public read access for properties
CREATE POLICY "Public can read properties"
  ON properties FOR SELECT
  USING (true);

-- Service role can do everything
CREATE POLICY "Service role full access properties"
  ON properties FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access saved_searches"
  ON saved_searches FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access push_log"
  ON push_log FOR ALL
  USING (auth.role() = 'service_role');


