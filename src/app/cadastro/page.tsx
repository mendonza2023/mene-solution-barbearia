"use client"
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Cadastro() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCadastro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const senha = formData.get('senha') as string;
    const nome = formData.get('nome') as string;
    const whatsapp = formData.get('whatsapp') as string;

    // 1. Criar o usuário no Supabase Auth (Segurança de Login)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (authError) {
      alert("Erro no cadastro: " + authError.message);
    } else if (authData.user) {
      // 2. Salvar dados adicionais no banco de dados
      const { error: dbError } = await supabase
        .from('clientes')
        .insert([{ 
          id: authData.user.id, 
          nome, 
          whatsapp, 
          email,
          data_nascimento: formData.get('nascimento'),
          endereco: formData.get('endereco')
        }]);

      if (dbError) {
        alert("Erro ao salvar perfil: " + dbError.message);
      } else {
        alert("Cadastro realizado! Verifique seu e-mail ou faça login.");
        router.push('/login');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 p-10 rounded-3xl border border-zinc-800 shadow-2xl">
        <h1 className="text-3xl font-black mb-2 italic">CRIAR <span className="text-amber-500">CONTA</span></h1>
        <p className="text-zinc-500 text-sm mb-8 font-medium">Junte-se à Mene Solution</p>

        <form onSubmit={handleCadastro} className="space-y-4">
          <input name="nome" type="text" placeholder="Nome Completo" required className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:border-amber-500 outline-none" />
          <div className="grid grid-cols-2 gap-2">
            <input name="whatsapp" type="tel" placeholder="WhatsApp" required className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:border-amber-500 outline-none" />
            <input name="nascimento" type="date" required className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:border-amber-500 outline-none" />
          </div>
          <input name="endereco" type="text" placeholder="Endereço Residencial" required className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:border-amber-500 outline-none" />
          <hr className="border-zinc-800 my-4" />
          <input name="email" type="email" placeholder="Seu melhor e-mail" required className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:border-amber-500 outline-none" />
          <input name="senha" type="password" placeholder="Crie uma senha forte" required className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:border-amber-500 outline-none" />
          
          <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-4 rounded-xl mt-6 transition-all uppercase tracking-widest">
            {loading ? 'Processando...' : 'Finalizar Cadastro'}
          </button>
        </form>
      </div>
    </div>
  );
}