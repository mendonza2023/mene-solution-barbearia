import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificação de segurança: Se as chaves sumirem, o console do navegador vai te avisar
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERRO: Chaves do Supabase não encontradas! Verifique seu arquivo .env.local ou as variáveis na Vercel.');
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);