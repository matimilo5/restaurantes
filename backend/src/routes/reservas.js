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

