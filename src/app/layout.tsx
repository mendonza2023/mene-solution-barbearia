import './globals.css';
import Navbar from '@/componetes/Navbar';
import WhatsappBtn from '@/componetes/WhatsappBtn';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" className="scroll-smooth">
      <body className="bg-black text-white min-h-screen flex flex-col antialiased">
        
        {/* Componente de Menu que você criou na pasta componetes */}
        <Navbar /> 

        {/* Conteúdo das páginas com espaço para o menu não cobrir o topo */}
        <main className="flex-grow pt-20">
          {children}
        </main>

        {/* Botão flutuante do WhatsApp */}
        <WhatsappBtn />

        {/* Seu Rodapé Personalizado */}
        <footer className="border-t border-zinc-900 p-10 bg-zinc-950 text-center text-sm text-zinc-500">
          <p className="uppercase tracking-widest font-bold mb-2 text-zinc-400">Mene Barbearia</p>
          <p>Rua da Barbearia, 123 - Seu Bairro, Sua Cidade</p>
          <p className="mt-2 font-bold text-amber-500 underline cursor-pointer hover:text-amber-400">
            @instadabarbearia
          </p>
          <p className="mt-6 opacity-30 italic text-[10px] tracking-tighter">
            TECNOLOGIA POR MENE SOLUTION
          </p>
        </footer>

      </body>
    </html>
  );
}