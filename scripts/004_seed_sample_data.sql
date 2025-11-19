-- Seed sample data for development and testing
-- This script creates sample users, accounts, and transactions

-- Note: This is for development only. In production, real user data would be created through the application.

-- Sample admin user (you'll need to create this user through Supabase Auth first)
-- INSERT INTO public.users (id, email, first_name, last_name, role, is_verified)
-- VALUES (
--   '00000000-0000-0000-0000-000000000001',
--   'admin@finovo.com',
--   'Admin',
--   'User',
--   'admin',
--   true
-- ) ON CONFLICT (id) DO NOTHING;

-- Sample transaction categories for reference
CREATE TABLE IF NOT EXISTS public.transaction_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.transaction_categories (name, icon, color) VALUES
  ('Food & Dining', '🍽️', '#FF6B6B'),
  ('Shopping', '🛍️', '#4ECDC4'),
  ('Transportation', '🚗', '#45B7D1'),
  ('Entertainment', '🎬', '#96CEB4'),
  ('Bills & Utilities', '💡', '#FFEAA7'),
  ('Healthcare', '🏥', '#DDA0DD'),
  ('Education', '📚', '#98D8C8'),
  ('Travel', '✈️', '#F7DC6F'),
  ('Income', '💰', '#82E0AA'),
  ('Transfer', '🔄', '#AED6F1')
ON CONFLICT (name) DO NOTHING;

-- Sample payees for bill payments
CREATE TABLE IF NOT EXISTS public.sample_payees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.sample_payees (name, category, logo_url) VALUES
  ('Electric Company', 'Utilities', '/placeholder.svg?height=40&width=40'),
  ('Water Department', 'Utilities', '/placeholder.svg?height=40&width=40'),
  ('Internet Provider', 'Utilities', '/placeholder.svg?height=40&width=40'),
  ('Credit Card Company', 'Credit Cards', '/placeholder.svg?height=40&width=40'),
  ('Mortgage Lender', 'Loans', '/placeholder.svg?height=40&width=40'),
  ('Insurance Company', 'Insurance', '/placeholder.svg?height=40&width=40')
ON CONFLICT DO NOTHING;
