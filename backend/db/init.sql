-- Create Supabase required roles
CREATE ROLE supabase_admin SUPERUSER NOLOGIN NOINHERIT;
CREATE ROLE authenticator NOLOGIN NOINHERIT;
CREATE ROLE anon NOLOGIN NOINHERIT;
CREATE ROLE authenticated NOLOGIN NOINHERIT;
CREATE ROLE service_role NOLOGIN NOINHERIT;

-- Grant permissions (these are standard Supabase grants)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
