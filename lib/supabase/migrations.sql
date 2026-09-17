-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  registration_code VARCHAR(50) NOT NULL UNIQUE,
  registration_type VARCHAR(20) NOT NULL CHECK (registration_type IN ('food', 'donation')),
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  number_of_guests INTEGER,
  food_option VARCHAR(255),
  donation_amount DECIMAL(10, 2),
  payment_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for quick lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);

-- Create index on registration_code for lookups
CREATE INDEX IF NOT EXISTS idx_registrations_code ON registrations(registration_code);

-- Create index on registration_type for filtering
CREATE INDEX IF NOT EXISTS idx_registrations_type ON registrations(registration_type);

-- Enable RLS (Row Level Security)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new registrations
CREATE POLICY "Allow insert registrations" ON registrations
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read registrations (optional - can be restricted)
CREATE POLICY "Allow read registrations" ON registrations
  FOR SELECT USING (true);
