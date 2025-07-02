import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Aeronaves() {
  const [aeronaves, setAeronaves] = useState([]);
  const [form, setForm] = useState({ nome: "", combustivel_disponivel: "" });
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState(null);

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
    try {
      const resp = await fetch("http://localhost:3000/aeronaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (resp.ok) {
        setMsg("Aeronave cadastrada!");
        setForm({ nome: "", combustivel_disponivel: "" });
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

  async function handleAddCombustivel(id) {
    const qtd = prompt("Quantidade de combustível a adicionar na aeronave:");
    if (!qtd || isNaN(qtd)) return;
    // Atualiza a aeronave
    const aero = aeronaves.find((a) => a.id === id);
    const novo = Number(aero.combustivel_disponivel) + Number(qtd);
    await fetch(`http://localhost:3000/aeronaves/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...aero, combustivel_disponivel: novo }),
    });
    // Remove do total do aeroporto (combustivel)
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
        <h1 className="text-2xl font-bold mb-6 border-b pb-3">Aeronaves</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-3 max-w-xl mb-6">
          <label>Nome</label>
          <input name="nome" value={form.nome} onChange={handleChange} className="border rounded p-2" required />
          <label>Combustível Disponível</label>
          <input name="combustivel_disponivel" value={form.combustivel_disponivel} onChange={handleChange} className="border rounded p-2" required />
          <button className="bg-blue-600 text-white rounded p-2 mt-2">Cadastrar Aeronave</button>
          {msg && <p className={msg.includes("erro") ? "text-red-500" : "text-green-600"}>{msg}</p>}
        </form>
        <div className="space-y-4">
          {erro && <p className="text-red-500">{erro}</p>}
          {aeronaves.length === 0 && !erro && <p>Nenhuma aeronave cadastrada.</p>}
          {aeronaves.map((a) => (
            <div key={a.id} className="bg-white rounded-lg shadow px-6 py-4 border flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <b>{a.nome}</b> | Combustível: {a.combustivel_disponivel}
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button onClick={() => handleDelete(a.id)} className="px-3 py-1 bg-red-500 text-white rounded">Remover</button>
                <button onClick={() => handleAddCombustivel(a.id)} className="px-3 py-1 bg-green-600 text-white rounded">Adicionar Combustível</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}