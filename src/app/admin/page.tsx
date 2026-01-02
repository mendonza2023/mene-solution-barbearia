/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // COLOQUE SEU EMAIL AQUI PARA ACESSAR
  const ADMIN_EMAIL = "seu-email@gmail.com"; 

  useEffect(() => {
    const fetchAdminData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Se não estiver logado ou o email for diferente do seu, volta para o início
      if (!user || user.email !== ADMIN_EMAIL) {
        console.log("Acesso negado para:", user?.email);
        router.push('/');
        return;
      }

      const { data, error } = await supabase
        .from('agendamentos')
        .select(`*, profiles:user_id ( email )`)
        .order('data_hora', { ascending: true });

      if (!error) setAgendamentos(data || []);
      setLoading(false);
    };

    fetchAdminData();
  }, [router]);

  if (loading) return <div className="bg-black min-h-screen text-amber-500 flex items-center justify-center font-black italic animate-pulse">CARREGANDO SISTEMA MENE...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-end border-b border-zinc-800 pb-8">
          <div>
            <h1 className="text-4xl font-black uppercase italic">Painel <span className="text-amber-500">Mene</span></h1>
            <p className="text-zinc-500 text-xs font-bold tracking-[0.2em] mt-1">GESTÃO DE AGENDAMENTOS</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-500 font-bold uppercase">Faturamento Estimado</p>
            <p className="text-3xl font-black text-green-500">R$ {agendamentos.length * 50},00</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {agendamentos.length === 0 ? (
            <p className="text-zinc-600 italic">Nenhum agendamento encontrado...</p>
          ) : (
            agendamentos.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800 hover:border-amber-500/30 transition-all">
                <div className="flex items-center gap-6">
                  <div className="text-left">
                    <p className="font-black uppercase text-lg text-amber-500">{item.servico}</p>
                    <p className="text-zinc-400 text-xs font-bold">{item.profiles?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 mt-4 md:mt-0">
                  <div className="text-right">
                    <p className="text-xs font-bold text-zinc-500 uppercase">Data/Hora</p>
                    <p className="text-white font-black">
                      {new Date(item.data_hora).toLocaleDateString('pt-BR')} - {new Date(item.data_hora).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest ${item.pago ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}`}>
                    {item.pago ? 'Pago' : 'No Local'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}