/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Perfil() {
  const [user, setUser] = useState<any>(null);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const router = useRouter();

  useEffect(() => {
    const carregarDados = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setNome(user.user_metadata?.full_name || '');
      setTelefone(user.user_metadata?.phone || '');

      const { data } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('user_id', user.id)
        .order('data_hora', { ascending: false });

      setAgendamentos(data || []);
      setLoading(false);
    };
    carregarDados();
  }, [router]);

  const atualizarPerfil = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: nome, phone: telefone }
    });
    if (error) alert("Erro ao atualizar");
    else alert("Perfil atualizado com sucesso!");
  };

  if (loading) return <div className="min-h-screen bg-black text-amber-500 p-10 font-black uppercase italic">Carregando Mene Solution...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* COLUNA ESQUERDA: EDITAR INFORMAÇÕES E CARTÕES */}
        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-black uppercase italic mb-6 border-l-4 border-amber-500 pl-4">Meus Dados</h2>
            <div className="space-y-4 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">Nome Completo</label>
                <input 
                  type="text" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:border-amber-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-zinc-500 ml-2">WhatsApp / Telefone</label>
                <input 
                  type="text" 
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm focus:border-amber-500 outline-none transition-all"
                />
              </div>
              <button 
                onClick={atualizarPerfil}
                className="w-full bg-amber-500 text-black font-black uppercase text-xs py-3 rounded-xl hover:bg-amber-400 transition-all"
              >
                Salvar Alterações
              </button>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase italic mb-6 border-l-4 border-zinc-500 pl-4 text-zinc-400">Meus Cartões</h2>
            <div className="bg-zinc-900/50 p-6 rounded-3xl border border-dashed border-zinc-800 text-center">
              <p className="text-xs text-zinc-500 uppercase font-bold mb-4">Nenhum cartão cadastrado</p>
              <button className="bg-zinc-800 text-white font-black uppercase text-[10px] px-6 py-2 rounded-full hover:bg-zinc-700 transition-all">
                + Adicionar Novo Cartão
              </button>
            </div>
          </section>
        </div>

        {/* COLUNA DIREITA: AGENDAMENTOS E PAGAMENTO */}
        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase italic border-l-4 border-amber-500 pl-4">Meus Agendamentos</h2>
          
          {agendamentos.length === 0 ? (
            <p className="text-zinc-600 italic">Você não possui agendamentos...</p>
          ) : (
            agendamentos.map((item) => (
              <div key={item.id} className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black uppercase text-lg leading-tight">{item.servico}</p>
                    <p className="text-zinc-500 text-xs font-bold mt-1">
                      {new Date(item.data_hora).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.pago ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {item.pago ? 'Pago' : 'Pendente'}
                  </span>
                </div>

                {!item.pago && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/50">
                    <button className="bg-white text-black text-[10px] font-black uppercase py-2 rounded-lg hover:bg-zinc-200">
                      Pagar com Cartão/Pix
                    </button>
                    <button className="bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase py-2 rounded-lg hover:text-white transition-all">
                      Pagar no Local
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
          
          <button 
            onClick={() => router.push('/')}
            className="text-zinc-600 hover:text-amber-500 text-[10px] font-black uppercase transition-all tracking-widest"
          >
            ← Voltar para o Início
          </button>
        </div>
      </div>
    </div>
  );
}