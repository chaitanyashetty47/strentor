import { createClient,SupabaseClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_PROJECT_URL as string
const supabaseKey = process.env.SUPABASE_API_KEY as string

export const supabase: SupabaseClient = createClient(supabaseUrl,supabaseKey)
