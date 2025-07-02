import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Combustivel() {
  const [total, setTotal] = useState(null);
  const [erro, setErro] = useState(null);

  function carregar() {
    fetch("http://localhost:3000/combustivel/total")
      .then((r) => r.json())
      .then((data) => setTotal(data.quantidade))
      .catch(() => setErro("Erro ao carregar combustível total."));
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleAdd() {
    const qtd = prompt("Quantidade de combustível a adicionar ao aeroporto:");
    if (!qtd || isNaN(qtd)) return;
    await fetch("http://localhost:3000/combustivel/total", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade: Number(qtd) }),
    });
    carregar();
  }

  async function handleRemove() {
    const qtd = prompt("Quantidade de combustível a remover do aeroporto:");
    if (!qtd || isNaN(qtd)) return;
    await fetch("http://localhost:3000/combustivel/total", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade: -Number(qtd) }),
    });
    carregar();
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-6 border-b pb-3">
          Combustível Total do Aeroporto
        </h1>
        <div className="space-y-4">
          {erro && <p className="text-red-500">{erro}</p>}
          {total === null && !erro && <p>Carregando...</p>}
          {total !== null && (
            <div className="bg-blue-50 rounded-lg px-6 py-4 border border-blue-200 font-semibold text-blue-800">
              Total disponível:{" "}
              <span className="font-bold">{total}</span> litros
            </div>
          )}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Adicionar Combustível
            </button>
            <button
              onClick={handleRemove}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Remover Combustível
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
