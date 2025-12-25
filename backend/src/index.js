import dotenv from "dotenv";
dotenv.config();

import express from "express";
import platosRoutes from "./routes/platos.js"; 
import reservasRoutes from "./routes/reservas.js";
import restaurantesRoutes from "./routes/restaurantes.js";

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// CORS
// CORS 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  next();
});

// Rutas
app.use("/platos", platosRoutes); 
app.use("/reservas", reservasRoutes);
app.use("/restaurantes", restaurantesRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

