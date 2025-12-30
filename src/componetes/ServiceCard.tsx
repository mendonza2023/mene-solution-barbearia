// src/components/ServiceCard.tsx
interface ServiceProps {
  nome: string;
  preco: number;
  descricao: string;
}

export default function ServiceCard({ nome, preco, descricao }: ServiceProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-amber-500 transition-all group">
      <h3 className="text-xl font-bold text-white group-hover:text-amber-500">{nome}</h3>
      <p className="text-zinc-500 text-sm mt-2">{descricao}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-amber-500 font-mono text-lg">R$ {preco.toFixed(2)}</span>
        <button className="bg-white text-black text-xs font-bold py-2 px-4 rounded-lg uppercase tracking-wider hover:bg-amber-500 transition-colors">
          Selecionar
        </button>
      </div>
    </div>
  );
}