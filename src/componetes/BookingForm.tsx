"use client"
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function BookingForm() {
  const [servico, setServico] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState<'stripe' | 'local'>('stripe'); // Novo estado
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const precos: Record<string, number> = {
    "Corte Masculino": 50,
    "Barba": 40,
    "Combo Completo": 80
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Você precisa estar logado para agendar!");
        router.push('/login');
        return;
      }

      const dataHoraAgendamento = new Date(`${data}T${hora}:00`).toISOString();

      // Verificar disponibilidade
      const { data: existente } = await supabase
        .from('agendamentos')
        .select('id')
        .eq('data_hora', dataHoraAgendamento)
        .maybeSingle();

      if (existente) {
        alert("🚫 Este horário já foi reservado. Escolha outro.");
        setLoading(false);
        return;
      }

      // Inserir agendamento
      const { data: novoAgendamento, error: insertError } = await supabase
        .from('agendamentos')
        .insert([
          { 
            servico, 
            data_hora: dataHoraAgendamento, 
            user_id: user.id,
            pago: false,
            metodo_pagamento: metodoPagamento // Importante salvar a intenção no banco
          }
        ])
        .select();

      if (insertError) throw insertError;

      // LÓGICA CONDICIONAL:
      if (metodoPagamento === 'stripe') {
        // Se escolheu pagar agora, vai para o checkout
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            servico, 
            preco: precos[servico], 
            agendamentoId: novoAgendamento?.[0]?.id 
          }),
        });

        const session = await response.json();
        if (session.url) window.location.href = session.url;
        else throw new Error("Falha ao gerar link de pagamento.");
      } else {
        // Se escolheu pagar no local, vai direto para o perfil
        alert("✅ Agendamento realizado! Pagamento será feito na barbearia.");
        router.push('/perfil');
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro inesperado";
      alert(`Erro: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="servicos" onSubmit={handleSubmit} className="max-w-md mx-auto bg-zinc-900 p-8 rounded-3xl border border-zinc-800 space-y-4">
      <h3 className="text-xl font-black uppercase italic text-amber-500 mb-6 text-center">Agende seu Estilo</h3>
      
      <select 
        required
        className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-amber-500 transition-colors"
        value={servico}
        onChange={(e) => setServico(e.target.value)}
      >
        <option value="">Selecione o Serviço</option>
        <option value="Corte Masculino">Corte Masculino - R$ 50,00</option>
        <option value="Barba">Barba Imperial - R$ 40,00</option>
        <option value="Combo Completo">Corte + Barba - R$ 80,00</option>
      </select>

      <div className="grid grid-cols-2 gap-4">
        <input 
          required
          type="date" 
          className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-amber-500"
          value={data}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setData(e.target.value)}
        />
        <input 
          required
          type="time" 
          className="w-full bg-black border border-zinc-800 p-4 rounded-xl text-white outline-none focus:border-amber-500"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
        />
      </div>

      {/* SELEÇÃO DE MÉTODO DE PAGAMENTO */}
      <div className="flex gap-2 p-1 bg-black rounded-xl border border-zinc-800">
        <button
          type="button"
          onClick={() => setMetodoPagamento('stripe')}
          className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${metodoPagamento === 'stripe' ? 'bg-amber-500 text-black' : 'text-zinc-500'}`}
        >
          Cartão / Pix
        </button>
        <button
          type="button"
          onClick={() => setMetodoPagamento('local')}
          className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase transition-all ${metodoPagamento === 'local' ? 'bg-amber-500 text-black' : 'text-zinc-500'}`}
        >
          Pagar no Local
        </button>
      </div>

      <button 
        disabled={loading}
        type="submit"
        className="w-full bg-amber-500 text-black font-black py-4 rounded-xl uppercase hover:bg-amber-600 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/10"
      >
        {loading ? 'Processando...' : metodoPagamento === 'stripe' ? 'Confirmar e Pagar Agora' : 'Confirmar Agendamento'}
      </button>
    </form>
  );
}