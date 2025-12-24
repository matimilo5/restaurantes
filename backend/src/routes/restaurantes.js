import dotenv from "dotenv";
dotenv.config();

import express from "express";
import pkg from "pg";

const { Pool } = pkg;
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

/* GET todos los restaurantes */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM restaurantes");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener restaurantes" });
  }
});

/* GET restaurante por ID */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM restaurantes WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Restaurante no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener restaurante" });
  }
});

/* POST crear restaurante */
router.post("/", async (req, res) => {
  const {
    nombre,
    direccion,
    ciudad,
    tipo_comida,
    calificacion,
    foto_url
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO restaurantes 
       (nombre, direccion, ciudad, tipo_comida, calificacion, foto_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nombre, direccion, ciudad, tipo_comida, calificacion, foto_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear restaurante" });
  }
});

/* PUT editar restaurante */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    direccion,
    ciudad,
    tipo_comida,
    calificacion,
    foto_url
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE restaurantes SET
        nombre = $1,
        direccion = $2,
        ciudad = $3,
        tipo_comida = $4,
        calificacion = $5,
        foto_url = $6
       WHERE id = $7
       RETURNING *`,
      [
        nombre,
        direccion,
        ciudad,
        tipo_comida,
        calificacion,
        foto_url,
        id
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Restaurante no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al editar restaurante" });
  }
});

/* DELETE restaurante */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM restaurantes WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Restaurante no encontrado" });
    }

    res.json({ mensaje: "Restaurante eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar restaurante" });
  }
});

export default router;

