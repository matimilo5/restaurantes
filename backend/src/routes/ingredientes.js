import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

/* GET todos los ingredientes */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM ingredientes");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener ingredientes" });
  }
});

/* GET ingredientes por plato */
router.get("/plato/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM ingredientes WHERE plato_id = $1",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener ingredientes del plato" });
  }
});

/* GET ingrediente por ID */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM ingredientes WHERE id = $1",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Ingrediente no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener ingrediente" });
  }
});

/* POST crear ingrediente */
router.post("/", async (req, res) => {
  const {
    nombre,
    origen,
    calorias,
    cantidad,
    tipo,
    foto_url,
    plato_id
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO ingredientes 
       (nombre, origen, calorias, cantidad, tipo, foto_url, plato_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [nombre, origen, calorias, cantidad, tipo, foto_url, plato_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear ingrediente" });
  }
});

