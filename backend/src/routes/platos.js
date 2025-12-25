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
