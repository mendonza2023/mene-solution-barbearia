"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ServiceCard from "@/componetes/ServiceCard";
import BookingForm from "@/componetes/BookingForm";
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const fotos = ["/corte1.jpg", "/corte2.jpg", "/corte3.jpg"]; 

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  return (
    <div className="space-y-20 pb-20 bg-black text-white">
      
      {/* Hero Section */}
      <section className="h-[70vh] flex flex-col justify-center items-center text-center px-4 bg-zinc-950 border-b border-zinc-900">
        <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase italic">
          &quot;O seu estilo é a sua marca.&quot;
        </h2>
        <p className="text-amber-500 font-bold tracking-[0.3em] text-sm md:text-base">
          TRANSFORME SUA AUTOESTIMA NA MENE BARBEARIA
        </p>
      </section>

      {/* Serviços + Agendamento */}
      <section id="servicos" className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold border-l-4 border-amber-500 pl-4 uppercase tracking-tighter">
            Nossos Serviços
          </h3>
          {/* Passamos a informação se o usuário está logado para o Card */}
          <ServiceCard nome="Corte Masculino" preco={50} descricao="Corte moderno com acabamento premium." isLogged={!!user} />
          <ServiceCard nome="Barba & Toalha Quente" preco={40} descricao="Tratamento completo para sua barba." isLogged={!!user} />
          <ServiceCard nome="Combo Mene" preco={80} descricao="Corte + Barba + Hidratação." isLogged={!!user} />
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-6 uppercase tracking-tighter">Agendamento</h3>
          {user ? (
            <BookingForm />
          ) : (
            <div className="bg-zinc-900 p-10 rounded-3xl border border-dashed border-zinc-800 text-center space-y-4">
              <p className="text-zinc-400 uppercase text-sm font-bold">Faça login para realizar um agendamento</p>
              <Link href="/login" className="inline-block bg-amber-500 text-black px-8 py-3 rounded-full font-black uppercase text-xs hover:bg-amber-400 transition-all">
                Entrar agora
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Galeria... (continua igual) */}
    </div>
  );
}