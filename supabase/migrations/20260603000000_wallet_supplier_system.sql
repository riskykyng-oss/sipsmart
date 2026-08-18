/*
  # SipSmart — Wallet, Supplier & Order Enhancement Migration

  ## New Tables

  ### wallets
  - user_id (uuid, FK to auth.users)
  - balance (numeric) — starting $10
  - created_at (timestamptz)

  ### transactions
  - id (uuid, pk)
  - wallet_id (uuid, FK to wallets)
  - type (text) — deposit | hold | release | debit | refund
  - amount (numeric)
  - order_id (uuid, nullable)
  - description (text)
  - created_at (timestamptz)

  ### supplier_profiles
  - user_id (uuid, FK to auth.users, pk)
  - business_name (text)
  - phone (text)
  - is_active (boolean)
  - created_at (timestamptz)

  ## Modified Tables

  ### orders (new columns)
  - supplier_id (uuid, nullable)
  - estimated_delivery (timestamptz, nullable)
  - supplier_notes (text, nullable)
  - accepted_at (timestamptz, nullable)
*/

-- Wallets
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  balance numeric(10,2) NOT NULL DEFAULT 10.00,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet"
  ON wallets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage wallets"
  ON wallets FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit','hold','release','debit','refund')),
  amount numeric(10,2) NOT NULL,
  order_id uuid,
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()));

CREATE POLICY "Service role can manage transactions"
  ON transactions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Supplier profiles
CREATE TABLE IF NOT EXISTS supplier_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE supplier_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage suppliers"
  ON supplier_profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Suppliers can view own profile"
  ON supplier_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Add new columns to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS supplier_id uuid REFERENCES auth.users(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery timestamptz;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS supplier_notes text DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS accepted_at timestamptz;

-- Update status check to include new statuses
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN (
  'placed',
  'accepted',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'rejected'
));

-- Add role column to auth.users metadata is handled by Supabase
-- We'll use a user_roles table for flexibility
CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','supplier','admin')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage roles"
  ON user_roles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Update products to support supplier ownership
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_id uuid REFERENCES auth.users(id);
