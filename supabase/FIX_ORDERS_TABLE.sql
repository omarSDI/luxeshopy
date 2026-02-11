-- FIX: Add missing 'items' column to orders table
-- This is critical for the "Place Order" button to work!

-- 1. Add 'items' column to orders table (JSONB to store cart items)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;

-- 2. Add 'payment_status' column (also seen in your code code)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'unpaid';

-- 3. Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders';

-- ============================================================================
-- DONE!
-- Your createOrder function sends 'items' in the payload.
-- Now the table has a place to store them.
--
-- Go to Supabase SQL Editor and RUN THIS SCRIPT immediately.
-- Then the "Place Order" button will work.
-- ============================================================================
