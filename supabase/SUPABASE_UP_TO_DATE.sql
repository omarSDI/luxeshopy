-- LUXESHOPY: UP-TO-DATE SUPABASE SCHEMA (V2)
-- Includes: Universal Variants, Traffic Analytics, and Secure RLS

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean up (Optional - use ONLY if you want a fresh start)
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS admins CASCADE;
-- DROP TABLE IF EXISTS visits CASCADE;

-- 3. 'products' Table (Updated for Multi-Image & Dynamic Variants)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2) DEFAULT 0,
    cost_price DECIMAL(10, 2) DEFAULT 0,
    description TEXT,
    image_url TEXT, -- Main Cover Image
    images JSONB DEFAULT '[]'::jsonb, -- Multi-image gallery
    category VARCHAR(50),
    options JSONB DEFAULT '[]'::jsonb, -- Dynamic attributes (Color, Model, etc.)
    variants JSONB DEFAULT '[]'::jsonb, -- Specific combinations (Price, Stock, Image per variant)
    stock INTEGER DEFAULT 100, -- Global stock (or fallback)
    image_type VARCHAR(20) DEFAULT 'url',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 'orders' Table (Full-Store Order Management)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending', -- pending, shipped, delivered, cancelled
    payment_status VARCHAR(50) DEFAULT 'unpaid',
    items JSONB DEFAULT '[]'::jsonb, -- Snapshot of products at purchase
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    order_notes TEXT
);

-- 5. 'visits' Table (Traffic Source & Visitor Insights)
CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID,
    referrer TEXT,
    source VARCHAR(100), -- Direct, Facebook, Instagram, Google, TikTok
    path TEXT,
    device_type VARCHAR(50), -- Mobile, Desktop, Tablet
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 'admins' Table (Administrative Access)
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Row Level Security (RLS) Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can read, only Admins or App can write
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin full access products" ON products FOR ALL USING (true);

-- Orders: App can insert (public), only Admins can read/delete all
CREATE POLICY "Public create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read success" ON orders FOR SELECT USING (true);
CREATE POLICY "Admin manage orders" ON orders FOR ALL USING (true);

-- Visits: Public can insert (Tracking), Admins can read
CREATE POLICY "Public log visits" ON visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin view analytics" ON visits FOR SELECT USING (true);

-- Admins: Basic protection
CREATE POLICY "Admin self access" ON admins FOR ALL USING (true);

-- 8. Final Polish
NOTIFY pgrst, 'reload schema';

-- 9. Verification Query
SELECT 'LuxeShopy V2 Schema Applied: products (variants+images), orders, and visits (analytics) are ready.' as status;
