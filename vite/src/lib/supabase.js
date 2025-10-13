import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pjjwrpcbrceihcdobmnz.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqandycGNicmNlaWhjZG9ibW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDQxOTMsImV4cCI6MjA3Mjk4MDE5M30.ZIIcehFUg--0DgmVv1ywXAy3nx6IFkfAvJ648fmSm44"

/**
 * Creates and exports a Supabase client instance configured with
 * environment variables.
 *
 * This client can be imported and used throughout the application for
 * authentication and database operations.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
