import { createClient } from '@supabase/supabase-js';

// Usamos um link fake (placeholder) apenas para o Next.js não travar o build caso as variáveis demorem a carregar
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);