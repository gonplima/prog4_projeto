import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Combustivel() {
  const [total, setTotal] = useState(null);
  const [erro, setErro] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRemoveForm, setShowRemoveForm] = useState(false);
  const [quantidade, setQuantidade] = useState("");

  function carregar() {
    fetch("http://localhost:3000/combustivel/total")
      .then((r) => r.json())
      .then((data) => setTotal(data.quantidade))
      .catch(() => setErro("Erro ao carregar combustível total."));
  }

  useEffect(() => {
    carregar();
  }, []);

  async function enviarQuantidade(valor) {
    if (!valor || isNaN(valor)) return;

    await fetch("http://localhost:3000/combustivel/total", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade: Number(valor) }),
    });

    setQuantidade("");
    setShowAddForm(false);
    setShowRemoveForm(false);
    carregar();
  }

  function cancelarFormularios() {
    setShowAddForm(false);
    setShowRemoveForm(false);
    setQuantidade("");
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
              Total disponível: <span className="font-bold">{total}</span> litros
            </div>
          )}

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setShowRemoveForm(false);
                setQuantidade("");
              }}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Adicionar Combustível
            </button>
            <button
              onClick={() => {
                setShowRemoveForm(!showRemoveForm);
                setShowAddForm(false);
                setQuantidade("");
              }}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Remover Combustível
            </button>
          </div>

          {/* Formulário Adição */}
          {showAddForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                enviarQuantidade(quantidade);
              }}
              className="flex flex-col sm:flex-row gap-3 items-start"
            >
              <input
                type="number"
                placeholder="Quantidade a adicionar"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="border rounded p-2 flex-1"
                required
                min={1}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded px-4 py-2"
                >
                  Confirmar Adição
                </button>
                <button
                  type="button"
                  onClick={cancelarFormularios}
                  className="bg-gray-400 text-white rounded px-4 py-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Formulário Remoção */}
          {showRemoveForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                enviarQuantidade(-Number(quantidade));
              }}
              className="flex flex-col sm:flex-row gap-3 items-start"
            >
              <input
                type="number"
                placeholder="Quantidade a remover"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="border rounded p-2 flex-1"
                required
                min={1}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded px-4 py-2"
                >
                  Confirmar Remoção
                </button>
                <button
                  type="button"
                  onClick={cancelarFormularios}
                  className="bg-gray-400 text-white rounded px-4 py-2"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
