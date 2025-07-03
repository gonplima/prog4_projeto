import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Funcionarios() {
  const [funcs, setFuncs] = useState([]);
  const [form, setForm] = useState({ nome: "", cpf: "", email: "", funcao: "", senha: "" });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState(null);

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
        carregar();
      } else {
        setMsg("Erro ao salvar funcionário.");
      }
    } catch {
      setMsg("Erro ao salvar funcionário.");
    }
  }

  function handleEdit(f) {
    setForm({ nome: f.nome, cpf: f.cpf, email: f.email, funcao: f.funcao, senha: f.senha });
    setEditId(f.id);
  }

  async function handleDelete(id) {
    if (!window.confirm("Remover este funcionário?")) return;
    await fetch(`http://localhost:3000/funcionarios/${id}`, { method: "DELETE" });
    carregar();
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-6 border-b pb-3">Funcionários</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 flex flex-col gap-3 max-w-xl mb-6">
          <label>Nome</label>
          <input name="nome" value={form.nome} onChange={handleChange} className="border rounded p-2" required />
          <label>CPF</label>
          <input name="cpf" value={form.cpf} onChange={handleChange} className="border rounded p-2" required />
          <label>E-mail</label>
          <input name="email" value={form.email} onChange={handleChange} className="border rounded p-2" required />
          <label>Função</label>
          <input name="funcao" value={form.funcao} onChange={handleChange} className="border rounded p-2" required />
          <label>Senha</label>
          <input name="senha" type="password" value={form.senha} onChange={handleChange} className="border rounded p-2" required />
          <button className="bg-blue-600 text-white rounded p-2 mt-2">{editId ? "Salvar Alterações" : "Cadastrar Funcionário"}</button>
          {msg && <p className={msg.includes("erro") ? "text-red-500" : "text-green-600"}>{msg}</p>}
        </form>
        <div className="space-y-4">
          {erro && <p className="text-red-500">{erro}</p>}
          {funcs.length === 0 && !erro && <p>Nenhum funcionário cadastrado.</p>}
          {funcs.map((f) => (
            <div key={f.id} className="bg-white rounded-lg shadow px-6 py-4 border flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <strong>Nome:</strong> {f.nome} | <strong>Função:</strong> {f.funcao} | <strong>E-mail:</strong> {f.email}
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button onClick={() => handleEdit(f)} className="px-3 py-1 bg-yellow-400 rounded">Editar</button>
                <button onClick={() => handleDelete(f.id)} className="px-3 py-1 bg-red-500 text-white rounded">Remover</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
