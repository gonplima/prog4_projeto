import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Adm from "./pages/Adm";
import Funcionarios from "./pages/Funcionarios";
import Voos from "./pages/Voos";
import Voo from "./pages/Voo";
import Combustivel from "./pages/Combustivel";
import Vendas from "./pages/Vendas";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Aeronaves from "./pages/Aeronaves";
import FuncionarioHome from "./pages/FuncionarioHome"; // <-- adicionado
import Passageiros from "./pages/Passageiros"

// Componente para proteger rotas
function PrivateRoute({ children }) {
  const usuario = localStorage.getItem("usuarioLogado");
  return usuario ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const usuario = localStorage.getItem("usuarioLogado");
  if (!usuario) return <Navigate to="/login" />;
  try {
    const userObj = JSON.parse(usuario);
    if (userObj && userObj.tipo === "admin") {
      return children;
    }
    return <Navigate to="/voos" />;
  } catch {
    return <Navigate to="/login" />;
  }
}

function FuncionarioRoute({ children }) {
  const usuario = localStorage.getItem("usuarioLogado");
  if (!usuario) return <Navigate to="/login" />;
  try {
    const userObj = JSON.parse(usuario);
    if (userObj && userObj.tipo === "funcionario") {
      return children;
    }
    return <Navigate to="/adm" />;
  } catch {
    return <Navigate to="/login" />;
  }
}

function FuncionarioLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-10 flex flex-col items-center">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route
          path="/adm"
          element={
            <AdminRoute>
              <Adm />
            </AdminRoute>
          }
        />
        <Route
          path="/funcionarios"
          element={
            <AdminRoute>
              <Funcionarios />
            </AdminRoute>
          }
        />
        <Route
          path="/voo/:id"
          element={
            <PrivateRoute>
              <Voo />
            </PrivateRoute>
          }
        />
        <Route
          path="/combustivel"
          element={
            <PrivateRoute>
              <Combustivel />
            </PrivateRoute>
          }
        />
        <Route
          path="/vendas"
          element={
            <PrivateRoute>
              <Vendas />
            </PrivateRoute>
          }
        />
        <Route
          path="/funcionario"
          element={
            <FuncionarioRoute>
              <FuncionarioHome />
            </FuncionarioRoute>
          }
        />
        <Route
          path="/voos"
          element={
            <PrivateRoute>
              <Voos />
            </PrivateRoute>
          }
        />
        <Route
          path="/aeronaves"
          element={
            <PrivateRoute>
              <Aeronaves />
            </PrivateRoute>
          }
        />
        <Route
          path="/passageiros"
          element={
            <PrivateRoute>
              <Passageiros />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
