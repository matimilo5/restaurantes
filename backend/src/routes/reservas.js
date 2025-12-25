import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// GET todas las reservas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reservas");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener reservas" });
  }
});

// GET reserva por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM reservas WHERE id=$1", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Reserva no encontrada" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener reserva" });
  }
});

// GET reservas por restaurante
router.get("/restaurante/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM reservas WHERE restaurante_id = $1 ORDER BY fecha, hora",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener reservas del restaurante" });
  }
});

// POST crear reserva
router.post("/", async (req, res) => {
  const { fecha, hora, restaurante_id, nombre, descripcion } = req.body;
  if (!fecha || !hora || !restaurante_id || !nombre) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }
  try {
    const result = await pool.query(
      `INSERT INTO reservas (fecha, hora, restaurante_id, nombre, descripcion)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [fecha, hora, restaurante_id, nombre, descripcion || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear reserva" });
  }
});

