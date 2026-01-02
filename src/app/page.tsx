/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ServiceCard from "@/componetes/ServiceCard";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  // Função para lidar com o clique no agendamento
  const handleAgendar = () => {
    if (user) {
      router.push('/agendar'); // Se logado, vai para agendamento
    } else {
      router.push('/cadastro'); // Se não logado, vai para cadastro
    }
  };

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
        <button 
          onClick={handleAgendar}
          className="mt-8 bg-amber-500 text-black px-10 py-4 rounded-full font-black uppercase text-sm hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
        >
          Agendar Agora
        </button>
      </section>

      {/* Seção de Serviços Centralizada (Agendamento removido daqui) */}
      <section id="servicos" className="max-w-4xl mx-auto px-4">
        <div className="space-y-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold uppercase tracking-tighter inline-block border-b-4 border-amber-500 pb-2">
              Nossos Serviços
            </h3>
            <p className="text-zinc-500 mt-4 uppercase text-xs font-bold tracking-widest">Excelência em cada detalhe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Adicionei a prop videoUrl. Você precisará atualizar o ServiceCard para renderizá-lo */}
            <ServiceCard 
              nome="Corte Masculino" 
              preco={50} 
              descricao="Corte moderno com acabamento premium." 
              videoUrl="/videos/corte.mp4"
              onClick={handleAgendar}
            />
            <ServiceCard 
              nome="Barba & Toalha Quente" 
              preco={40} 
              descricao="Tratamento completo para sua barba." 
              videoUrl="/videos/barba.mp4" 
              onClick={handleAgendar}
            />
            <ServiceCard 
              nome="Combo Mene" 
              preco={80} 
              descricao="Corte + Barba + Hidratação." 
              videoUrl="/videos/combo.mp4" 
              onClick={handleAgendar}
            />
          </div>
        </div>
      </section>

      {/* Rodapé de chamada para ação */}
      <section className="text-center py-20 bg-zinc-950">
          <p className="text-zinc-400 mb-6 uppercase text-sm font-bold">Pronto para mudar o visual?</p>
          <button 
            onClick={handleAgendar}
            className="bg-zinc-100 text-black px-8 py-3 rounded-full font-black uppercase text-xs hover:bg-amber-500 transition-all"
          >
            Clique aqui e escolha seu horário
          </button>
      </section>
    </div>
  );
}