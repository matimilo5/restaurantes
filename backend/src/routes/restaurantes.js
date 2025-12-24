import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM restaurantes");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener restaurantes" });
  }
});

export default router;

