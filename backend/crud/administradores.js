import express from "express";
import pool from "../bd/index.js";
const router = express.Router();

// Listar administradores
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM administradores");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter administrador por ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM administradores WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Administrador não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar administrador
router.post("/", async (req, res) => {
  const { nome, cpf, email, senha } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO administradores (nome, cpf, email, senha) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, cpf, email, senha]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar administrador
router.put("/:id", async (req, res) => {
  const { nome, cpf, email, senha } = req.body;
  try {
    const result = await pool.query(
      "UPDATE administradores SET nome=$1, cpf=$2, email=$3, senha=$4 WHERE id=$5 RETURNING *",
      [nome, cpf, email, senha, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Administrador não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar administrador
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM administradores WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Administrador não encontrado" });
    res.json({ message: "Administrador removido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
