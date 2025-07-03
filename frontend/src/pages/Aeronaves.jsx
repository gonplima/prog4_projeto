import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Aeronaves() {
  const [aeronaves, setAeronaves] = useState([]);
  const [form, setForm] = useState({ nome: "", combustivel_disponivel: "" });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [combustivelId, setCombustivelId] = useState(null);
  const [qtdCombustivel, setQtdCombustivel] = useState("");

  function carregar() {
    fetch("http://localhost:3000/aeronaves")
      .then((r) => r.json())
      .then(setAeronaves)
      .catch(() => setErro("Erro ao carregar aeronaves."));
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:3000/aeronaves/${editId}`
      : "http://localhost:3000/aeronaves";

    try {
      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (resp.ok) {
        setMsg(editId ? "Aeronave atualizada!" : "Aeronave cadastrada!");
        setForm({ nome: "", combustivel_disponivel: "" });
        setEditId(null);
        setShowForm(false);
        carregar();
      } else {
        setMsg("Erro ao salvar aeronave.");
      }
    } catch {
      setMsg("Erro ao salvar aeronave.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Remover esta aeronave?")) return;
    await fetch(`http://localhost:3000/aeronaves/${id}`, { method: "DELETE" });
    carregar();
  }

  function handleEdit(a) {
    setForm({
      nome: a.nome,
      combustivel_disponivel: a.combustivel_disponivel,
    });
    setEditId(a.id);
    setShowForm(true);
    setMsg("");
  }

  function handleNew() {
    setForm({ nome: "", combustivel_disponivel: "" });
    setEditId(null);
    setShowForm(true);
    setMsg("");
  }

  async function handleCombustivelSubmit(e, aeronave) {
    e.preventDefault();
    if (!qtdCombustivel || isNaN(qtdCombustivel)) return;

    const novaQtd = Number(aeronave.combustivel_disponivel) + Number(qtdCombustivel);

    await fetch(`http://localhost:3000/aeronaves/${aeronave.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...aeronave, combustivel_disponivel: novaQtd }),
    });

    await fetch("http://localhost:3000/combustivel/total", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade: -Number(qtdCombustivel) }),
    });

    setCombustivelId(null);
    setQtdCombustivel("");
    carregar();
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-6 border-b pb-3">Aeronaves</h1>

        {/* Botão Nova Aeronave */}
        <div className="mb-6">
          <button
            onClick={handleNew}
            className="bg-green-600 text-white font-semibold rounded px-4 py-2"
          >
            + Nova Aeronave
          </button>
        </div>

        {/* Formulário centralizado */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow flex flex-col gap-4 mb-6"
          >
            <label className="font-semibold">Nome</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              className="border rounded p-2"
              required
            />

            <label className="font-semibold">Combustível Disponível</label>
            <input
              name="combustivel_disponivel"
              value={form.combustivel_disponivel}
              onChange={handleChange}
              className="border rounded p-2"
              required
            />

            <div className="flex gap-3 mt-2">
              <button className="bg-blue-600 text-white rounded px-4 py-2">
                {editId ? "Salvar Alterações" : "Cadastrar Aeronave"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ nome: "", combustivel_disponivel: "" });
                  setEditId(null);
                }}
                className="bg-gray-400 text-white rounded px-4 py-2"
              >
                Cancelar
              </button>
            </div>

            {msg && (
              <p className={msg.includes("Erro") ? "text-red-500" : "text-green-600"}>
                {msg}
              </p>
            )}
          </form>
        )}

        {/* Lista de Aeronaves */}
        <div className="space-y-4">
          {erro && <p className="text-red-500">{erro}</p>}
          {aeronaves.length === 0 && !erro && <p>Nenhuma aeronave cadastrada.</p>}
          {aeronaves.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-lg shadow px-6 py-4 border flex flex-col gap-3"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <strong>{a.nome}</strong> <span className="text-sm text-gray-500">#ID: {a.id}</span> | Combustível: {a.combustivel_disponivel}
                </div>

                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    onClick={() => handleEdit(a)}
                    className="px-3 py-1 bg-yellow-400 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Remover
                  </button>
                  <button
                    onClick={() => setCombustivelId(combustivelId === a.id ? null : a.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    {combustivelId === a.id ? "Cancelar" : "Adicionar Combustível"}
                  </button>
                </div>
              </div>

              {/* Formulário de adicionar combustível */}
              {combustivelId === a.id && (
                <form
                  onSubmit={(e) => handleCombustivelSubmit(e, a)}
                  className="flex flex-col sm:flex-row gap-3 mt-3"
                >
                  <input
                    type="number"
                    placeholder="Quantidade a adicionar"
                    value={qtdCombustivel}
                    onChange={(e) => setQtdCombustivel(e.target.value)}
                    className="border rounded p-2 flex-1"
                    required
                    min={1}
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white rounded px-4 py-2"
                  >
                    Confirmar Abastecimento
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
