import express from "express";
import pool from "../bd/index.js";
const router = express.Router();

// Listar todas as aeronaves
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM aeronaves");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter uma aeronave por ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM aeronaves WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Aeronave não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar aeronave
router.post("/", async (req, res) => {
  const { nome, combustivel_disponivel } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO aeronaves (nome, combustivel_disponivel) VALUES ($1, $2) RETURNING *",
      [nome, combustivel_disponivel]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar aeronave
router.put("/:id", async (req, res) => {
  const { nome, combustivel_disponivel } = req.body;
  try {
    const result = await pool.query(
      "UPDATE aeronaves SET nome=$1, combustivel_disponivel=$2 WHERE id=$3 RETURNING *",
      [nome, combustivel_disponivel, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Aeronave não encontrada" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar aeronave
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM aeronaves WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Aeronave não encontrada" });
    res.json({ message: "Aeronave removida" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
