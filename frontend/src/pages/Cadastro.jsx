import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    senha: "",
  });
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (!form.senha) return setErro("Senha obrigatória.");
    try {
      const resp = await fetch("http://localhost:3000/administradores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          cpf: form.cpf,
          email: form.email,
          senha: form.senha,
        }),
      });
      if (resp.ok) {
        navigate("/login");
      } else {
        // Tenta extrair mensagem específica do backend
        let msg = "Erro ao cadastrar administrador.";
        try {
          const data = await resp.json();
          if (data?.error) {
            if (data.error.includes("unique") && data.error.includes("cpf")) {
              msg = "Já existe um administrador com esse CPF.";
            } else if (data.error.includes("unique") && data.error.includes("email")) {
              msg = "Já existe uma conta com esse e-mail.";
            } else {
              msg = data.error;
            }
          }
        } catch {}
        setErro(msg);
      }
    } catch {
      setErro("Erro ao cadastrar administrador.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <Link to="/login" className="text-blue-600 text-xl inline-block">← Voltar para Login</Link>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Cadastro de Administrador</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="nome" className="font-medium">Nome completo</label>
          <input type="text" id="nome" name="nome" className="p-3 border rounded-lg" value={form.nome} onChange={handleChange} required />
          <label htmlFor="cpf" className="font-medium">CPF</label>
          <input type="text" id="cpf" name="cpf" className="p-3 border rounded-lg" value={form.cpf} onChange={handleChange} required />
          <label htmlFor="email" className="font-medium">E-mail</label>
          <input type="email" id="email" name="email" className="p-3 border rounded-lg" value={form.email} onChange={handleChange} required />
          <label htmlFor="senha" className="font-medium">Senha</label>
          <input type="password" id="senha" name="senha" className="p-3 border rounded-lg" value={form.senha} onChange={handleChange} required />
          <button type="submit" className="p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Cadastrar</button>
          {erro && <p className="text-red-500 text-center">{erro}</p>}
        </form>
      </div>
    </div>
  );
}