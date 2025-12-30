"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface Agendamento {
  id: string;
  servico: string;
  data_hora: string;
  pago: boolean;
  user_id: string;
}

export default function Perfil() {
  const [user, setUser] = useState<User | null>(null); 
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      if (!supabaseUser) {
        router.push('/login');
      } else {
        setUser(supabaseUser);
        const { data, error } = await supabase
          .from('agendamentos')
          .select('*')
          .eq('user_id', supabaseUser.id)
          .order('data_hora', { ascending: true });

        if (!error && data) {
          setAgendamentos(data as Agendamento[]);
        }
      }
      setLoading(false);
    };
    
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center font-bold italic animate-pulse text-sm tracking-[0.3em]">
        CARREGANDO MENE SOLUTION...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabeçalho do Perfil */}
        <header className="flex justify-between items-end border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-black italic uppercase">
              Mene <span className="text-amber-500">Solution</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
              {user?.email}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-[10px] font-black text-red-500 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-500/10 transition-all tracking-widest"
          >
            SAIR DA CONTA
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Lista de Agendamentos */}
          <div className="md:col-span-2 bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase italic tracking-tighter">
                Meus Agendamentos
              </h2>
              {/* Botão para levar o cliente para a Home onde está o formulário */}
              <button 
                onClick={() => router.push('/#servicos')}
                className="bg-amber-500 text-black text-[10px] font-black px-4 py-2 rounded-lg uppercase hover:bg-amber-600 transition-all active:scale-95"
              >
                + Novo Horário
              </button>
            </div>
            
            <div className="space-y-4">
              {agendamentos.length > 0 ? (
                agendamentos.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-black p-5 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all group">
                    <div>
                      <p className="font-black text-white uppercase tracking-tighter group-hover:text-amber-500 transition-colors">
                        {item.servico}
                      </p>
                      <p className="text-xs text-zinc-500 font-medium">
                        {new Date(item.data_hora).toLocaleDateString('pt-BR')} às {new Date(item.data_hora).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] px-3 py-1 rounded-full uppercase font-black tracking-widest ${item.pago ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {item.pago ? 'Confirmado' : 'Aguardando'}
                      </span>
                      
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-serif italic transition-colors ${item.pago ? 'border-green-500 text-green-500' : 'border-amber-500 text-amber-500'}`}>
                        i
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-3xl">
                    <p className="text-zinc-600 italic text-sm font-medium mb-4">Você ainda não possui agendamentos.</p>
                    <button 
                      onClick={() => router.push('/#servicos')}
                      className="text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20 px-6 py-3 rounded-full hover:bg-amber-500/5 transition-all"
                    >
                      Agendar meu primeiro corte
                    </button>
                </div>
              )}
            </div>
          </div>

          {/* Lateral de Pagamento */}
          <div className="bg-zinc-900/50 rounded-3xl p-8 border border-zinc-800 flex flex-col justify-between shadow-2xl h-fit">
            <div>
              <h2 className="text-xl font-black mb-2 uppercase italic tracking-tighter">Pagamento</h2>
              <p className="text-[10px] text-zinc-500 mb-6 font-bold uppercase tracking-wider leading-relaxed">
                Agilize seu atendimento e garanta sua vaga vinculando um cartão.
              </p>
            </div>
            <button className="w-full bg-zinc-800 text-zinc-400 font-black py-4 rounded-xl uppercase text-xs tracking-widest cursor-not-allowed opacity-50">
              Em Breve
            </button>
          </div>
          
        </section>
      </div>
    </div>
  );
}