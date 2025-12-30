"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface AgendamentoCompleto {
  id: string;
  servico: string;
  data_hora: string;
  pago: boolean;
  user_id: string;
  profiles: {
    email: string;
  };
}

export default function AdminPanel() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminData = async () => {
      // 1. Verifica se quem está acessando é você (Dono)
      const { data: { user } } = await supabase.auth.getUser();
      
      // Aqui você pode colocar o SEU email para proteger o painel
      if (!user || user.email !== 'seu-email@gmail.com') {
        alert("Acesso restrito ao administrador.");
        router.push('/');
        return;
      }

      // 2. Busca todos os agendamentos de todos os clientes
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          profiles:user_id ( email )
        `)
        .order('data_hora', { ascending: true });

      if (!error) setAgendamentos(data || []);
      setLoading(false);
    };

    fetchAdminData();
  }, [router]);

  if (loading) return <div className="bg-black min-h-screen text-white p-10 font-black italic animate-pulse">CARREGANDO SISTEMA MENE...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-zinc-800 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase italic italic">Painel <span className="text-amber-500">Controle</span></h1>
            <p className="text-zinc-500 text-xs font-bold tracking-[0.2em] mt-1">GESTÃO ESTRATÉGICA MENE SOLUTION</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-amber-500">R$ {agendamentos.filter(a => a.pago).length * 50},00</p>
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Receita Confirmada</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {agendamentos.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800 hover:border-amber-500/50 transition-all">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-black italic ${item.pago ? 'border-green-500 text-green-500' : 'border-zinc-700 text-zinc-700'}`}>
                  {item.pago ? 'OK' : '!!'}
                </div>
                <div>
                  <p className="font-black uppercase text-lg leading-none mb-1">{item.servico}</p>
                  <p className="text-zinc-500 text-xs font-medium">{item.profiles?.email || 'Cliente comum'}</p>
                </div>
              </div>

              <div className="flex items-center gap-8 mt-4 md:mt-0 text-right">
                <div>
                  <p className="text-sm font-bold uppercase">{new Date(item.data_hora).toLocaleDateString('pt-BR')}</p>
                  <p className="text-amber-500 font-black text-xl">{new Date(item.data_hora).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest ${item.pago ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {item.pago ? 'Pago' : 'Pendente'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}