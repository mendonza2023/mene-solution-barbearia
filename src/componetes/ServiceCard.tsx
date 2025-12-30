interface ServiceProps {
  nome: string;
  preco: number;
  descricao: string;
  isLogged: boolean;
}

export default function ServiceCard({ nome, preco, descricao, isLogged }: ServiceProps) {
  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex justify-between items-center group hover:border-amber-500/50 transition-all">
      <div>
        <h4 className="font-bold text-lg">{nome}</h4>
        <p className="text-zinc-500 text-sm">{descricao}</p>
        <p className="text-amber-500 font-bold mt-2">R$ {preco.toFixed(2)}</p>
      </div>
      
      {isLogged && (
        <button className="bg-white text-black px-4 py-2 rounded-lg text-xs font-black uppercase hover:bg-amber-500 transition-colors">
          Selecionar
        </button>
      )}
    </div>
  );
}