import express from "express";
import pool from "../bd/index.js";
const router = express.Router();

// Listar passageiros
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM passageiros");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter passageiro por ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM passageiros WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Passageiro não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar passageiro
router.post("/", async (req, res) => {
  const { nome, cpf, email, voo_id, funcionario_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO passageiros (nome, cpf, email, voo_id, funcionario_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nome, cpf, email, voo_id, funcionario_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar passageiro
router.put("/:id", async (req, res) => {
  const { nome, cpf, email, voo_id, funcionario_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE passageiros SET nome=$1, cpf=$2, email=$3, voo_id=$4, funcionario_id=$5 WHERE id=$6 RETURNING *",
      [nome, cpf, email, voo_id, funcionario_id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Passageiro não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar passageiro
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM passageiros WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Passageiro não encontrado" });
    res.json({ message: "Passageiro removido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
