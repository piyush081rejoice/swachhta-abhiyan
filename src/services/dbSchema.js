// Supabase Database Schema Script
// Run this directly in your Supabase SQL Editor:
// URL: https://supabase.com/dashboard/project/wajbheemcbbkcklxjvxi/sql

export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- SWACHHATA SANKALP PATRA PORTAL - COMPLETE DATABASE SCHEMA
-- ==============================================================================

-- 1. Create officers table
CREATE TABLE IF NOT EXISTS public.officers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mobile TEXT NOT NULL,
    municipality_type TEXT NOT NULL,
    municipality_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create sankalp_patras table
CREATE TABLE IF NOT EXISTS public.sankalp_patras (
    id TEXT PRIMARY KEY,
    citizen_name TEXT NOT NULL,
    address TEXT NOT NULL,
    ward_no TEXT NOT NULL,
    mobile_no TEXT NOT NULL,
    signature_data TEXT NOT NULL,
    officer_id TEXT NOT NULL,
    officer_name TEXT NOT NULL,
    municipality_type TEXT NOT NULL,
    municipality_name TEXT NOT NULL,
    submission_date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sankalp_patras ENABLE ROW LEVEL SECURITY;

-- 4. Create open access policies for public/anon web application access
DROP POLICY IF EXISTS "Public select officers" ON public.officers;
DROP POLICY IF EXISTS "Public insert officers" ON public.officers;
DROP POLICY IF EXISTS "Public update officers" ON public.officers;
DROP POLICY IF EXISTS "Public delete officers" ON public.officers;

CREATE POLICY "Public select officers" ON public.officers FOR SELECT USING (true);
CREATE POLICY "Public insert officers" ON public.officers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update officers" ON public.officers FOR UPDATE USING (true);
CREATE POLICY "Public delete officers" ON public.officers FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public select sankalp_patras" ON public.sankalp_patras;
DROP POLICY IF EXISTS "Public insert sankalp_patras" ON public.sankalp_patras;
DROP POLICY IF EXISTS "Public update sankalp_patras" ON public.sankalp_patras;
DROP POLICY IF EXISTS "Public delete sankalp_patras" ON public.sankalp_patras;

CREATE POLICY "Public select sankalp_patras" ON public.sankalp_patras FOR SELECT USING (true);
CREATE POLICY "Public insert sankalp_patras" ON public.sankalp_patras FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update sankalp_patras" ON public.sankalp_patras FOR UPDATE USING (true);
CREATE POLICY "Public delete sankalp_patras" ON public.sankalp_patras FOR DELETE USING (true);

-- 5. Grant permissions to anon and authenticated roles
GRANT ALL ON TABLE public.officers TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.sankalp_patras TO anon, authenticated, service_role;

-- 6. Seed initial officers data into Supabase
INSERT INTO public.officers (id, name, email, mobile, municipality_type, municipality_name, password_hash, status, created_at)
VALUES 
('off_1', 'રાજેશભાઈ પટેલ (Rajesh Patel)', 'rajesh.officer@gmail.com', '9876543210', 'મહાનગરપાલિકા', 'અમદાવાદ મહાનગરપાલિકા (AMC)', 'Officer@123', 'active', NOW()),
('off_2', 'પ્રિયાબેન શાહ (Priya Shah)', 'priya.officer@gmail.com', '9825123456', 'નગરપાલિકા', 'મોરબી નગરપાલિકા', 'Officer@123', 'active', NOW()),
('off_3', 'ભાવેશભાઈ મહેતા (Bhavesh Mehta)', 'bhavesh.officer@gmail.com', '9712345678', 'મહાનગરપાલિકા', 'સુરત મહાનગરપાલિકા (SMC)', 'Officer@123', 'active', NOW())
ON CONFLICT (email) DO NOTHING;

-- 7. Seed initial Sankalp Patras into Supabase
INSERT INTO public.sankalp_patras (id, citizen_name, address, ward_no, mobile_no, signature_data, officer_id, officer_name, municipality_type, municipality_name, submission_date, created_at)
VALUES
('sp_1', 'મહેન્દ્રભાઈ ગોવિંદભાઈ પટેલ', '૪૦૨, સરદાર પટેલ સોસાયટી, બોપલ રોડ', '૦૮', '9898011223', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="50"><path d="M 10 30 Q 50 5 90 30 T 170 25" stroke="%230f172a" stroke-width="2.5" fill="none"/></svg>', 'off_1', 'રાજેશભાઈ પટેલ (Rajesh Patel)', 'મહાનગરપાલિકા', 'અમદાવાદ મહાનગરપાલિકા (AMC)', '22/09/2026', NOW()),
('sp_2', 'ગીતાબેન અરવિંદભાઈ સોલંકી', 'પ્લોટ નં. ૨૩, ગણેશ કૃપા સોસાયટી, રવાપર રોડ', '૦૩', '9825678901', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="50"><path d="M 15 25 Q 60 10 110 35 T 165 20" stroke="%230f172a" stroke-width="2.5" fill="none"/></svg>', 'off_2', 'પ્રિયાબેન શાહ (Priya Shah)', 'નગરપાલિકા', 'મોરબી નગરપાલિકા', '22/09/2026', NOW())
ON CONFLICT (id) DO NOTHING;
`;
