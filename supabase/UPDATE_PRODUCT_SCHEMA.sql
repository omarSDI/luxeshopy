-- 1. Add missing columns to products table if they don't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS image_type VARCHAR(20) DEFAULT 'url';

-- 2. Force Supabase to reload the schema cache (Crucial for PostgREST)
NOTIFY pgrst, 'reload schema';

-- 3. Confirmation message
SELECT 'Success: products table schema updated and cache reloaded.' as status;
