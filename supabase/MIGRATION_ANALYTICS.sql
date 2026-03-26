-- Migration: Visitor Analytics Tracking
-- Tracks traffic sources, referrers, and device types

CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT,
    referrer TEXT,
    source VARCHAR(50) DEFAULT 'Direct',
    path TEXT,
    device_type VARCHAR(20) DEFAULT 'Desktop',
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Allow PUBLIC insert (anyone visiting the site can log their entrance)
CREATE POLICY "Public create visits" ON visits 
FOR INSERT TO anon, authenticated, service_role 
WITH CHECK (true);

-- Allow Admin read visits (for dashboard)
CREATE POLICY "Public read visits" ON visits 
FOR SELECT TO anon, authenticated, service_role 
USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at);
CREATE INDEX IF NOT EXISTS idx_visits_source ON visits(source);
