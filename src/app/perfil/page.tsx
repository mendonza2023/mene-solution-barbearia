/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Componente para o formulário de cartão (Stripe Simulation)
const CardForm = ({ onCancel, onSave }: any) => (
  <div className="bg-zinc-900 p-6 rounded-3xl border border-amber-500/30 space-y-4 animate-in fade-in zoom-in duration-300">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-[10px] font-black uppercase text-amber-500">Pagamento Seguro Stripe</h3>
      <button onClick={onCancel} className="text-zinc-500 text-[10px] uppercase font-bold">Cancelar</button>
    </div>
    <div className="space-y-4">
      <input type="text" placeholder="NÚMERO DO CARTÃO" className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-xs outline-none text-white font-mono" />
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="MM/AA" className="bg-black border border-zinc-800 p-4 rounded-xl text-xs outline-none text-white" />
        <input type="text" placeholder="CVC" className="bg-black border border-zinc-800 p-4 rounded-xl text-xs outline-none text-white" />
      </div>
    </div>
    <button onClick={onSave} className="w-full bg-amber-500 text-black font-black uppercase text-[10px] py-4 rounded-xl hover:bg-amber-400 transition-all">
      Validar e Salvar Cartão
    </button>
  </div>
);

export default function Perfil() {
  const [user, setUser] = useState<any>(null);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mostrarFormCartao, setMostrarFormCartao] = useState(false);
  const router = useRouter();

  // IDENTIFICADOR DO DONO (mendoncaoffice@gmail.com)
  const SEU_EMAIL_ADMIN = 'mendoncaoffice@gmail.com'; 

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

  const confirmarPagamentoLocal = async (id: string) => {
    if(!confirm("Deseja pagar na barbearia?")) return;
    const { error } = await supabase.from('agendamentos').update({ metodo_pagamento: 'local' }).eq('id', id);
    if (!error) window.location.reload();
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-amber-500 font-black">CARREGANDO...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* BLOCO ADMINISTRATIVO (Só aparece para mendoncaoffice@gmail.com) */}
        {user?.email === SEU_EMAIL_ADMIN && (
          <div className="mb-10 p-6 bg-amber-500/10 border border-amber-500/30 rounded-[2rem] flex justify-between items-center border-dashed">
            <div>
              <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Painel do Proprietário</p>
              <h2 className="text-sm font-bold text-zinc-300">Bem-vindo de volta, Mendonça.</h2>
            </div>
            <button 
              onClick={() => router.push('/admin')}
              className="bg-amber-500 text-black px-8 py-3 rounded-2xl font-black uppercase text-[10px] hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
            >
              Gerenciar Barbearia
            </button>
          </div>
        )}

        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter">Minha <span className="text-amber-500">Área</span></h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2 underline decoration-amber-500/50">Mene Solution Premium</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* COLUNA: MEUS DADOS */}
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-zinc-900/30 p-8 rounded-[2rem] border border-zinc-800/50 space-y-6">
              <h2 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Meus Dados</h2>
              <div className="space-y-4">
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none" />
                <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="WhatsApp" className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none" />
                <button onClick={atualizarPerfil} className="w-full bg-white text-black font-black uppercase text-[10px] py-4 rounded-2xl hover:bg-amber-500 transition-all">Salvar Alterações</button>
              </div>
            </section>

            <section className="bg-zinc-900/30 p-8 rounded-[2rem] border border-zinc-800/50 space-y-6">
              <h2 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Carteira</h2>
              {!mostrarFormCartao ? (
                <button onClick={() => setMostrarFormCartao(true)} className="w-full py-10 border border-dashed border-zinc-800 rounded-2xl text-zinc-600 text-[10px] font-black uppercase hover:text-white transition-all">
                  + Adicionar Cartão
                </button>
              ) : (
                <CardForm onCancel={() => setMostrarFormCartao(false)} onSave={() => { alert("Cartão Salvo!"); setMostrarFormCartao(false); }} />
              )}
            </section>
          </div>

          {/* COLUNA: AGENDAMENTOS */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Próximos Cortes</h2>
            {agendamentos.length === 0 ? (
              <p className="text-zinc-700 italic text-sm text-center py-20">Nenhum agendamento encontrado...</p>
            ) : (
              agendamentos.map((item) => (
                <div key={item.id} className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-black uppercase italic">{item.servico}</h3>
                      <p className="text-zinc-500 text-xs font-bold">{new Date(item.data_hora).toLocaleString('pt-BR')}</p>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase ${item.pago ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {item.pago ? 'Pago' : 'Pendente'}
                    </span>
                  </div>
                  {!item.pago && (
                    <div className="flex gap-2">
                      <button className="flex-1 bg-white text-black text-[9px] font-black uppercase py-3 rounded-xl">Pagar Online</button>
                      <button onClick={() => confirmarPagamentoLocal(item.id)} className="flex-1 bg-zinc-800 text-zinc-400 text-[9px] font-black uppercase py-3 rounded-xl">Pagar no Local</button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}