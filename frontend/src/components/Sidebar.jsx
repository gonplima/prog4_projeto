import { Link, useLocation, useNavigate } from "react-router-dom";

// Sidebar única, menu dinâmico conforme tipo de usuário
export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
  const tipo = usuario?.tipo;

  // Menu dinâmico
  const menu = [
    {
      to: tipo === "funcionario" ? "/funcionario" : "/adm",
      label: "Início",
      show: true,
    },
    {
      to: "/funcionarios",
      label: "Funcionários",
      show: tipo === "admin",
    },
    {
      to: "/aeronaves",
      label: "Aeronaves",
      show: true,
    },
    {
      to: "/voos",
      label: "Voos",
      show: true,
    },
    {
      to: "/combustivel",
      label: "Combustível",
      show: true,
    }
  ];

  function handleLogout() {
    localStorage.removeItem("usuarioLogado");
    navigate("/login");
  }
 
  return (
    <aside className="w-60 bg-gray-50 p-6 border-r flex flex-col">
      <div className="text-center mb-8">
        <p className="font-semibold text-blue-700 text-xl select-none">
          {usuario.nome || (tipo === "funcionario" ? "Funcionário" : "Administrador")}
        </p>
        <p className="font-semibold text-gray-800">
          {tipo === "funcionario" ? "Funcionário" : "Administrador"}
        </p>
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        {menu.filter(item => item.show).map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`px-4 py-3 rounded-lg font-medium transition ${
              location.pathname === item.to
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-8 px-4 py-3 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition"
      >
        Sair
      </button>
    </aside>
  );
}
