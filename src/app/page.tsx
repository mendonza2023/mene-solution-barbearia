"use client"
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { loadStripe } from '@stripe/stripe-js';

export default function BookingForm() {
  const [servico, setServico] = useState('Corte + Barba - R$ 80,00');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [metodo, setMetodo] = useState('stripe'); // stripe ou local
  const [loading, setLoading] = useState(false);

  const handleAgendamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const preco = servico.includes('80') ? 80 : servico.includes('50') ? 50 : 40;

    const dadosAgendamento = {
      servico,
      data_hora: `${data} ${hora}`,
      cliente_nome: nome,
      whatsapp: whatsapp,
      data_nascimento: nascimento,
      metodo_pagamento: metodo,
      pago: false
    };

    if (metodo === 'local') {
      // SALVAR DIRETO NO SUPABASE (PAGAMENTO NO LOCAL)
      const { error } = await supabase.from('agendamentos').insert([dadosAgendamento]);
      
      if (error) {
        alert("Erro ao salvar no banco. Verifique as colunas no Supabase.");
        console.error(error);
      } else {
        alert("Agendado com sucesso! Pagamento será feito na barbearia.");
        window.location.href = "/perfil";
      }
    } else {
      // ENVIAR PARA O STRIPE
      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...dadosAgendamento, preco }),
        });

        const session = await response.json();
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        await stripe?.redirectToCheckout({ sessionId: session.id });
      } catch (err) {
        alert("Erro ao gerar link de pagamento.");
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleAgendamento} className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 space-y-4">
      <h4 className="text-amber-500 font-black italic uppercase text-center mb-6">Agende seu Estilo</h4>
      
      <input type="text" placeholder="Seu Nome Completo" required className="w-full bg-black border border-zinc-800 p-3 rounded-xl outline-none focus:border-amber-500" onChange={(e) => setNome(e.target.value)} />
      
      <input type="tel" placeholder="WhatsApp (ex: 11958663599)" required className="w-full bg-black border border-zinc-800 p-3 rounded-xl outline-none focus:border-amber-500" onChange={(e) => setWhatsapp(e.target.value)} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Nascimento</label>
          <input type="date" required className="w-full bg-black border border-zinc-800 p-3 rounded-xl outline-none" onChange={(e) => setNascimento(e.target.value)} />
        </div>
        <div>
          <label className="text-[10px] text-zinc-500 uppercase font-bold ml-2">Data do Corte</label>
          <input type="date" required className="w-full bg-black border border-zinc-800 p-3 rounded-xl outline-none" onChange={(e) => setData(e.target.value)} />
        </div>
      </div>

      <input type="time" required className="w-full bg-black border border-zinc-800 p-3 rounded-xl outline-none" onChange={(e) => setHora(e.target.value)} />

      <select className="w-full bg-black border border-zinc-800 p-3 rounded-xl outline-none" onChange={(e) => setServico(e.target.value)}>
        <option>Corte + Barba - R$ 80,00</option>
        <option>Corte Masculino - R$ 50,00</option>
        <option>Barba & Toalha Quente - R$ 40,00</option>
      </select>

      <div className="flex gap-2 p-1 bg-black rounded-xl border border-zinc-800">
        <button type="button" onClick={() => setMetodo('stripe')} className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition ${metodo === 'stripe' ? 'bg-amber-500 text-black' : 'text-zinc-500'}`}>Pagar Agora</button>
        <button type="button" onClick={() => setMetodo('local')} className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition ${metodo === 'local' ? 'bg-amber-500 text-black' : 'text-zinc-500'}`}>Pagar no Local</button>
      </div>

      <button disabled={loading} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black uppercase py-4 rounded-xl transition-all duration-300">
        {loading ? 'Processando...' : 'Confirmar Agendamento'}
      </button>
    </form>
  );
}