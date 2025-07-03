import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Funcionarios() {
  const [funcs, setFuncs] = useState([]);
  const [form, setForm] = useState({ nome: "", cpf: "", email: "", funcao: "", senha: "" });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function carregar() {
    fetch("http://localhost:3000/funcionarios")
      .then((r) => r.json())
      .then(setFuncs)
      .catch(() => setErro("Erro ao carregar funcionários."));
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
      ? `http://localhost:3000/funcionarios/${editId}`
      : "http://localhost:3000/funcionarios";

    try {
      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (resp.ok) {
        setMsg(editId ? "Funcionário atualizado!" : "Funcionário cadastrado!");
        setForm({ nome: "", cpf: "", email: "", funcao: "", senha: "" });
        setEditId(null);
        setShowForm(false);
        carregar();
      } else {
        setMsg("Erro ao salvar funcionário.");
      }
    } catch {
      setMsg("Erro ao salvar funcionário.");
    }
  }

  function handleEdit(f) {
    setForm({ nome: f.nome, cpf: f.cpf, email: f.email, funcao: f.funcao, senha: "" });
    setEditId(f.id);
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!window.confirm("Remover este funcionário?")) return;
    await fetch(`http://localhost:3000/funcionarios/${id}`, { method: "DELETE" });
    carregar();
  }

  function handleNew() {
    setForm({ nome: "", cpf: "", email: "", funcao: "", senha: "" });
    setEditId(null);
    setShowForm(true);
    setMsg("");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-6 border-b pb-3">Funcionários</h1>

        {/* Botão Novo Funcionário */}
        <div className="mb-6">
          <button
            onClick={handleNew}
            className="bg-green-600 text-white font-semibold rounded px-4 py-2"
          >
            + Novo Funcionário
          </button>
        </div>

        {/* Formulário centralizado e responsivo */}
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

            <label className="font-semibold">CPF</label>
            <input
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              className="border rounded p-2"
              required
            />

            <label className="font-semibold">E-mail</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border rounded p-2"
              required
            />

            <label className="font-semibold">Função</label>
            <input
              name="funcao"
              value={form.funcao}
              onChange={handleChange}
              className="border rounded p-2"
              required
            />

            <label className="font-semibold">Senha</label>
            <input
              name="senha"
              type="password"
              value={form.senha}
              onChange={handleChange}
              className="border rounded p-2"
              required={!editId}
              placeholder={editId ? "Deixe em branco para manter a senha atual" : ""}
            />

            <div className="flex flex-col sm:flex-row items-center justify-start gap-3 mt-2">
              <button className="bg-blue-600 text-white rounded px-4 py-2">
                {editId ? "Salvar Alterações" : "Cadastrar Funcionário"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm({ nome: "", cpf: "", email: "", funcao: "", senha: "" });
                  setEditId(null);
                }}
                className="bg-gray-400 text-white rounded px-4 py-2"
              >
                Cancelar
              </button>
            </div>

            {msg && (
              <p className={msg.includes("erro") ? "text-red-500" : "text-green-600"}>
                {msg}
              </p>
            )}
          </form>
        )}

        {/* Lista de Funcionários */}
        <div className="space-y-4">
          {erro && <p className="text-red-500">{erro}</p>}
          {funcs.length === 0 && !erro && <p>Nenhum funcionário cadastrado.</p>}
          {funcs.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-lg shadow px-6 py-4 border flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <div>
                <strong>Nome:</strong> {f.nome} | <strong>Função:</strong> {f.funcao} | <strong>E-mail:</strong> {f.email}
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  onClick={() => handleEdit(f)}
                  className="px-3 py-1 bg-yellow-400 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
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
