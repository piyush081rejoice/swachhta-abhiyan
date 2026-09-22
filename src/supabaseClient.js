import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://wajbheemcbbkcklxjvxi.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhamJoZWVtY2Jia2NrbHhqdnhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNjE4ODQsImV4cCI6MjEwNTYzNzg4NH0.OIKuHUxQHyiv7W1SsCc6o0wQxsG8D6WpKm2p4gL7Cho';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
