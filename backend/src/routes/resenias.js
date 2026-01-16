import express from "express";
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

console.log("RESENIAS ROUTE CARGADO");

const { Pool } = pkg;
const router = express.Router();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// GET todas las reseñas
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM resenias ORDER BY fecha_creacion DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener reseñas" });
  }
});

// GET reseñas de un restaurante
router.get("/restaurante/:id", async (req, res) => {
  const restauranteId = req.params.id;
  try {
    const result = await pool.query(
      "SELECT * FROM resenias WHERE restaurante_id = $1 ORDER BY fecha_creacion DESC",
      [restauranteId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener reseñas del restaurante" });
  }
});

// GET reseña por id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM resenias WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reseña no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener reseña" });
  }
});


// POST crear reseña
router.post("/", async (req, res) => {
  const { restaurante_id, comensal, titulo, contenido, estrellas } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO resenias
       (restaurante_id, comensal, titulo, contenido, estrellas)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [restaurante_id, comensal, titulo, contenido, estrellas]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al crear reseña" });
  }
});

// PUT Editar reseña 
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { comensal, titulo, contenido, estrellas } = req.body;

  try {
    const result = await pool.query(
      `UPDATE resenias
       SET comensal = $1,
           titulo = $2,
           contenido = $3,
           estrellas = $4
       WHERE id = $5
       RETURNING *`,
      [comensal, titulo, contenido, estrellas, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reseña no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al editar reseña" });
  }
});


// DELETE Eliminar reseña
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM resenias WHERE id = $1", [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Error al borrar reseña" });
  }
});

export default router;