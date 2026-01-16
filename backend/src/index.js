import dotenv from "dotenv";
dotenv.config();

import express from "express";
import restaurantesRoutes from "./routes/restaurantes.js";
import platosRoutes from "./routes/platos.js"; 
import reservasRoutes from "./routes/reservas.js";
import ingredientesRoutes from "./routes/ingredientes.js";
import resenias from "./routes/resenias.js";

const app = express();

// Middleware para parsear JSON
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
app.use("/platos", platosRoutes); 
app.use("/reservas", reservasRoutes);
app.use("/ingredientes", ingredientesRoutes);
app.use("/resenias", resenias);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
