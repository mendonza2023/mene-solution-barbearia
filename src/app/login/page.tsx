"use client"
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      alert("Erro ao entrar: " + error.message);
    } else {
      // Direciona para o perfil do cliente
      router.push('/perfil');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-zinc-900 p-10 rounded-3xl border border-zinc-800 shadow-2xl">
        <h1 className="text-3xl font-black mb-2 italic text-center">LOGIN <span className="text-amber-500">CLIENTE</span></h1>
        <p className="text-zinc-500 text-sm mb-8 text-center font-medium">Acesse sua área exclusiva Mene Solution</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:border-amber-500 outline-none transition-all" 
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase">Senha</label>
            <input 
              type="password" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required 
              className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:border-amber-500 outline-none transition-all" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-4 rounded-xl mt-6 transition-all uppercase tracking-widest active:scale-95"
          >
            {loading ? 'AUTENTICANDO...' : 'ENTRAR NO SISTEMA'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">Ainda não tem conta?</p>
          <a href="/cadastro" className="text-amber-500 font-bold hover:underline">Cadastre-se aqui</a>
        </div>
      </div>
    </div>
  );
}