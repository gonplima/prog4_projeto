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
  const { numero, origem, destino, data, hora, aeronave, portao, piloto, status } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO voos (numero, origem, destino, data, hora, aeronave, portao, piloto, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [numero, origem, destino, data, hora, aeronave, portao, piloto, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar voo
router.put("/:id", async (req, res) => {
  const { numero, origem, destino, data, hora, aeronave, portao, piloto, status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE voos SET numero=$1, origem=$2, destino=$3, data=$4, hora=$5, aeronave=$6, portao=$7, piloto=$8, status=$9 WHERE id=$10 RETURNING *",
      [numero, origem, destino, data, hora, aeronave, portao, piloto, status, req.params.id]
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
