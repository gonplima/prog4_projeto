import express from "express";
import pool from "../bd/index.js";
const router = express.Router();

// Listar funcionários
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM funcionarios");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter funcionário por ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM funcionarios WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Funcionário não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar funcionário
router.post("/", async (req, res) => {
  const { nome, ocupacao, usuario_id, ativo } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO funcionarios (nome, ocupacao, usuario_id, ativo) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, ocupacao, usuario_id, ativo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar funcionário
router.put("/:id", async (req, res) => {
  const { nome, ocupacao, usuario_id, ativo } = req.body;
  try {
    const result = await pool.query(
      "UPDATE funcionarios SET nome=$1, ocupacao=$2, usuario_id=$3, ativo=$4 WHERE id=$5 RETURNING *",
      [nome, ocupacao, usuario_id, ativo, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Funcionário não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar funcionário
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM funcionarios WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Funcionário não encontrado" });
    res.json({ message: "Funcionário removido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
