-- Add payment_method column to track how attendee will pay
-- Supports: 'cash' or 'zelle'
alter table mhapuja_registrations
add column payment_method text default 'pending';

-- Index for filtering by payment method
create index idx_mhapuja_registrations_payment_method on mhapuja_registrations(payment_method);
