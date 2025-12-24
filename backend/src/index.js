import dotenv from "dotenv";
dotenv.config();

import express from "express";
import restaurantesRoutes from "./routes/restaurantes.js";

const app = express();
app.use(express.json());

app.use("/restaurantes", restaurantesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

