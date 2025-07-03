import { useEffect, useState } from "react";
import SidebarFuncionario from "../components/SidebarFuncionario";
import { useNavigate } from "react-router-dom";

export default function FuncionarioHome() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
  const funcId = usuario?.id;
  const navigate = useNavigate();

  // Voos e passageiros
  const [voos, setVoos] = useState([]);
  const [passageiros, setPassageiros] = useState([]);
  const [aeronaves, setAeronaves] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [erro, setErro] = useState(null);

  // Passageiro form
  const [form, setForm] = useState({ nome: "", cpf: "", email: "", voo_id: "" });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");

  // Conta
  const [showConfig, setShowConfig] = useState(false);
  const [contaForm, setContaForm] = useState({ nome: "", cpf: "", email: "", funcao: "", senha: "" });
  const [contaMsg, setContaMsg] = useState("");

  function carregar() {
    fetch("http://localhost:3000/voos")
      .then((r) => r.json())
      .then(setVoos);
    fetch("http://localhost:3000/aeronaves")
      .then((r) => r.json())
      .then(setAeronaves);
    fetch("http://localhost:3000/passageiros")
      .then((r) => r.json())
      .then(setPassageiros);
    fetch("http://localhost:3000/vendas")
      .then((r) => r.json())
      .then(setVendas);
  }

  useEffect(() => {
    carregar();
  }, []);

  // Conta do funcionário
  useEffect(() => {
    if (showConfig && funcId) {
      fetch(`http://localhost:3000/funcionarios/${funcId}`)
        .then((r) => r.json())
        .then((data) => {
          setContaForm({
            nome: data.nome || "",
            cpf: data.cpf || "",
            email: data.email || "",
            funcao: data.funcao || "",
            senha: data.senha || "",
          });
        })
        .catch(() => setContaMsg("Erro ao carregar dados do funcionário."));
    }
  }, [showConfig, funcId]);

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
        // Cria venda ao adicionar passageiro
        if (resp.ok) {
          const novoPassageiro = await resp.json();
          await fetch("http://localhost:3000/vendas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              voos_id: novoPassageiro.voo_id,
              funcionario_id: funcId,
              quantidade: 1,
            }),
          });
        }
      }
      if (resp.ok) {
        setMsg(editId ? "Passageiro atualizado!" : "Passageiro adicionado!");
        setForm({ nome: "", cpf: "", email: "", voo_id: "" });
        setEditId(null);
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
  }

  async function handleDelete(id) {
    if (!window.confirm("Remover passageiro?")) return;
    await fetch(`http://localhost:3000/passageiros/${id}`, { method: "DELETE" });
    carregar();
  }

  // Conta do funcionário
  function handleContaChange(e) {
    setContaForm({ ...contaForm, [e.target.name]: e.target.value });
  }

  async function handleContaSubmit(e) {
    e.preventDefault();
    setContaMsg("");
    try {
      const resp = await fetch(`http://localhost:3000/funcionarios/${funcId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contaForm),
      });
      if (resp.ok) {
        setContaMsg("Dados atualizados!");
        localStorage.setItem("usuarioLogado", JSON.stringify({ ...usuario, ...contaForm }));
      } else {
        setContaMsg("Erro ao atualizar dados.");
      }
    } catch {
      setContaMsg("Erro ao atualizar dados.");
    }
  }

  async function handleContaDelete() {
    if (!window.confirm("Deseja realmente apagar sua conta?")) return;
    await fetch(`http://localhost:3000/funcionarios/${funcId}`, { method: "DELETE" });
    localStorage.removeItem("usuarioLogado");
    navigate("/login");
  }

  // Vendas do funcionário
  const minhasVendas = vendas.filter((v) => String(v.funcionario_id) === String(funcId));
  const totalVendas = minhasVendas.reduce((acc, v) => acc + Number(v.quantidade), 0);

  function getVooInfo(id) {
    const v = voos.find((x) => String(x.id) === String(id));
    if (!v) return "Voo não encontrado";
    const aero = aeronaves.find((a) => String(a.id) === String(v.aeronave_id));
    return `${v.origem} → ${v.destino} | Aeronave: ${aero ? aero.nome : v.aeronave_id}`;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarFuncionario />
      <main className="flex-1 p-10 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">Painel do Funcionário</h1>
          <p className="text-lg text-center mb-10 text-gray-700">
            Bem-vindo, {usuario.nome}! <br />
            Aqui você pode gerenciar passageiros dos voos, ver suas vendas e editar sua conta.
          </p>
  
          {/* Conta */}
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
              <h2 className="text-xl font-semibold mb-4 text-center">Minha Conta de Funcionário</h2>
              <form onSubmit={handleContaSubmit} className="flex flex-col gap-3 mb-6">
                <label>Nome</label>
                <input name="nome" value={contaForm.nome} onChange={handleContaChange} className="border rounded p-2" required />
                <label>CPF</label>
                <input name="cpf" value={contaForm.cpf} onChange={handleContaChange} className="border rounded p-2" required />
                <label>E-mail</label>
                <input name="email" value={contaForm.email} onChange={handleContaChange} className="border rounded p-2" required />
                <label>Função</label>
                <input name="funcao" value={contaForm.funcao} onChange={handleContaChange} className="border rounded p-2" required />
                <label>Senha</label>
                <input name="senha" type="password" value={contaForm.senha} onChange={handleContaChange} className="border rounded p-2" required />
                <button className="bg-blue-600 text-white rounded p-2 mt-2">Salvar Alterações</button>
                {contaMsg && <p className={contaMsg.includes("erro") ? "text-red-500" : "text-green-600"}>{contaMsg}</p>}
              </form>
              <div className="flex justify-end">
                <button
                  onClick={handleContaDelete}
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
