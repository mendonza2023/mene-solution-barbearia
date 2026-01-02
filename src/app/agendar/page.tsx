/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import BookingForm from "@/componetes/BookingForm";
import Link from 'next/link';

export default function AgendarPage() {
    interface UserMetadata {
  full_name?: string;
  phone?: string;
}

interface User {
  id: string;
  email?: string;
  user_metadata: UserMetadata;
}

// E no useState:
const [user, setUser] = useState<any | null>(null);  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-500 font-black animate-pulse uppercase tracking-widest">
          Carregando Agenda...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-xl mx-auto">
        
        {/* Cabeçalho da Página */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black uppercase italic italic">
            Agende seu <span className="text-amber-500">Estilo</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold tracking-[0.2em] mt-2">
            ESCOLHA O MELHOR HORÁRIO PARA VOCÊ
          </p>
        </div>

        {user ? (
          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
            <BookingForm />
            <p className="text-[10px] text-zinc-600 text-center mt-6 uppercase font-bold">
              Pagamento 100% seguro via Stripe ou no local
            </p>
          </div>
        ) : (
          <div className="bg-zinc-900 p-12 rounded-3xl border border-dashed border-zinc-800 text-center space-y-6">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-amber-500 text-2xl">🔒</span>
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase">Área Restrita</h2>
              <p className="text-zinc-400 text-sm mt-2">
                Você precisa estar logado para reservar um horário na Mene Solution.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link 
                href="/login" 
                className="bg-amber-500 text-black px-8 py-3 rounded-full font-black uppercase text-xs hover:bg-amber-400 transition-all"
              >
                Entrar na minha conta
              </Link>
              <Link 
                href="/cadastro" 
                className="text-zinc-500 hover:text-white text-xs uppercase font-bold transition-all"
              >
                Criar conta gratuita
              </Link>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-zinc-500 hover:text-amber-500 text-xs uppercase font-black transition-all">
            ← Voltar para o início
          </Link>
        </div>

      </div>
    </div>
  );
}