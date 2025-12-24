import dotenv from "dotenv";
dotenv.config();

import express from "express";
import restaurantesRoutes from "./routes/restaurantes.js";

const app = express();
app.use(express.json());

// CORS 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  next();
});

// Rutas
app.use("/restaurantes", restaurantesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

