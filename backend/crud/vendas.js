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
  const { voo_id, quantidade, valor_total, data_vendas } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO vendas (voo_id, quantidade, valor_total, data_vendas) VALUES ($1, $2, $3, $4) RETURNING *",
      [voo_id, quantidade, valor_total, data_vendas]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar venda
router.put("/:id", async (req, res) => {
  const { voo_id, quantidade, valor_total, data_vendas } = req.body;
  try {
    const result = await pool.query(
      "UPDATE vendas SET voo_id=$1, quantidade=$2, valor_total=$3, data_vendas=$4 WHERE id=$5 RETURNING *",
      [voo_id, quantidade, valor_total, data_vendas, req.params.id]
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
