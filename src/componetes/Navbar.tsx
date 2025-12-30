"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Não mostrar o menu na Home (opcional, se você quiser um visual mais limpo lá)
  // if (pathname === '/') return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo que também leva para a Home */}
        <Link href="/" className="text-xl font-black italic tracking-tighter hover:text-amber-500 transition-colors">
          MENE <span className="text-amber-500">SOLUTION</span>
        </Link>

        <div className="flex items-center gap-6">
          {/* O Botão Home que você pediu */}
          <Link 
            href="/" 
            className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            Início
          </Link>

          <Link 
            href="/perfil" 
            className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            Minha Área
          </Link>

          {/* Botão de destaque para Agendar */}
          <Link href="/#servicos" className="...">Agendar Agora</Link>
        </div>
      </div>
    </nav>
  );
}