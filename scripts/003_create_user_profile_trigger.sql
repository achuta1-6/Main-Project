-- Create a trigger to automatically create a user profile when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    'customer'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create a default checking account for new users
  INSERT INTO public.accounts (user_id, account_number, account_type, balance, available_balance)
  VALUES (
    NEW.id,
    'CHK-' || UPPER(SUBSTRING(NEW.id::text, 1, 8)),
    'checking',
    0.00,
    0.00
  );

  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
