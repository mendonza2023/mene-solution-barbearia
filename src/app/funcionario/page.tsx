/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function PainelFuncionario() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verificarAcesso = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Verifica se o usuário é funcionário ou admin
      const { data: perfil } = await supabase
        .from('clientes')
        .select('cargo')
        .eq('id', user.id)
        .single();

      if (perfil?.cargo !== 'funcionario' && perfil?.cargo !== 'admin') {
        alert("Acesso restrito a funcionários!");
        router.push('/perfil');
        return;
      }

      // Carrega os agendamentos do dia
      const { data } = await supabase
        .from('agendamentos')
        .select('*')
        .order('data_hora', { ascending: true });

      setAgendamentos(data || []);
      setLoading(false);
    };

    verificarAcesso();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-amber-500">CARREGANDO AGENDA...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black uppercase italic text-amber-500">Painel do Barbeiro</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Mene Solution • Agenda</p>
        </div>
        <button onClick={() => router.push('/')} className="text-[10px] font-bold text-zinc-500 border border-zinc-800 px-4 py-2 rounded-xl">SAIR</button>
      </header>

      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase mb-4">Cortes Agendados</h2>
        {agendamentos.length === 0 ? (
          <p className="text-zinc-600 italic">Nenhum agendamento para hoje.</p>
        ) : (
          agendamentos.map((item) => (
            <div key={item.id} className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 flex justify-between items-center">
              <div>
                <p className="text-xs font-black text-amber-500">{new Date(item.data_hora).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                <h3 className="font-bold text-lg">{item.cliente_nome}</h3>
                <p className="text-xs text-zinc-400 uppercase">{item.servico}</p>
              </div>
              <div className="text-right">
                 <span className={`text-[10px] font-black px-3 py-1 rounded-full ${item.pago ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                   {item.pago ? 'PAGO' : 'PAGAR NO LOCAL'}
                 </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}