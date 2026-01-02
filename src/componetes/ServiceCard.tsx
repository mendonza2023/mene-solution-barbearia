"use client"

interface ServiceCardProps {
  nome: string;
  preco: number;
  descricao: string;
  videoUrl?: string; // Adicionamos o ? para indicar que é opcional
  onClick?: () => void;
}

export default function ServiceCard({ nome, preco, descricao, videoUrl, onClick }: ServiceCardProps) {
  return (
    <div className="relative group overflow-hidden bg-zinc-900 rounded-3xl border border-zinc-800 hover:border-amber-500/50 transition-all h-48 flex items-center">
      
      {/* Vídeo de Fundo em Loop */}
      {videoUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          {/* Overlay gradiente para garantir leitura do texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        </div>
      )}

      {/* Conteúdo do Card */}
      <div className="relative z-10 p-8 flex justify-between items-center w-full">
        <div className="max-w-[60%]">
          <h3 className="text-xl font-black uppercase italic text-white group-hover:text-amber-500 transition-colors">
            {nome}
          </h3>
          <p className="text-zinc-400 text-xs font-medium mt-1 line-clamp-2">
            {descricao}
          </p>
          <p className="text-amber-500 font-black mt-2 text-lg">
            R$ {preco.toFixed(2)}
          </p>
        </div>

        <button
          onClick={onClick}
          className="bg-white text-black px-6 py-2 rounded-full font-black uppercase text-[10px] hover:bg-amber-500 hover:scale-105 transition-all shadow-xl"
        >
          Selecionar
        </button>
      </div>
    </div>
  );
}