import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Voo() {
  const { id } = useParams();
  const [voo, setVoo] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/voos/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setVoo)
      .catch(() => setErro("Erro ao carregar detalhes do voo."));
  }, [id]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-6 border-b pb-3">Detalhes do Voo</h1>
        <div className="bg-white rounded-lg shadow p-6 max-w-lg">
          {erro && <p className="text-red-500">{erro}</p>}
          {!voo && !erro && <p>Carregando...</p>}
          {voo && (
            <>
              <p><strong>Número:</strong> {voo.numero}</p>
              <p><strong>Data:</strong> {voo.data}</p>
              <p><strong>Hora:</strong> {voo.hora}</p>
              <p><strong>Aeronave:</strong> {voo.aeronave}</p>
              <p><strong>Portão:</strong> {voo.portao}</p>
              <p><strong>Piloto:</strong> {voo.piloto}</p>
              <p><strong>Status:</strong> {voo.status}</p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
