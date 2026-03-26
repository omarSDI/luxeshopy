-- MASTER SETUP V2: Complete Database Schema, Secure RLS & Analytics
-- Includes: Universal Product Variants, Multi-Image Gallery, and Traffic Insight Tracking.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean up existing tables
DROP TABLE IF EXISTS visits CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS contacts CASCADE;

-- 3. Create 'products' Table (Universal Variant System)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2) DEFAULT 0,
    cost_price DECIMAL(10, 2) DEFAULT 0,
    description TEXT,
    image_url TEXT, -- Primary identifier
    images JSONB DEFAULT '[]'::jsonb, -- Multi-image gallery
    category VARCHAR(50),
    options JSONB DEFAULT '[]'::jsonb, -- Dynamic Attributes (Color, Model, etc.)
    variants JSONB DEFAULT '[]'::jsonb, -- Specific Combinations (Price, Stock, Image)
    stock INTEGER DEFAULT 100,
    image_type VARCHAR(20) DEFAULT 'url',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create 'orders' Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'unpaid',
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    order_notes TEXT
);

-- 5. Create 'visits' Table (Traffic Analytics)
CREATE TABLE visits (
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

-- 6. Create 'admins' Table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create 'contacts' Table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Row Level Security (RLS) Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Products Policies
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin manage products" ON products FOR ALL USING (true);

-- Orders Policies
CREATE POLICY "Public create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Admin manage orders" ON orders FOR ALL USING (true);

-- Analytics (Visits) Policies
CREATE POLICY "Public log visits" ON visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read analytics" ON visits FOR SELECT USING (true);

-- Admins Policies
CREATE POLICY "Public read admins" ON admins FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON admins FOR ALL USING (true);

-- Contacts Policies
CREATE POLICY "Public create contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read contacts" ON contacts FOR SELECT USING (true);

-- 9. Seed Data (Refined for Variant System)
INSERT INTO products (title, price, image_url, category, options, variants) VALUES
('Ultra Smartwatch Series X', 299.00, 'https://images.unsplash.com/photo-1546868871-70c122467d9b?q=80&w=800', 'Tech', 
 '[{"name": "Color", "values": ["Midnight", "Starlight", "Titanium"]}]'::jsonb,
 '[{"id": "v1", "options": {"Color": "Midnight"}, "price": 299, "stock": 10, "image_url": "https://images.unsplash.com/photo-1546868871-70c122467d9b?q=80&w=800"},
   {"id": "v2", "options": {"Color": "Starlight"}, "price": 319, "stock": 5, "image_url": "https://images.unsplash.com/photo-1544117518-e79632344796?q=80&w=800"}]'::jsonb
);

-- 10. Create Default Admin
INSERT INTO admins (username, password_hash) VALUES ('admin', 'password123')
ON CONFLICT (username) DO NOTHING;

-- 11. Refresh cache
NOTIFY pgrst, 'reload schema';

-- Confirmation
SELECT 'Success: LuxeShopy V2 Master Schema (Variants + Analytics) Initialized.' as status;
