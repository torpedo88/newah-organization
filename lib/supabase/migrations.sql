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

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  capacity INTEGER,
  image_url VARCHAR(500),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for URL lookups
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Create index on event_date for sorting
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);

-- Create index on published for filtering
CREATE INDEX IF NOT EXISTS idx_events_published ON events(published);

-- Enable RLS on events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Admin-only read/write, public read published events
CREATE POLICY "Admin full access events" ON events
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Public read published events" ON events
  FOR SELECT USING (published = true);
