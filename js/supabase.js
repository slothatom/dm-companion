// =============================================
//   supabase.js — Supabase client for DM Companion
// =============================================

const SUPABASE_URL      = 'https://ocqorodigunshmhefaes.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jcW9yb2RpZ3Vuc2htaGVmYWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MjQ5NTMsImV4cCI6MjA4OTMwMDk1M30.xvGUaN3AZzaEkkIRdZkNTZVcn9EukibXBBHVe4utBjo';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
