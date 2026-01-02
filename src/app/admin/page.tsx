/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPainel() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pendentes: 0, faturamento: 0 });
  const router = useRouter();

  useEffect(() => {
    const verificarAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Lógica de proteção: substitua pelo seu e-mail de admin
      if (!user || user.email !== 'mendoncaoffice@gmail.com') {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('agendamentos')
        .select('*')
        .order('data_hora', { ascending: true });

      const lista = data || [];
      setAgendamentos(lista);

      // Calcular Estatísticas Rápidas
      const pendentes = lista.filter(a => !a.pago).length;
      const faturamento = lista.filter(a => a.pago).reduce((acc, curr) => acc + (curr.preco || 0), 0);
      
      setStats({ total: lista.length, pendentes, faturamento });
      setLoading(false);
    };

    verificarAdmin();
  }, [router]);

  const concluirPagamento = async (id: string) => {
    const { error } = await supabase
      .from('agendamentos')
      .update({ pago: true })
      .eq('id', id);

    if (!error) window.location.reload();
  };

  const deletarAgendamento = async (id: string) => {
    if(!confirm("Tem certeza que deseja remover este agendamento?")) return;
    const { error } = await supabase.from('agendamentos').delete().eq('id', id);
    if (!error) window.location.reload();
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-amber-500 font-black uppercase animate-pulse italic">Mene Admin...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* HEADER ADMIN */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              Mene <span className="text-amber-500 text-4xl">Control</span>
            </h1>
            <p className="text-zinc-500 text-[10px] font-bold tracking-[0.3em] uppercase mt-1">Gestão de Fluxo e Caixa</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all"
          >
            Sair do Painel
          </button>
        </header>

        {/* DASHBOARD DE STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem]">
            <p className="text-zinc-500 text-[9px] font-black uppercase mb-1">Faturamento (Pagos)</p>
            <h3 className="text-3xl font-black text-green-500 italic">R$ {stats.faturamento.toFixed(2)}</h3>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem]">
            <p className="text-zinc-500 text-[9px] font-black uppercase mb-1">Aguardando Pagamento</p>
            <h3 className="text-3xl font-black text-amber-500 italic">{stats.pendentes}</h3>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-[2rem]">
            <p className="text-zinc-500 text-[9px] font-black uppercase mb-1">Total de Agendamentos</p>
            <h3 className="text-3xl font-black text-white italic">{stats.total}</h3>
          </div>
        </div>

        {/* LISTA DE AGENDAMENTOS */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Próximos Horários</h2>
            <div className="h-px bg-zinc-800 flex-1"></div>
          </div>

          <div className="overflow-hidden bg-zinc-900/20 rounded-[2.5rem] border border-zinc-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="p-6 text-[10px] font-black uppercase text-zinc-500 italic">Cliente</th>
                  <th className="p-6 text-[10px] font-black uppercase text-zinc-500 italic">Serviço</th>
                  <th className="p-6 text-[10px] font-black uppercase text-zinc-500 italic">Data / Hora</th>
                  <th className="p-6 text-[10px] font-black uppercase text-zinc-500 italic">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase text-zinc-500 italic text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {agendamentos.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/40 transition-all group">
                    <td className="p-6">
                      <p className="text-sm font-black uppercase tracking-tight">{item.cliente_nome || 'Cliente Anonimo'}</p>
                      <p className="text-[10px] text-zinc-500 font-bold">{item.cliente_telefone}</p>
                    </td>
                    <td className="p-6">
                      <span className="text-[10px] font-black bg-zinc-800 px-3 py-1 rounded-full uppercase italic">{item.servico}</span>
                    </td>
                    <td className="p-6 text-xs text-zinc-400 font-bold">
                      {new Date(item.data_hora).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-6">
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${item.pago ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {item.pago ? '✓ Concluído' : '● Pendente'}
                      </span>
                    </td>
                    <td className="p-6 text-right space-x-3">
                      {!item.pago && (
                        <button 
                          onClick={() => concluirPagamento(item.id)}
                          className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg transition-all"
                          title="Marcar como Pago"
                        >
                          <span className="text-[10px] font-black uppercase px-2">Baixa</span>
                        </button>
                      )}
                      <button 
                        onClick={() => deletarAgendamento(item.id)}
                        className="bg-zinc-800 hover:bg-red-600 text-zinc-500 hover:text-white p-2 rounded-lg transition-all"
                        title="Remover"
                      >
                        <span className="text-[10px] font-black uppercase px-2">Remover</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="text-center pb-12">
          <p className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.5em]">Mene Solution System &copy; 2024</p>
        </footer>
      </div>
    </div>
  );
}