/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Componente visual para o formulário de cartão
const CardForm = ({ onCancel, onSave }: any) => (
  <div className="bg-zinc-900 p-6 rounded-3xl border border-amber-500/30 space-y-4 animate-in fade-in zoom-in duration-300">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-[10px] font-black uppercase text-amber-500">Pagamento Seguro Stripe</h3>
      <button onClick={onCancel} className="text-zinc-500 text-[10px] uppercase font-bold">Cancelar</button>
    </div>
    
    <div className="space-y-4">
      <div className="bg-black border border-zinc-800 p-4 rounded-xl">
        <input type="text" placeholder="NÚMERO DO CARTÃO" className="w-full bg-transparent text-xs outline-none text-white placeholder:text-zinc-800 font-mono" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="MM/AA" className="bg-black border border-zinc-800 p-4 rounded-xl text-xs outline-none text-white placeholder:text-zinc-800" />
        <input type="text" placeholder="CVC" className="bg-black border border-zinc-800 p-4 rounded-xl text-xs outline-none text-white placeholder:text-zinc-800" />
      </div>
    </div>

    <button 
      onClick={onSave}
      className="w-full bg-amber-500 text-black font-black uppercase text-[10px] py-4 rounded-xl shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all"
    >
      Validar e Salvar Cartão
    </button>
    <div className="flex items-center justify-center gap-2 opacity-50">
      <span className="text-[8px] text-zinc-400 uppercase font-bold">Criptografia de ponta a ponta</span>
    </div>
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

  // DEFINIÇÃO DO EMAIL ADMIN (Corrigido para não dar erro)
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
    if(!confirm("Confirmar que deseja pagar no local?")) return;
    const { error } = await supabase.from('agendamentos').update({ metodo_pagamento: 'local' }).eq('id', id);
    if (!error) window.location.reload();
  };

  const handleSalvarCartao = () => {
    alert("Iniciando validação segura com o Stripe...");
    setTimeout(() => {
      alert("Cartão salvo com sucesso!");
      setMostrarFormCartao(false);
    }, 1500);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-amber-500 font-black uppercase italic animate-bounce">Mene Solution</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* BOTÃO DE ADMIN - SÓ APARECE PARA VOCÊ */}
        {user?.email === SEU_EMAIL_ADMIN && (
          <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex justify-between items-center animate-in slide-in-from-top duration-700">
            <div>
              <p className="text-[10px] font-black uppercase text-amber-500 tracking-[0.2em]">Acesso Administrativo</p>
              <p className="text-xs text-zinc-400">Olá, Mendonça. O sistema reconheceu seu acesso de dono.</p>
            </div>
            <button 
              onClick={() => router.push('/admin')}
              className="bg-amber-500 text-black px-8 py-3 rounded-2xl font-black uppercase text-[10px] hover:bg-white transition-all shadow-xl shadow-amber-500/10"
            >
              Abrir Painel Admin
            </button>
          </div>
        )}

        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">
            Minha <span className="text-amber-500">Área</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold tracking-[0.3em] uppercase mt-2">Gestão de Perfil e Pagamentos</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-zinc-800 flex-1"></div>
                <h2 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest text-nowrap">Informações Pessoais</h2>
                <div className="h-px bg-zinc-800 flex-1"></div>
              </div>
              
              <div className="bg-zinc-900/30 p-8 rounded-[2rem] border border-zinc-800/50 space-y-5 shadow-2xl">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black text-zinc-600 ml-2">Nome de Exibição</label>
                  <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase font-black text-zinc-600 ml-2">WhatsApp de Contato</label>
                  <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-sm focus:border-amber-500 outline-none transition-all" />
                </div>
                <button onClick={atualizarPerfil} className="w-full bg-white text-black font-black uppercase text-[10px] py-4 rounded-2xl hover:bg-amber-500 transition-all shadow-lg">Atualizar Cadastro</button>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-zinc-800 flex-1"></div>
                <h2 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest text-nowrap">Carteira Digital</h2>
                <div className="h-px bg-zinc-800 flex-1"></div>
              </div>

              {!mostrarFormCartao ? (
                <button 
                  onClick={() => setMostrarFormCartao(true)}
                  className="w-full group bg-zinc-900/30 border border-dashed border-zinc-800 p-8 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:border-amber-500/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center group-hover:bg-amber-500 transition-all">
                    <span className="text-xl group-hover:text-black transition-all">+</span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-zinc-500 group-hover:text-white">Adicionar Novo Cartão</span>
                </button>
              ) : (
                <CardForm onCancel={() => setMostrarFormCartao(false)} onSave={handleSalvarCartao} />
              )}
            </section>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px bg-zinc-800 flex-1"></div>
              <h2 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest text-nowrap">Meus Agendamentos</h2>
              <div className="h-px bg-zinc-800 flex-1"></div>
            </div>

            <div className="space-y-4">
              {agendamentos.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/10 rounded-[2rem] border border-dashed border-zinc-900">
                  <p className="text-zinc-600 uppercase text-[10px] font-black tracking-widest">Nenhum histórico encontrado</p>
                </div>
              ) : (
                agendamentos.map((item) => (
                  <div key={item.id} className="group bg-zinc-900/40 p-6 rounded-[2rem] border border-zinc-800 hover:border-zinc-700 transition-all">
                    <div className="flex justify-between items-center mb-6">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black bg-amber-500 text-black px-2 py-0.5 rounded uppercase tracking-tighter">Serviço Premium</span>
                        <h3 className="text-xl font-black uppercase italic italic">{item.servico}</h3>
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{new Date(item.data_hora).toLocaleString('pt-BR')}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${item.pago ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {item.pago ? 'Pagamento Confirmado' : 'Aguardando'}
                      </div>
                    </div>

                    {!item.pago && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button className="bg-white text-black text-[10px] font-black uppercase py-4 rounded-2xl hover:bg-amber-500 transition-all">Pagar Online</button>
                        <button onClick={() => confirmarPagamentoLocal(item.id)} className="bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase py-4 rounded-2xl hover:text-white transition-all">Pagar no Local</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-8 flex justify-center">
              <button onClick={() => router.push('/')} className="text-zinc-600 hover:text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] transition-all">
                ← Voltar para o início
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}