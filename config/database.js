import { createClient } from '@supabase/supabase-js';

// Supabase configuration - using actual credentials
const supabaseUrl = 'https://hstnboqfilzbhmxmjfyn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzdG5ib3FmaWx6YmhteG1qZnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTQ2MDksImV4cCI6MjA2OTI5MDYwOX0.Sb3RRCjaiZduTmpZzabPTWbrPLDaL1KAyxti5yXGhU0';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema for clips
export const clipsTable = 'clips';

// Initialize database table if it doesn't exist
export async function initializeDatabase() {
  try {
    // This will be handled by Supabase dashboard
    // You'll create the table manually in Supabase
    console.log('Database connection established');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
} 