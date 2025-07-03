import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    // Tenta login como administrador
    let resp = await fetch("http://localhost:3000/administradores");
    let admins = [];
    if (resp.ok) admins = await resp.json();
    const adm = admins.find((u) => u.email === email && u.senha === senha);

    if (adm) {
      localStorage.setItem("usuarioLogado", JSON.stringify({ ...adm, tipo: "admin" }));
      navigate("/adm");
      return;
    }

    // Tenta login como funcionário
    resp = await fetch("http://localhost:3000/funcionarios");
    let funcs = [];
    if (resp.ok) funcs = await resp.json();
    const func = funcs.find((u) => u.email === email && u.senha === senha);

    if (func) {
      localStorage.setItem("usuarioLogado", JSON.stringify({ ...func, tipo: "funcionario" }));
      navigate("/funcionario");
      return;
    }

    setMsg("E-mail ou senha inválidos.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow max-w-sm w-full flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold mb-2 text-center">Login</h1>
        <input
          type="email"
          placeholder="E-mail"
          className="border rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="border rounded p-2"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white rounded p-2 mt-2">
          Entrar
        </button>
        {msg && <p className="text-red-500 text-center">{msg}</p>}
        <p className="text-center text-sm mt-2">
          Ainda não tem conta?{" "}
          <a href="/cadastro" className="text-blue-600 font-medium">
            Cadastre-se
          </a>
        </p>
      </form>
    </div>
  );
}
