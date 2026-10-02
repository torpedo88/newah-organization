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

-- Create community_photos table
CREATE TABLE IF NOT EXISTS community_photos (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  image_url VARCHAR(500) NOT NULL,
  alt_text TEXT NOT NULL,
  credit VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for URL lookups
CREATE INDEX IF NOT EXISTS idx_community_photos_slug ON community_photos(slug);

-- Create index on display_order for sorting
CREATE INDEX IF NOT EXISTS idx_community_photos_order ON community_photos(display_order);

-- Enable RLS on community_photos
ALTER TABLE community_photos ENABLE ROW LEVEL SECURITY;

-- Admin-only read/write, public read published photos
CREATE POLICY "Admin full access photos" ON community_photos
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Public read published photos" ON community_photos
  FOR SELECT USING (published = true);

-- Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  membership_type VARCHAR(50) NOT NULL CHECK (membership_type IN ('regular', 'family', 'lifetime')),
  membership_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (membership_status IN ('active', 'inactive', 'expired')),
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  renewal_date TIMESTAMP WITH TIME ZONE,
  annual_fee DECIMAL(10, 2),
  paid BOOLEAN DEFAULT false,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_memberships_email ON memberships(email);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(membership_status);

ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access memberships" ON memberships
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Public read active memberships" ON memberships
  FOR SELECT USING (membership_status = 'active');

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id BIGSERIAL PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL,
  donor_email VARCHAR(255) NOT NULL,
  donor_phone VARCHAR(20),
  amount DECIMAL(10, 2) NOT NULL,
  donation_type VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (donation_type IN ('general', 'scholarship', 'event', 'project')),
  purpose TEXT,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(donor_email);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(created_at);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access donations" ON donations
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Public read completed donations" ON donations
  FOR SELECT USING (payment_status = 'completed');

-- Create board_members table
CREATE TABLE IF NOT EXISTS board_members (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  bio TEXT,
  image_url VARCHAR(500),
  term_start DATE,
  term_end DATE,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_board_members_active ON board_members(active);
CREATE INDEX IF NOT EXISTS idx_board_members_order ON board_members(display_order);

ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access board_members" ON board_members
  FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Public read active board_members" ON board_members
  FOR SELECT USING (active = true);
