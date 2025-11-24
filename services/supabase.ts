
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// NOTE: In a real application, these should be Environment Variables.
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
