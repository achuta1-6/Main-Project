-- Investment Tables Migration for Finovo Banking App
-- This script creates tables for portfolio and investment tracking

-- Portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  total_value DECIMAL(15,2) DEFAULT 0.00,
  total_gain_loss DECIMAL(15,2) DEFAULT 0.00,
  total_gain_loss_percentage DECIMAL(7,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investments table
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('stock', 'crypto')),
  quantity DECIMAL(15,8) NOT NULL,
  average_cost DECIMAL(15,2) NOT NULL,
  current_price DECIMAL(15,2) DEFAULT 0.00,
  market_value DECIMAL(15,2) DEFAULT 0.00,
  gain_loss DECIMAL(15,2) DEFAULT 0.00,
  gain_loss_percentage DECIMAL(7,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON public.portfolios(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investments_portfolio_id ON public.investments(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_investments_symbol ON public.investments(symbol);
CREATE INDEX IF NOT EXISTS idx_investments_type ON public.investments(type);

-- Create trigger for portfolios updated_at
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for investments updated_at
CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON public.investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample portfolio for existing users (optional)
-- This will create a default portfolio for each user
INSERT INTO public.portfolios (user_id, name, description)
SELECT
  u.id,
  'My Portfolio',
  'Default investment portfolio'
FROM public.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.portfolios p WHERE p.user_id = u.id
);
