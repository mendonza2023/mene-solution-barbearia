// 1. Usando caminhos relativos (../) para evitar erro de configuração do @
import ServiceCard from "@/componetes/ServiceCard";
import BookingForm from "@/componetes/BookingForm";

export default function Home() {
  // Essas fotos devem estar dentro da pasta "public" do seu projeto
  const fotos = ["/corte1.jpg", "/corte2.jpg", "/corte3.jpg"]; 

  return (
    <div className="space-y-20 pb-20 bg-black text-white">
      
      {/* Seção Hero com Frase Motivacional */}
      <section className="h-[70vh] flex flex-col justify-center items-center text-center px-4 bg-zinc-950 border-b border-zinc-900">
        <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase italic">
          &quot;O seu estilo é a sua marca.&quot;
        </h2>
        <p className="text-amber-500 font-bold tracking-[0.3em] text-sm md:text-base">
          TRANSFORME SUA AUTOESTIMA NA MENE BARBEARIA
        </p>
      </section>

      {/* Seção Principal: Serviços + Formulário */}
      <section id="servicos" className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold border-l-4 border-amber-500 pl-4 uppercase tracking-tighter">
            Nossos Serviços
          </h3>
          {/* Adicionando os cards de serviço que você já tem */}
          <ServiceCard nome="Corte Masculino" preco={50} descricao="Corte moderno com acabamento premium." />
          <ServiceCard nome="Barba & Toalha Quente" preco={40} descricao="Tratamento completo para sua barba." />
          <ServiceCard nome="Combo Mene" preco={80} descricao="Corte + Barba + Hidratação." />
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-6 uppercase tracking-tighter">Agendamento Rápido</h3>
          {/* O formulário que criamos para o Supabase */}
          <BookingForm />
        </div>
      </section>

      {/* Galeria de Procedimentos */}
      <section className="max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-bold mb-8 border-l-4 border-amber-500 pl-4 uppercase tracking-tighter">
          PROCEDIMENTOS REALIZADOS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fotos.map((foto, i) => (
            <div key={i} className="group relative h-80 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 transition duration-500 hover:border-amber-500">
               {/* Quando você tiver as fotos, troque a div abaixo por: 
                   <img src={foto} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" /> 
               */}
               <div className="w-full h-full flex items-center justify-center text-zinc-700 italic group-hover:text-amber-500 transition duration-500">
                 Portfólio Mene {i + 1}
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-6">
                 <span className="text-sm font-bold uppercase tracking-widest text-amber-500">Trabalho Realizado</span>
               </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}