import express from "express";
import dotenv from "dotenv";
import pool from "./bd/index.js"; // precisa do .js no final

dotenv.config();

const app = express();
app.use(express.json());

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, server_time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});



app.post("/aeronaves", async (req, res) => {
  const { nome } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO aeronaves (nome) VALUES ($1) RETURNING *",
      [nome]
    );
    res.status(201).json({ success: true, aeronave: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/aeronaves", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM aeronaves");
    res.json({ success: true, aeronaves: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
