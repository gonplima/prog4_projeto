import express from "express";
import pool from "../bd/index.js";
const router = express.Router();

// Obter o estoque total de combustível (id=1)
router.get("/total", async (req, res) => {
  try {
    const result = await pool.query("SELECT quantidade FROM combustivel WHERE id = 1");
    if (result.rows.length === 0) return res.status(404).json({ error: "Estoque de combustível não encontrado" });
    res.json({ quantidade: result.rows[0].quantidade });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar o estoque total (adicionar/remover)
router.put("/total", async (req, res) => {
  const { quantidade } = req.body; // quantidade pode ser positiva ou negativa
  try {
    const result = await pool.query(
      "UPDATE combustivel SET quantidade = quantidade + $1, data_atualizacao = NOW() WHERE id = 1 RETURNING *",
      [quantidade]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Estoque de combustível não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
