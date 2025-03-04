import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zcfenhiwjcsrcngjfryz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjZmVuaGl3amNzcmNuZ2pmcnl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NDE1MTcsImV4cCI6MjA1NjUxNzUxN30.u49phsf_VHTBKEeGQZweuI0_KqMkq47HMMGVglLJeYQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);