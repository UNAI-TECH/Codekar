-- Create the registrations table
create table public.registrations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Project / Team Details
  team_name text,
  project_title text,
  project_track text,
  project_idea text,
  registration_type text check (registration_type in ('individual', 'team')),
  
  -- Member Details (Stored as JSONB array)
  members jsonb,
  
  -- Payment Details
  amount numeric,
  transaction_id text, -- Stores Zoho Transaction ID or Order ID
  payment_status text default 'pending', -- pending, success, failed
  
  -- Full Request Backup (Optional but recommended)
  request_data jsonb
);

-- Set up Row Level Security (RLS)
-- Enable RLS
alter table public.registrations enable row level security;

-- Create Policy: Allow public to insert (for registration form)
create policy "Allow public insert"
on public.registrations
for insert
with check (true);

-- Create Policy: Allow users to view their own data (optional, if you have auth)
-- For now, maybe just allow read access to service role or specific logic
-- If you want a dashboard to view these, you'll need a policy for that.
-- For now, keeping it simple for the public form.

-- Create Policy: Allow public to read (Warning: This makes data public if you don't filter)
-- Ideally, you only want admins to read.
-- Assuming you will use the Supabase Dashboard to view data for now.
