import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";

export default function Adm() {
  const [showConfig, setShowConfig] = useState(false);
  const [form, setForm] = useState({ nome: "", cpf: "", email: "", senha: "" });
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState(null);

  // Pega dados do admin logado
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
  const adminId = usuario?.id;

  useEffect(() => {
    if (showConfig && adminId) {
      fetch(`http://localhost:3000/administradores/${adminId}`)
        .then((r) => r.json())
        .then((data) => {
          setForm({
            nome: data.nome || "",
            cpf: data.cpf || "",
            email: data.email || "",
            senha: data.senha || "",
          });
          setEditId(data.id);
        })
        .catch(() => setMsg("Erro ao carregar dados do administrador."));
    }
  }, [showConfig, adminId]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    if (!editId) return;
    try {
      const resp = await fetch(`http://localhost:3000/administradores/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (resp.ok) {
        setMsg("Dados atualizados!");
        // Atualiza localStorage se o admin mudou email/nome
        localStorage.setItem(
          "usuarioLogado",
          JSON.stringify({ ...usuario, ...form })
        );
      } else {
        let msg = "Erro ao atualizar dados.";
        try {
          const data = await resp.json();
          if (data?.error) msg = data.error;
        } catch {}
        setMsg(msg);
      }
    } catch {
      setMsg("Erro ao atualizar dados.");
    }
  }

  async function handleDelete() {
    if (!window.confirm("Deseja realmente apagar sua conta?")) return;
    await fetch(`http://localhost:3000/administradores/${editId}`, { method: "DELETE" });
    localStorage.removeItem("usuarioLogado");
    window.location.href = "/login";
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-10 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">Painel Inicial do Sistema</h1>
          <p className="text-lg text-center mb-10 text-gray-700">
            Bem-vindo ao sistema de gerenciamento do aeroporto! <br />
            Utilize o menu lateral para acessar as funcionalidades do sistema.<br />
            <span className="block mt-4 text-base text-gray-500">
              Aqui você pode gerenciar voos, funcionários, aeronaves, vendas e combustível de forma rápida e intuitiva.
            </span>
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
            <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
              <span className="text-4xl mb-2">✈️</span>
              <span className="font-semibold text-lg mb-1">Voos</span>
              <span className="text-gray-500 text-sm text-center">Gerencie, edite e acompanhe todos os voos programados.</span>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
              <span className="text-4xl mb-2">👥</span>
              <span className="font-semibold text-lg mb-1">Funcionários</span>
              <span className="text-gray-500 text-sm text-center">Cadastre, edite e remova funcionários do sistema.</span>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
              <span className="text-4xl mb-2">🛩️</span>
              <span className="font-semibold text-lg mb-1">Aeronaves</span>
              <span className="text-gray-500 text-sm text-center">Gerencie aeronaves e controle o combustível disponível.</span>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition">
              <span className="text-4xl mb-2">⚙️</span>
              <span className="font-semibold text-lg mb-1">Configurações</span>
              <span className="text-gray-500 text-sm text-center">Altere ou apague sua conta de administrador.</span>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition"
              onClick={() => setShowConfig((v) => !v)}
            >
              {showConfig ? "Fechar Configurações" : "Configurações da Minha Conta"}
            </button>
          </div>
          {showConfig && (
            <section className="mt-10 bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold mb-4 text-center">Minha Conta de Administrador</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
                <label>Nome</label>
                <input name="nome" value={form.nome} onChange={handleChange} className="border rounded p-2" required />
                <label>CPF</label>
                <input name="cpf" value={form.cpf} onChange={handleChange} className="border rounded p-2" required />
                <label>E-mail</label>
                <input name="email" value={form.email} onChange={handleChange} className="border rounded p-2" required />
                <label>Senha</label>
                <input name="senha" type="password" value={form.senha} onChange={handleChange} className="border rounded p-2" required />
                <button className="bg-blue-600 text-white rounded p-2 mt-2">Salvar Alterações</button>
                {msg && <p className={msg.includes("erro") ? "text-red-500" : "text-green-600"}>{msg}</p>}
              </form>
              <div className="flex justify-end">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Apagar Minha Conta
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}