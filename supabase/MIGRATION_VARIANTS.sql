-- Migration: Universal Variant System
-- This script updates the 'products' table to support dynamic variants, options, and multi-image galleries.

-- 1. Add new columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

-- 2. Migrate existing single image to the images gallery (optional but helpful)
UPDATE products 
SET images = jsonb_build_array(image_url) 
WHERE image_url IS NOT NULL AND (images IS NULL OR images = '[]'::jsonb);

-- 3. Cleanup old footwear-specific columns (only if they exist)
-- We keep them for now to avoid breaking existing data until the new system is fully verified, 
-- but we'll stop using them in the application.
-- To completely remove them, uncomment the lines below:
-- ALTER TABLE products DROP COLUMN IF EXISTS sizes;
-- ALTER TABLE products DROP COLUMN IF EXISTS color;

-- 4. Ensure consistency
UPDATE products SET options = '[]'::jsonb WHERE options IS NULL;
UPDATE products SET variants = '[]'::jsonb WHERE variants IS NULL;
UPDATE products SET images = '[]'::jsonb WHERE images IS NULL;

-- 5. Refresh schema cache
NOTIFY pgrst, 'reload schema';
