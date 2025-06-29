import express from "express";
import pool from "../bd/index.js";
const router = express.Router();

// Listar usuários
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obter usuário por ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar usuário
router.post("/", async (req, res) => {
  const { nome, cpf, email, celular, senha, permissao, criado_em } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO usuarios (nome, cpf, email, celular, senha, permissao, criado_em) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [nome, cpf, email, celular, senha, permissao, criado_em]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar usuário
router.put("/:id", async (req, res) => {
  const { nome, cpf, email, celular, senha, permissao, criado_em } = req.body;
  try {
    const result = await pool.query(
      "UPDATE usuarios SET nome=$1, cpf=$2, email=$3, celular=$4, senha=$5, permissao=$6, criado_em=$7 WHERE id=$8 RETURNING *",
      [nome, cpf, email, celular, senha, permissao, criado_em, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar usuário
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM usuarios WHERE id=$1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json({ message: "Usuário removido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
