#!/bin/bash

# Supabase Migration Helper
# Run this after setting SUPABASE_SERVICE_ROLE_KEY environment variable

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "ERROR: SUPABASE_SERVICE_ROLE_KEY not set"
  echo ""
  echo "Get your service role key from:"
  echo "  Supabase Dashboard → Settings → API → Service Role Key"
  echo ""
  echo "Then run:"
  echo "  export SUPABASE_SERVICE_ROLE_KEY='your-key-here'"
  echo "  bash run-migration.sh"
  exit 1
fi

npx tsx << 'EOF'
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://efojgqzsqfivdgfeinuj.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

const migration = `
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

CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_code ON registrations(registration_code);
CREATE INDEX IF NOT EXISTS idx_registrations_type ON registrations(registration_type);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert registrations" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read registrations" ON registrations FOR SELECT USING (true);
`;

async function runMigration() {
  try {
    const { error } = await supabase.rpc("exec", { sql: migration });
    if (error) {
      console.error("Migration failed:", error.message);
      process.exit(1);
    }
    console.log("✓ Migration successful!");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

runMigration();
EOF
