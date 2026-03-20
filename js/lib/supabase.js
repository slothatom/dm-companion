// =============================================
//   supabase.js - Supabase client for DM Companion
// =============================================

// ── Supabase credentials ──────────────────────────────────
// The anon key below is safe to expose publicly in client-side code.
// Row-Level Security (RLS) is enabled on all tables and protects data.
// This key only grants access that the RLS policies explicitly allow -
// unauthenticated users cannot read or modify other users' data.
// This is intentional by design, not a security oversight.
const SUPABASE_URL      = 'https://ocqorodigunshmhefaes.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcW9yb2RpZ3Vuc2htaGVmYWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MjQ5NTMsImV4cCI6MjA4OTMwMDk1M30.xvGUaN3AZzaEkkIRdZkNTZVcn9EukibXBBHVe4utBjo';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
