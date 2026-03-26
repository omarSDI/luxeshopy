-- 1. Create 'settings' Table
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insert Initial Shipping Fee
-- Stored as JSON to allow for structured data (e.g., amount + free threshold)
INSERT INTO settings (key, value) 
VALUES ('shipping_fee', '{"amount": 7, "free_threshold": 0}') 
ON CONFLICT (key) DO NOTHING;

-- 3. Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Public can read (storefront), Admins can manage
CREATE POLICY "Public read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON settings FOR ALL USING (true);

-- 5. Verification
SELECT * FROM settings;
