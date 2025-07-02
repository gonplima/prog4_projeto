import express from "express";
import pool from "../bd/index.js";
const router = express.Router();

// Listar voos
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM voos");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter voo por ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM voos WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Voo não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar voo
router.post("/", async (req, res) => {
  const { origem, destino, piloto, plataforma, aeronave_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO voos (origem, destino, piloto, plataforma, aeronave_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [origem, destino, piloto, plataforma, aeronave_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar voo
router.put("/:id", async (req, res) => {
  const { origem, destino, piloto, plataforma, aeronave_id } = req.body;
  try {
    const result = await pool.query(
      "UPDATE voos SET origem=$1, destino=$2, piloto=$3, plataforma=$4, aeronave_id=$5 WHERE id=$6 RETURNING *",
      [origem, destino, piloto, plataforma, aeronave_id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Voo não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar voo
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM voos WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Voo não encontrado" });
    res.json({ message: "Voo removido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
