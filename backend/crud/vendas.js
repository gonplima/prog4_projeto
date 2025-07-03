import express from "express";
import pool from "../bd/index.js";
const router = express.Router();

// Listar vendas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vendas");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter venda por ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM vendas WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Venda não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar venda
router.post("/", async (req, res) => {
  const { voos_id, funcionario_id, quantidade } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO vendas (voos_id, funcionario_id, quantidade) VALUES ($1, $2, $3) RETURNING *",
      [voos_id, funcionario_id, quantidade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar venda
router.put("/:id", async (req, res) => {
  const { voos_id, funcionario_id, quantidade } = req.body;
  try {
    const result = await pool.query(
      "UPDATE vendas SET voos_id=$1, funcionario_id=$2, quantidade=$3 WHERE id=$4 RETURNING *",
      [voos_id, funcionario_id, quantidade, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Venda não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar venda
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM vendas WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Venda não encontrada" });
    res.json({ message: "Venda removida" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
