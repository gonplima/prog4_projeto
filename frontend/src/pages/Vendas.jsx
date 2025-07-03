import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Vendas() {
  const [vendas, setVendas] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/vendas")
      .then((r) => r.json())
      .then(setVendas)
      .catch(() => setErro("Erro ao carregar vendas."));
  }, []);

  const hoje = new Date().toISOString().slice(0, 10);
  let totalQtd = 0,
    totalFat = 0;
  if (vendas) {
    vendas.forEach((v) => {
      if (v.data_vendas && v.data_vendas.slice(0, 10) === hoje) {
        totalQtd += Number(v.quantidade);
        totalFat += Number(v.valor_total);
      }
    });
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-6 border-b pb-3">Gerenciamento de Vendas</h1>
        <div className="space-y-4">
          {erro && <p className="text-red-500">{erro}</p>}
          {!vendas && !erro && <p>Carregando...</p>}
          <div className="bg-white rounded-lg shadow px-6 py-4 border font-semibold">
            Total de passagens vendidas hoje: <span className="text-blue-700">{totalQtd}</span>
          </div>
          <div className="bg-white rounded-lg shadow px-6 py-4 border font-semibold">
            Faturamento do dia:{" "}
            <span className="text-blue-700">
              {totalFat.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
