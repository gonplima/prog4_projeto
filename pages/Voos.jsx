import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Voos() {
  const [voos, setVoos] = useState([]);
  const [aeronaves, setAeronaves] = useState([]);
  const [form, setForm] = useState({ origem: "", destino: "", piloto: "", plataforma: "", aeronave_id: "" });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState(null);

  function carregar() {
    fetch("http://localhost:3000/voos")
      .then((r) => r.json())
      .then(setVoos)
      .catch(() => setErro("Erro ao carregar voos."));
    fetch("http://localhost:3000/aeronaves")
      .then((r) => r.json())
      .then(setAeronaves)
      .catch(() => {});
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
      ? `http://localhost:3000/voos/${editId}`
      : "http://localhost:3000/voos";
    try {
      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (resp.ok) {
        setMsg(editId ? "Voo atualizado!" : "Voo cadastrado!");
        setForm({ origem: "", destino: "", piloto: "", plataforma: "", aeronave_id: "" });
        setEditId(null);
        carregar();
      } else {
        setMsg("Erro ao salvar voo.");
      }
    } catch {
      setMsg("Erro ao salvar voo.");
    }
  }

  function handleEdit(v) {
    setForm({
      origem: v.origem,
      destino: v.destino,
      piloto: v.piloto,
      plataforma: v.plataforma,
      aeronave_id: v.aeronave_id,
    });
    setEditId(v.id);
  }

  async function handleDelete(id) {
    if (!window.confirm("Remover/concluir este voo?")) return;
    await fetch(`http://localhost:3000/voos/${id}`, { method: "DELETE" });
    carregar();
  }

  function getAeronaveNome(id) {
    const aero = aeronaves.find((a) => String(a.id) === String(id));
    return aero ? aero.nome : "N/A";
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 border-b pb-3">Voos Programados</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-3 max-w-xl mb-6">
          <label>Origem</label>
          <input name="origem" value={form.origem} onChange={handleChange} className="border rounded p-2" required />
          <label>Destino</label>
          <input name="destino" value={form.destino} onChange={handleChange} className="border rounded p-2" required />
          <label>Piloto</label>
          <input name="piloto" value={form.piloto} onChange={handleChange} className="border rounded p-2" required />
          <label>Plataforma</label>
          <input name="plataforma" value={form.plataforma} onChange={handleChange} className="border rounded p-2" required />
          <label>Aeronave (ID)</label>
          <input name="aeronave_id" value={form.aeronave_id} onChange={handleChange} className="border rounded p-2" required />
          <button className="bg-blue-600 text-white rounded p-2 mt-2">{editId ? "Salvar Alterações" : "Cadastrar Voo"}</button>
          {msg && <p className={msg.includes("erro") ? "text-red-500" : "text-green-600"}>{msg}</p>}
        </form>
        <div className="space-y-4">
          {erro && <p className="text-red-500">{erro}</p>}
          {voos.length === 0 && !erro && <p>Nenhum voo programado.</p>}
          {voos.map((v) => (
            <div key={v.id} className="bg-white rounded-lg shadow px-6 py-4 border flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <span className="mr-2">✈️</span>
                {v.origem} → {v.destino} | Piloto: {v.piloto} | Plataforma: {v.plataforma} | Aeronave: {getAeronaveNome(v.aeronave_id)}
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button onClick={() => handleEdit(v)} className="px-3 py-1 bg-yellow-400 rounded">Editar</button>
                <button onClick={() => handleDelete(v.id)} className="px-3 py-1 bg-red-500 text-white rounded">Remover/Concluir</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
