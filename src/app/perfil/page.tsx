"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Perfil() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const carregarDados = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

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

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-black uppercase italic mb-8 border-b border-zinc-800 pb-4">
          Meus <span className="text-amber-500">Agendamentos</span>
        </h1>

        {loading ? (
          <p className="animate-pulse">Carregando seus horários...</p>
        ) : (
          <div className="space-y-4">
            {agendamentos.length === 0 && <p>Você ainda não tem agendamentos.</p>}
            
            {agendamentos.map((item) => (
              <div key={item.id} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex justify-between items-center">
                <div>
                  <p className="font-bold uppercase text-amber-500">{item.servico}</p>
                  <p className="text-sm text-zinc-400">
                    {new Date(item.data_hora).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${item.pago ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {item.pago ? 'Confirmado' : 'Aguardando Pagamento'}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button 
          onClick={() => router.push('/')}
          className="mt-8 text-zinc-500 hover:text-white text-sm uppercase font-bold transition-colors"
        >
          ← Voltar para o Início
        </button>
      </div>
    </div>
  );
}