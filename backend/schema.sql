-- ABSU Marketplace — backend schema (PostgreSQL / Supabase)
-- Run in the Supabase SQL editor, or save as supabase/migrations/0001_init.sql

-- ==================== TABLES ====================

-- profiles (maps 1:1 to the frontend "User")
CREATE TABLE IF NOT EXISTS profiles (
  id          TEXT PRIMARY KEY,           -- matches auth.users.id for signed-up users
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  phone       TEXT NOT NULL,
  department  TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('student', 'seller')),
  status      TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('pending', 'verified', 'banned')),
  category    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- products
CREATE TABLE IF NOT EXISTS products (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  seller_id   TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  price       NUMERIC NOT NULL CHECK (price > 0),
  category    TEXT NOT NULL CHECK (category IN ('Fashion','Food','Textbooks','Electronics','Services','Web Development','Beauty')),
  description TEXT NOT NULL,
  images      TEXT[] NOT NULL DEFAULT '{}',
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_status_idx    ON products (status);
CREATE INDEX IF NOT EXISTS products_seller_idx    ON products (seller_id);
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

-- orders
CREATE TABLE IF NOT EXISTS orders (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  buyer_name  TEXT NOT NULL,
  items       JSONB NOT NULL,              -- [{ product_id, name, price, qty, seller_id }]
  total       NUMERIC NOT NULL CHECK (total >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_created_idx ON orders (created_at DESC);

-- ==================== ROW LEVEL SECURITY ====================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders  ENABLE ROW LEVEL SECURITY;

-- profiles: public read (directory), self-update
DROP POLICY IF EXISTS "Public read profiles" ON profiles;
CREATE POLICY "Public read profiles" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid()::text);

-- products: public can only read approved ones from non-banned sellers
DROP POLICY IF EXISTS "Public read approved products" ON products;
CREATE POLICY "Public read approved products" ON products
  FOR SELECT
  USING (
    status = 'approved'
    AND NOT EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = products.seller_id AND p.status = 'banned'
    )
  );

-- sellers manage their own products
DROP POLICY IF EXISTS "Sellers read own products" ON products;
CREATE POLICY "Sellers read own products" ON products
  FOR SELECT USING (seller_id = auth.uid()::text);

DROP POLICY IF EXISTS "Sellers insert own products" ON products;
CREATE POLICY "Sellers insert own products" ON products
  FOR INSERT WITH CHECK (
    seller_id = auth.uid()::text
    AND status = 'pending'                  -- new products always start pending
  );

DROP POLICY IF EXISTS "Sellers update own products" ON products;
CREATE POLICY "Sellers update own products" ON products
  FOR UPDATE USING (seller_id = auth.uid()::text);

DROP POLICY IF EXISTS "Sellers delete own products" ON products;
CREATE POLICY "Sellers delete own products" ON products
  FOR DELETE USING (seller_id = auth.uid()::text);

-- orders: anyone can create; only owner reads (admin uses service role)
DROP POLICY IF EXISTS "Anyone create orders" ON orders;
CREATE POLICY "Anyone create orders" ON orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Owner read orders" ON orders;
CREATE POLICY "Owner read orders" ON orders
  FOR SELECT USING (auth.uid()::text = id);
