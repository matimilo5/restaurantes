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
