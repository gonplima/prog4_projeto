import express from "express";
import pool from "../bd/index.js";
const router = express.Router();

// Listar todos os combustíveis
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM combustivel");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter combustível por ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM combustivel WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Combustível não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar novo combustível
router.post("/", async (req, res) => {
  const { caminhao, quantidade, data_atualizacao } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO combustivel (caminhao, quantidade, data_atualizacao) VALUES ($1, $2, $3) RETURNING *",
      [caminhao, quantidade, data_atualizacao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar combustível
router.put("/:id", async (req, res) => {
  const { caminhao, quantidade, data_atualizacao } = req.body;
  try {
    const result = await pool.query(
      "UPDATE combustivel SET caminhao=$1, quantidade=$2, data_atualizacao=$3 WHERE id=$4 RETURNING *",
      [caminhao, quantidade, data_atualizacao, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Combustível não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar combustível
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM combustivel WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Combustível não encontrado" });
    res.json({ message: "Combustível removido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
