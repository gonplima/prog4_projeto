import { useEffect, useState } from "react";
import SidebarFuncionario from "../components/SidebarFuncionario";

export default function Passageiros() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
  const funcId = usuario?.id;

  const [voos, setVoos] = useState([]);
  const [passageiros, setPassageiros] = useState([]);
  const [erro, setErro] = useState(null);

  const [form, setForm] = useState({ nome: "", cpf: "", email: "", voo_id: "" });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  function carregar() {
    fetch("http://localhost:3000/voos")
      .then((r) => r.json())
      .then(setVoos)
      .catch(() => setErro("Erro ao carregar voos"));
    fetch("http://localhost:3000/passageiros")
      .then((r) => r.json())
      .then(setPassageiros)
      .catch(() => setErro("Erro ao carregar passageiros"));
  }

  useEffect(() => {
    carregar();
  }, []);

  function handleFormChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!form.nome || !form.cpf || !form.email || !form.voo_id) {
      setMsg("Preencha todos os campos.");
      return;
    }
    try {
      let resp;
      if (editId) {
        resp = await fetch(`http://localhost:3000/passageiros/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, funcionario_id: funcId }),
        });
      } else {
        resp = await fetch("http://localhost:3000/passageiros", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, funcionario_id: funcId }),
        });
      }
      if (resp.ok) {
        setMsg(editId ? "Passageiro atualizado!" : "Passageiro adicionado!");
        setForm({ nome: "", cpf: "", email: "", voo_id: "" });
        setEditId(null);
        setShowForm(false);
        carregar();
      } else {
        setMsg("Erro ao salvar passageiro.");
      }
    } catch {
      setMsg("Erro ao salvar passageiro.");
    }
  }

  function handleEdit(p) {
    setForm({
      nome: p.nome,
      cpf: p.cpf,
      email: p.email,
      voo_id: p.voo_id,
    });
    setEditId(p.id);
    setShowForm(true);
    setMsg("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Remover passageiro?")) return;
    await fetch(`http://localhost:3000/passageiros/${id}`, { method: "DELETE" });
    carregar();
  }

  function getVooInfo(id) {
    const v = voos.find((x) => String(x.id) === String(id));
    if (!v) return "Voo não encontrado";
    return `${v.origem} → ${v.destino}`;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarFuncionario />
      <main className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 border-b pb-3">Passageiros</h1>

        {/* Botão para mostrar o formulário */}
        {!showForm && (
          <div className="mb-6">
            <button
              onClick={() => {
                setShowForm(true);
                setForm({ nome: "", cpf: "", email: "", voo_id: "" });
                setEditId(null);
                setMsg("");
              }}
              className="bg-green-600 text-white rounded px-6 py-2 font-semibold hover:bg-green-700 transition"
            >
              + Adicionar Passageiro
            </button>
          </div>
        )}

        {/* Formulário centralizado e responsivo */}
        {showForm && (
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-lg shadow p-6 flex flex-col gap-3 max-w-xl mx-auto mb-6"
          >
            <label>Nome</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleFormChange}
              className="border rounded p-2"
              required
            />
            <label>CPF</label>
            <input
              name="cpf"
              value={form.cpf}
              onChange={handleFormChange}
              className="border rounded p-2"
              required
            />
            <label>E-mail</label>
            <input
              name="email"
              value={form.email}
              onChange={handleFormChange}
              className="border rounded p-2"
              required
            />
            <label>Voo</label>
            <select
              name="voo_id"
              value={form.voo_id}
              onChange={handleFormChange}
              className="border rounded p-2"
              required
            >
              <option value="">Selecione o voo</option>
              {voos.map((v) => (
                <option key={v.id} value={v.id}>
                  {getVooInfo(v.id)}
                </option>
              ))}
            </select>

            <div className="flex gap-3 mt-2">
              <button className="bg-blue-600 text-white rounded p-2 flex-1" type="submit">
                {editId ? "Salvar Alterações" : "Adicionar Passageiro"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ nome: "", cpf: "", email: "", voo_id: "" });
                  setEditId(null);
                  setMsg("");
                }}
                className="bg-gray-400 text-white rounded p-2 flex-1"
              >
                Cancelar
              </button>
            </div>

            {msg && (
              <p className={msg.toLowerCase().includes("erro") ? "text-red-500" : "text-green-600"}>
                {msg}
              </p>
            )}
          </form>
        )}

        {/* Lista de passageiros */}
        <div className="space-y-4 max-w-xl">
          {erro && <p className="text-red-500">{erro}</p>}
          {passageiros.length === 0 && !erro && <p>Nenhum passageiro cadastrado.</p>}
          {passageiros
            .filter((p) => voos.some((v) => String(v.id) === String(p.voo_id)))
            .map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-lg shadow px-6 py-4 border flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <b>{p.nome}</b> | {p.email} | Voo: {getVooInfo(p.voo_id)}
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-yellow-400 rounded">
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
