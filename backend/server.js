import express from "express";
import dotenv from "dotenv";
import pool from "./bd/index.js";
// Importação dos cruds
import aeronavesRouter from "./crud/aeronaves.js";
import combustivelRouter from "./crud/combustivel.js";
import funcionariosRouter from "./crud/funcionarios.js";
import usuariosRouter from "./crud/usuarios.js";
import vendasRouter from "./crud/vendas.js";
import voosRouter from "./crud/voos.js";

dotenv.config();

const app = express();
app.use(express.json());

// Teste de conexão
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, server_time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Rotas dos cruds
app.use("/aeronaves", aeronavesRouter);
app.use("/combustivel", combustivelRouter);
app.use("/funcionarios", funcionariosRouter);
app.use("/usuarios", usuariosRouter);
app.use("/vendas", vendasRouter);
app.use("/voos", voosRouter);

app.get("/", (req, res) => {
  res.send("API do Aviation Manager está rodando!");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
