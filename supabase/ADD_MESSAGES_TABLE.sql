-- 1. Create 'messages' Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread', -- unread, read, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Public can insert (contact form)
CREATE POLICY "Public create messages" ON messages FOR INSERT WITH CHECK (true);
-- Only Admins can read/manage
CREATE POLICY "Admin manage messages" ON messages FOR ALL USING (true);

-- 4. Verification
SELECT * FROM messages;
