import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// GET todos los platos, filtrando por restaurante_id si viene en query
router.get("/", async (req, res) => {
  const { restaurante_id } = req.query;

  try {
    let result;
    if (restaurante_id) {
      result = await pool.query(
        "SELECT * FROM platos WHERE restaurante_id=$1",
        [restaurante_id]
      );
    } else {
      result = await pool.query("SELECT * FROM platos");
    }
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener platos" });
  }
});

// GET plato por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM platos WHERE id=$1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Plato no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener plato" });
  }
});

// POST crear plato
router.post("/", async (req, res) => {
  const { nombre, descripcion, precio, tiempo_elaboracion, nivel, foto_url, restaurante_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO platos 
       (nombre, descripcion, precio, tiempo_elaboracion, nivel, foto_url, restaurante_id) 
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [nombre, descripcion, precio, tiempo_elaboracion, nivel, foto_url, restaurante_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear plato" });
  }
});

// PUT editar plato
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, tiempo_elaboracion, nivel, foto_url, restaurante_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE platos SET 
       nombre=$1, descripcion=$2, precio=$3, tiempo_elaboracion=$4, nivel=$5, foto_url=$6, restaurante_id=$7
       WHERE id=$8 RETURNING *`,
      [nombre, descripcion, precio, tiempo_elaboracion, nivel, foto_url, restaurante_id, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Plato no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar plato" });
  }
});

// DELETE plato
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM platos WHERE id=$1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Plato no encontrado" });
    }
    res.json({ mensaje: "Plato eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar plato" });
  }
});

export default router;
