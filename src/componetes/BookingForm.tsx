"use client"
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function BookingForm() {
  const [servico, setServico] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Tabela de preços tipada corretamente
  const precos: Record<string, number> = {
    "Corte Masculino": 50,
    "Barba": 40,
    "Combo Completo": 80
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Verificar se o usuário está logado
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Você precisa estar logado para agendar!");
        router.push('/login');
        return;
      }

      const dataHoraAgendamento = new Date(`${data}T${hora}:00`).toISOString();

      // 2. Verificar disponibilidade
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

      // 3. Inserir agendamento e obter o ID
      const { data: novoAgendamento, error: insertError } = await supabase
        .from('agendamentos')
        .insert([
          { 
            servico, 
            data_hora: dataHoraAgendamento, 
            user_id: user.id,
            pago: false 
          }
        ])
        .select();

      if (insertError) throw insertError;

      // 4. CHAMADA AO STRIPE
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

      if (session.url) {
        window.location.href = session.url;
      } else {
        throw new Error("Falha ao gerar link de pagamento.");
      }

    } catch (error: unknown) {
      // Tratamento de erro seguro sem usar 'any'
      const errorMessage = error instanceof Error ? error.message : "Erro inesperado";
      console.error("Erro ao processar agendamento:", errorMessage);
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

      <button 
        disabled={loading}
        type="submit"
        className="w-full bg-amber-500 text-black font-black py-4 rounded-xl uppercase hover:bg-amber-600 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/10"
      >
        {loading ? 'Preparando Pagamento...' : 'Confirmar e Pagar Agora'}
      </button>
      
      <p className="text-[10px] text-center text-zinc-500 uppercase font-bold tracking-widest">
        Pagamento 100% seguro via Stripe
      </p>
    </form>
  );
}