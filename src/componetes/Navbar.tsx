"use client"
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // Verifique se este caminho está correto

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verifica o usuário atual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Escuta mudanças na autenticação (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <Link href="/" className="text-xl font-black italic tracking-tighter hover:text-amber-500 transition-colors">
          MENE <span className="text-amber-500">SOLUTION</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            Início
          </Link>

          {user ? (
            <>
              <Link href="/perfil" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                Minha Área
              </Link>
              <button 
                onClick={handleLogout}
                className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/cadastro" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                Cadastro
              </Link>
            </>
          )}

          <Link 
            href="/#servicos" 
            className="bg-amber-500 text-black px-4 py-2 rounded-full text-[10px] font-black uppercase hover:bg-amber-400 transition-all"
          >
            Agendar Agora
          </Link>
        </div>
      </div>
    </nav>
  );
}